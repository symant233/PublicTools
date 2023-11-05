## sycon_proxy

用 `nodejs` 写的一个简单 HTTP/2 代理，原理是：

1. 建立本地 SOCKS5 服务，代理本机网络请求。
2. 本地与代理服务器建立 HTTP/2 代理，并将本地的 TCP 链接与代理服务器的 `stream` 建立双向管道。
3. 代理服务器与目标服务器建立 TCP 链接，然后使用 `stream.pipe` 建立全双工通信。

其中，`client.js` 运行在本机，如你的电脑，其中有三个配置项：密码、代理服务器地址、本地监听端口。`server.js` 运行在你自己的服务器，其中的配置项为：监听端口、密码。`cipher.js` 为加解密模块。

## todo

- [ ] 对本地到代理服务器的通信流进行加密

## reference

- SOCKS5 RFC: https://datatracker.ietf.org/doc/html/rfc1928
- HTTP/2 RFC: https://datatracker.ietf.org/doc/html/rfc7540
- SOCKS5 demo: https://gist.github.com/longbill/d321fc371e6dda9acf40decdb923c048
- Nodejs HTTP/2 Doc: https://nodejs.org/dist/latest-v20.x/docs/api/http2.html#supporting-the-connect-method
- Nodejs Net Doc: https://nodejs.org/dist/latest-v20.x/docs/api/net.html
- Encrypt and Decrypt: https://hackernoon.com/how-to-encrypt-and-decrypt-in-nodejs
