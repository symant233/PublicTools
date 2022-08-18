cf = cloudflare, worker 是 cf 提供的一个服务.

### raw.js

Raw content http proxy for cloudflare workers (GET only). try

`https://${ID}.${yourName}.workers.dev/?https://${uri}`

通过 cloudflare 的 worker 获取资源 (仅限 GET 请求). 可用于访问被屏蔽资源或起代理作用提高获取速度.

Gist [link](https://gist.github.com/symant233/bac4df4514dff297dd06a6fc47f92d9f).
