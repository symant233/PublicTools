# Steam CS2 隐秘物品查询

查询给定 Steam ID 的用户 CS2 公开库存中，所有**可交易**的隐秘（Covert/红色）品质物品信息。

## 文件说明

| 文件        | 说明                                      |
| ----------- | ----------------------------------------- |
| `index.js`  | 主脚本 - 查询 CS2 库存并筛选隐秘品质物品  |
| `mailto.js` | 邮件通知脚本 - 当发现可交易物品时发送邮件 |

## 功能特点

- 获取所有可交易的 Covert（红色）品质物品
- 包括武器皮肤、刀具（★）、手套等
- 支持使用 Steam API Key 和 Cookie 增强访问
- 返回中文物品信息
- 支持邮件通知

## 注意事项

⚠️ **重要限制：**

1. **10 天隐藏政策：** 新获得的物品在 10 天内无法通过 API 获取，本脚本只能获取已过隐藏期的可交易物品
2. **API 限制：** Steam 库存 API 可能对返回的物品数量有限制（通常最多 5000 个）
3. **需要可交易状态：** 脚本只会返回 `tradable = 1` 的物品，交易冷却期内的物品不会显示
4. **网络限制：** 如果在 Pipedream 等平台访问 Steam API 遇到问题，可以尝试提供 API Key 或 Cookie

## index.js 参数

| 参数                  | 说明                                                                | 必填 |
| --------------------- | ------------------------------------------------------------------- | ---- |
| `steam_id`            | Steam 64 位 ID（17 位数字，以 765 开头）                            | ✅   |
| `steam_api_key`       | Steam Web API Key，如果库存访问有问题可以尝试提供                   | ❌   |
| `steam_login_secure`  | Steam 的 loginSecure cookie（格式：`76561198XXXXX\|\|XXXXXXXXX`），用于访问私有库存 | ❌   |

### 如何获取参数

**Steam API Key:**
访问 [https://steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey) 申请

**Steam loginSecure Cookie:**
1. 在浏览器中登录 Steam
2. 打开开发者工具（F12）
3. 进入 Application/应用程序 → Cookies → `https://steamcommunity.com`
4. 找到 `steamLoginSecure` cookie，复制它的值

## mailto.js 参数

| 参数                  | 说明                     | 必填 |
| --------------------- | ------------------------ | ---- |
| `inventory_step_name` | 前一个库存查询步骤的名称 | ✅   |

## 返回数据

- `total_covert_items`: 红色物品总数
- `total_items`: 库存总物品数
- `steam_id`: 查询的 Steam ID
- `covert_items`: 物品详情列表
  - `assetid`: 物品资产 ID
  - `name`: 完整物品名称
  - `weapon_name`: 武器名称（刀具/手套/武器）
  - `skin_name`: 皮肤名称
  - `item_type`: 物品类型（中文）
  - `condition`: 磨损程度（完整名称）
  - `condition_abbrev`: 磨损缩写（FN/MW/FT/WW/BS）
  - `rarity`: 稀有度（中文）
  - `market_hash_name`: 市场哈希名称
  - `market_url`: Steam 市场链接
  - `marketable`: 是否可市场交易
  - `icon_url`: 物品图标链接
  - `inspect_url`: 游戏内检视链接

## 前置要求

### 查询他人库存

目标用户的 Steam 隐私设置必须为公开：

1. 个人资料：公开
2. 游戏详情：公开
3. 库存：公开

### 查询自己的私有库存

如果要查询自己的私有库存（隐私设置不是公开），需要提供 `steam_login_secure` cookie 参数。

## 使用流程（Pipedream）

### 基础配置

1. 添加定时触发器（如每天执行一次）
2. 添加 `index.js` 作为 Action 步骤
   - 必填：`steam_id` - 你的 Steam ID
   - 可选：`steam_api_key` - 如果访问有问题可提供
   - 可选：`steam_login_secure` - 如果要访问私有库存需提供
3. （可选）添加 `mailto.js` 发送邮件通知
   - 填入上一步的步骤名称

### 获取 Steam ID

访问 [https://steamidfinder.com/](https://steamidfinder.com/) 输入你的 Steam 个人资料链接即可查询
