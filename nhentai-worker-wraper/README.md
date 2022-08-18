### nhentai worker wraper

首先需要部署一个 cloudflare worker, 见本仓储下的`cf-workers/raw.js`.

部署完成后复制脚本`source.user.js`到浏览器插件, 更改其中的`WORKER`值为自己的 worker 部署地址. 保存后刷新页面即可使用.

> 此脚本目前仅发现可以用于韩国节点绕过图片屏蔽, 国内直接是访问不了... 希望不要再有大冤种选 oracle 的韩国机房...

_优先全量上传 secret gist, 脱敏后上传到本项目. 因为 cfworker 有流量限制._
