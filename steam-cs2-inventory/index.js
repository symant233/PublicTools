import { axios } from "@pipedream/platform";

export default defineComponent({
  name: "Get CS2 Covert Items",
  description:
    "Retrieve tradable CS2 Covert (red) quality items from a Steam user's public inventory",
  type: "action",
  props: {
    steam_id: {
      type: "string",
      label: "Steam ID",
      description:
        "The Steam ID of the user whose inventory to retrieve (64-bit Steam ID - should be 17 digits starting with 765)",
    },
    steam_api_key: {
      type: "string",
      label: "Steam API Key (可选)",
      description:
        "Steam Web API Key，如果库存访问有问题可以尝试提供",
      optional: true,
    },
    steam_login_secure: {
      type: "string",
      label: "Steam loginSecure Cookie (可选)",
      description:
        "Steam 的 loginSecure cookie，用于访问私有库存",
      optional: true,
    },
  },
  methods: {
    validateSteamId(steamId) {
      const steamIdRegex = /^765\d{14}$/;
      return steamIdRegex.test(steamId);
    },

    getPrivacyInstructions() {
      return `
需要配置 Steam 隐私设置：

1. 个人资料隐私：设为公开
2. 游戏详情隐私：设为公开（重要！）
3. 库存隐私：设为公开

操作步骤：
1. 访问 steamcommunity.com → 查看个人资料 → 编辑个人资料 → 隐私设置
2. 将以上三项都设为"公开"
3. 点击"保存"并等待 2-3 分钟生效
`;
    },

    async checkProfileAccessibility(steamId) {
      try {
        const profileResponse = await axios(this.$, {
          url: `https://steamcommunity.com/profiles/${steamId}?xml=1`,
          timeout: 15000,
        });

        if (profileResponse.includes("<error>")) {
          return {
            accessible: false,
            issue: "profile_not_found",
            message: "Steam 个人资料不存在或无法访问",
          };
        }

        if (
          profileResponse.includes("<privacyState>private</privacyState>") ||
          profileResponse.includes("<privacyState>friendsonly</privacyState>")
        ) {
          return {
            accessible: false,
            issue: "profile_private",
            message: "Steam 个人资料设置为私密或仅好友可见",
          };
        }

        return { accessible: true, message: "个人资料可访问" };
      } catch (error) {
        return {
          accessible: false,
          issue: "profile_check_failed",
          message: "无法检查个人资料可访问性",
        };
      }
    },

    async fetchInventory(steamId, apiKey, loginSecure) {
      const baseParams = { l: "schinese" };
      if (apiKey) {
        baseParams.key = apiKey;
      }
      
      const endpoints = [
        {
          url: `https://steamcommunity.com/inventory/${steamId}/730/2`,
          params: { ...baseParams, count: 5000 },
        },
        {
          url: `https://steamcommunity.com/inventory/${steamId}/730/2`,
          params: { ...baseParams, count: 2000 },
        },
        {
          url: `https://steamcommunity.com/inventory/${steamId}/730/2`,
          params: baseParams,
        },
      ];

      const headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: `https://steamcommunity.com/profiles/${steamId}/inventory`,
        Origin: "https://steamcommunity.com",
      };
      
      // 添加 loginSecure cookie
      if (loginSecure) {
        headers.Cookie = `steamLoginSecure=${loginSecure}`;
      }

      for (const endpoint of endpoints) {
        try {
          const response = await axios(this.$, {
            url: endpoint.url,
            params: endpoint.params,
            timeout: 30000,
            headers: headers,
          });

          if (response && response.success !== false && response.assets) {
            return { success: true, data: response, endpoint: endpoint.url };
          }
        } catch (error) {
          continue;
        }
      }

      return { success: false, data: null };
    },
  },

  async run({ $ }) {
    // 验证 Steam ID 格式
    if (!this.validateSteamId(this.steam_id)) {
      throw new Error(
        `Steam ID 格式无效。应为 17 位数字且以 '765' 开头。收到: ${this.steam_id}\n\n获取 Steam ID: 访问 steamidfinder.com`
      );
    }

    // 检查个人资料是否可访问
    const profileCheck = await this.checkProfileAccessibility(this.steam_id);

    if (!profileCheck.accessible) {
      throw new Error(
        `个人资料检查失败: ${
          profileCheck.message
        }\n\n${this.getPrivacyInstructions()}`
      );
    }

    // 获取库存
    const inventoryResult = await this.fetchInventory(
      this.steam_id, 
      this.steam_api_key,
      this.steam_login_secure
    );

    if (!inventoryResult.success) {
      throw new Error(
        `库存访问失败。请确保库存已设置为公开。\n\n${this.getPrivacyInstructions()}`
      );
    }

    const { assets, descriptions } = inventoryResult.data;

    console.debug(assets);
    console.debug(descriptions);

    // 检查库存数据是否存在
    if (!assets || !descriptions || assets.length === 0) {
      $.export("$summary", "库存中未找到 CS2 物品");
      return {
        total_covert_items: 0,
        steam_id: this.steam_id,
        covert_items: [],
        message: "该用户库存中没有 CS2 物品",
      };
    }

    // Create a map of descriptions for quick lookup
    const descriptionMap = {};
    descriptions.forEach((desc) => {
      const key = `${desc.classid}_${desc.instanceid}`;
      descriptionMap[key] = desc;
    });

    // Filter and process Covert (red) quality items
    const covertItems = [];

    for (const asset of assets) {
      const key = `${asset.classid}_${asset.instanceid}`;
      const description = descriptionMap[key];

      if (!description) continue;

      // Skip non-tradable items
      if (description.tradable !== 1) continue;

      // Check item type
      const typeTag = description.tags?.find((tag) => tag.category === "Type");
      const typeInternal = typeTag?.internal_name || "";

      // Check if it's a knife or glove
      const hasStarInName = description.market_name?.includes("★") || description.name?.includes("★");
      const isKnifeOrGlove =
        typeInternal === "CSGO_Type_Knife" ||
        typeInternal === "Type_Hands" ||
        hasStarInName ||
        description.market_name?.toLowerCase().includes("knife") ||
        description.market_name?.toLowerCase().includes("gloves") ||
        description.market_name?.includes("手套") ||
        description.market_name?.includes("刀");

      // Check rarity
      const rarityTag = description.tags?.find(
        (tag) => tag.category === "Rarity"
      );
      const rarityName = rarityTag?.localized_tag_name || rarityTag?.name || "";
      const rarityInternal = rarityTag?.internal_name || "";

      // 扩展稀有度判断：刀具和手套通常稀有度是 "Rarity_Contraband" 或其他特殊值
      const isCovert =
        rarityInternal === "Rarity_Ancient_Weapon" ||
        rarityInternal === "Rarity_Ancient_Character" ||
        rarityInternal === "Rarity_Ancient" ||
        rarityInternal === "Rarity_Contraband" ||
        rarityInternal?.includes("Ancient") ||
        rarityName === "Covert" ||
        rarityName.toLowerCase().includes("covert") ||
        rarityName.includes("隐秘") ||
        rarityName.includes("违禁") ||
        rarityName.toLowerCase().includes("contraband") ||
        isKnifeOrGlove;

      if (isCovert) {
        // Extract wear/condition
        const wearPatterns = {
          "Factory New": "FN",
          "Minimal Wear": "MW",
          "Field-Tested": "FT",
          "Well-Worn": "WW",
          "Battle-Scarred": "BS",
          崭新出厂: "FN",
          略有磨损: "MW",
          久经沙场: "FT",
          破损不堪: "WW",
          战痕累累: "BS",
        };

        let condition = "未知";
        let conditionAbbrev = "";
        const marketName = description.market_name || description.name || "";
        for (const [wear, abbrev] of Object.entries(wearPatterns)) {
          if (marketName.includes(wear)) {
            condition = wear;
            conditionAbbrev = abbrev;
            break;
          }
        }

        // 提取武器名称和皮肤名称
        let weaponName = "未知";
        let skinName = "";

        if (description.market_name) {
          const nameParts = description.market_name.split(" | ");
          if (nameParts.length > 0) {
            weaponName = nameParts[0].replace(/★\s*/, "");
          }
          if (nameParts.length > 1) {
            skinName = nameParts[1].replace(/\s*\([^)]+\)$/, "");
          }
        }

        const marketHashName = description.market_hash_name;
        const marketUrl = marketHashName
          ? `https://steamcommunity.com/market/listings/730/${encodeURIComponent(
              marketHashName
            )}`
          : null;

        covertItems.push({
          assetid: asset.assetid,
          name: description.market_name || description.name,
          weapon_name: weaponName,
          skin_name: skinName,
          item_type: typeTag?.localized_tag_name || "未知",
          condition: condition,
          condition_abbrev: conditionAbbrev,
          rarity: rarityTag?.localized_tag_name || "隐秘",
          market_hash_name: marketHashName,
          market_url: marketUrl,
          marketable: description.marketable === 1,
          icon_url: description.icon_url
            ? `https://steamcommunity-a.akamaihd.net/economy/image/${description.icon_url}`
            : null,
          inspect_url:
            description.actions?.find(
              (action) => action.name === "Inspect in Game..."
            )?.link || null,
        });
      }
    }

    // Sort by item type
    covertItems.sort((a, b) => a.item_type.localeCompare(b.item_type));

    if (covertItems.length === 0) {
      $.export("$summary", "未找到可交易的隐秘品质物品");
      return {
        total_covert_items: 0,
        steam_id: this.steam_id,
        covert_items: [],
        total_items: assets.length,
        message: "未找到可交易的隐秘（红色）品质物品",
      };
    }

    $.export("$summary", `找到 ${covertItems.length} 个可交易的隐秘品质物品`);

    return {
      total_covert_items: covertItems.length,
      total_items: assets.length,
      steam_id: this.steam_id,
      covert_items: covertItems,
    };
  },
});
