export default defineComponent({
  props: {
    inventory_step_name: {
      type: "string",
      label: "库存查询步骤名称",
      description:
        "前一个查询 CS2 库存的步骤名称（在 Pipedream 编辑器中查看步骤标题）",
      default: "get_cs2_covert_items",
    },
  },
  async run({ steps, $ }) {
    // 获取前一步骤的返回值
    const stepName = this.inventory_step_name;
    const step = steps[stepName];

    if (!step) {
      // 尝试列出可用的步骤名称
      const availableSteps = Object.keys(steps).filter(
        (key) => key !== "trigger"
      );
      throw new Error(
        `找不到步骤 "${stepName}"。\n\n可用的步骤名称: ${
          availableSteps.join(", ") || "无"
        }\n\n请在参数中填入正确的步骤名称。`
      );
    }

    const inventoryResult = step.$return_value;

    // 检查是否有可交易的红色物品
    if (!inventoryResult || inventoryResult.total_covert_items === 0) {
      $.export("$summary", "没有可交易的隐秘物品，跳过发送邮件");
      return { skipped: true, reason: "没有可交易的隐秘物品" };
    }

    // 格式化物品列表
    const items = inventoryResult.covert_items;
    const itemList = items
      .map((item, index) => {
        return `${index + 1}. ${item.name}
   - 类型: ${item.item_type}
   - 磨损: ${item.condition} (${item.condition_abbrev})
   - 稀有度: ${item.rarity}
   - 市场链接: ${item.market_url || "无"}`;
      })
      .join("\n\n");

    // 构建邮件内容
    const subject = `🎮 [${items.length}个] CS2 可交易隐秘物品通知`;

    const text = `Steam ID: ${inventoryResult.steam_id}

发现 ${items.length} 个可交易的隐秘（红色）品质物品：

${itemList}

---
库存总物品数: ${inventoryResult.total_items || "未知"}
此邮件由 Pipedream 自动发送`;

    // 发送邮件
    $.send.email({
      subject: subject,
      text: text,
    });

    $.export("$summary", `已发送邮件通知，包含 ${items.length} 个隐秘物品信息`);

    return {
      sent: true,
      items_count: items.length,
      steam_id: inventoryResult.steam_id,
    };
  },
});
