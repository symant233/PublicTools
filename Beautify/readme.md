通过CSS美化一些网站, 也有JS进行点击等功能

通用功能：以下匹配列网站都会更改滚动条为透明风格。

匹配列表与功能（v0.0.77版）

| 目标 | 匹配地址 | 功能 |
| --- | --- | --- |
| Vue文档 | https://\*.vuejs.org/* | 一键跳转中文文档 |
| 菜鸟教程 | https://www.runoob.com/* | 隐藏头部logo；移动搜索框到导航栏；简化头部 |
| 在线之家 | https://www.zxzj.me/* | 缩小间距省得用滚轮 |
| CSDN | https://blog.csdn.net/* | 自动点击展开全文 |
| ES6 | https://es6.ruanyifeng.com/* | 界面排版 |
| 百度文库 | https://wenku.baidu.com/* | 自动展开全文 |
| cube文档 | https://didi.github.io/cube-ui/* | 排版 |
| B站视频 | https://www.bilibili.com/* | 自动宽屏模式；按P进入画中画, Ctrl+ArrowRight下一集 |
| Bilibili | https://space.bilibili.com/* | 全站和空间页去除右键复制`?spm_id_from`参数 |
| Bing搜索 | https://cn.bing.com/search?q=* | 缩小左侧间距（surface友好） |
| Duck搜索 | https://duckduckgo.com/?q=* | 缩小左侧间距（surface友好） |
| 百度百科 | https://baike.baidu.com/* | 移除阴间字体；直接删除播放器；调整头部样式 |
| 研招调剂 | https://yz.chsi.com.cn/sytj/tj/* | 去除不符合不能调剂的信息；Ctrl+Enter查询 |
| 30SOC | https://www.30secondsofcode.org/* | 缩小导航栏（大的无语） |
| MDN | https://developer.mozilla.org/* | 缩小导航栏；一键切换中文 |
| 掘金草稿 | https://juejin.cn/editor/drafts/* | 缩小顶部 |
| QQ登录 | https://xui.ptlogin2.qq.com/cgi-bin/xlogin* | 去他大爷的扫码登录（该功能已关闭） |
| steam市场 | https://steamcommunity.com/* | 自动勾选同意条约 |
| pixiv | https://www.pixiv.net/* | （需配合另一脚本使用，见代码） |
| B站直播 | https://live.bilibili.com/* | 扩大右侧关注列表，网页全屏显示关注按钮 |
| Devtool | https://frontendwingman.com/* | 自动解锁 |
| NPM | https://www.npmjs.com/* | 去除顶部标语 |
| 知乎 | https://www.zhihu.com/* | 移除热榜无描述项 |
| 百度翻译 | https://fanyi.baidu.com/* | 紧凑排版 |
| M3U8.TV | https://jiexi.8old.cn/* | 添加快捷键(全屏f,倍速1~4) |
| 起点阅读 | https://read.qidian.com/* | 排版；去除广告 |
| 淘宝 | https://\*.taobao.com/* | 移除阴间字体，去除侧边广告栏占位 |
| 天猫 | https://\*.tmall.com/* | 移除阴间字体 |
| caddy | https://caddyserver.com/docs/* | 优化样式(字体,间隔等) |
| 力扣 | https://leetcode-cn.com/* | 移除广告, 自动全屏, 自动启用输出差别, `getMarkdown()`获取题解源码 |
| github | https://github.com/* | 隐藏左侧项目和组织栏滚动条 |
| 超星 | https://mooc1.chaoxing.com/work/* | 扩大答题输入框 |
| sci-hub | https://\*sci-hub.\*/* | 缩小左侧logo |
| 谷歌学术 | https://scholar.google.com/scholar?q=* | 移除安装sci-hub插件的html注入 |
| dlsite | https://www.dlsite.com/* | 使具体商品页面可选择商品名 |
| preact文档 | https://preactjs.com/* | 移除顶部和右上角元素 |
| React文档 | https://reactjs.org/* | 一键跳转到对应的中文页面 |
| 深入理解TS | https://basarat.gitbook.io/* | 缩小导航，移除广告，还原icon |
| Photopea | https://www.photopea.com/ | 隐藏右侧广告占位 |
| Phind | https://phind.com/* | 添加部分优先搜索网站(可在`/filters`改) |
| 牛客网 | https://hd.nowcoder.com/link.html?target=* | 取消链接跳转询问 |
| B站私信 | https://message.bilibili.com/* | 点击私信顶部UP主名字跳转其视频页面 |
| 百度网盘 | \*://pan.baidu.com/share/\* | 提取码自动提交 |
| 推特 | https://x.com/* | 更换旧版图标与标题 |
| 云伴 | https://\*.xiaoeknow.com/* | 添加视频控制快捷键（暂停、全屏和进度控制） |

（README更新可能不及时，一切以源码为准）

> 此脚本与 $uBlock$ 静态规则一起使用效果更佳; 我的[规则列表](https://gist.github.com/symant233/d0a50bfd4bb4e45726c8d9472cf154a7).

---

`Beautify` is a user script.

Which could be used by `Violentmonkey` or any other browser extensions. 

Source code is in this [repository](https://github.com/symant233/PublicTools), you can view a copy on [greasyfork](https://greasyfork.org/zh-CN/scripts/390421-beautify).

`Greasyfork` will sync with the source code everyday, so it will be up to date. 

This script is under construction...