// SOCKS Protocol Version 5 RFC:
// https://datatracker.ietf.org/doc/html/rfc1928

const net = require("node:net");
const http2 = require("node:http2");
const { encrypt } = require("./cipher");

const proxyServer = "http://localhost:8001";
const proxyPassword = "anwo289#$&*yhalg";

const client = http2.connect(proxyServer);

function connectProxyServer(target, port) {
  const stream = client.request({
    ":method": "CONNECT",
    ":authority": "localhost",
    authorization: encrypt(
      JSON.stringify({ d: target, p: port, t: Date.now() }),
      proxyPassword
    ),
  });
  stream.on("close", () => {
    stream.destroy();
  });
  return stream;
}

net
  .createServer((socket) => {
    socket.once("data", (data) => {
      // data will be Buffer 05 01 00, client connection initiator
      socket.write(Buffer.from([5, 0]));

      socket.once("data", (data) => {
        data = [...data];
        let ver = data.shift(); // socks version (5)
        let cmd = data.shift(); // 1: connect, 2: bind, 3: udp
        let rsv = data.shift(); // reserved
        let atyp = data.shift(); // 1: ipv4(4bytes followed), 3: domain, 4: ipv6(16 bytes followed)
        // console.log(ver, cmd, rsv, atyp, data);
        let dstAddr,
          dstPort,
          serverStr = "";
        if (atyp === 1) {
          dstAddr = data.splice(0, 4);
          serverStr = dstAddr.join(".");
        } else if (atyp === 3) {
          let domainLength = data.shift();
          dstAddr = data.splice(0, domainLength);
          serverStr = Buffer.from(dstAddr).toString();
          dstAddr.unshift(domainLength);
        } else if (atyp === 4) {
          dstAddr = data.splice(0, 16);
          serverStr = [];
          for (let i = 0; i < 8; i++) {
            serverStr.push(
              Buffer.from(dstAddr.slice(i * 2, 2)).toString("hex")
            );
          }
          serverStr = serverStr.join(":");
        } else {
          socket.destroy();
          return;
        }

        dstPort = data.splice(0, 2);
        const portNum = dstPort[0] * 256 + dstPort[1];

        const serverName = `${serverStr}:${portNum}`;
        console.log(">", serverName);

        const proxyServer = connectProxyServer(serverStr, portNum);

        proxyServer.on("error", (err) => {
          console.log(`!Server Error(${serverName}):`, err.message);
          socket.destroy();
        });

        socket.on("error", (err) => {
          console.log(`!Client Error(${serverName}):`, err.message);
          proxyServer.destroy();
        });

        if (data && data.length > 0) {
          proxyServer.write(Buffer.from(data));
        }

        socket.write(
          Buffer.concat([
            Buffer.from([ver, 0, 0, atyp]),
            Buffer.from(dstAddr),
            Buffer.from(dstPort),
          ])
        );

        proxyServer.pipe(socket);
        socket.pipe(proxyServer);
      });
    });
  })
  .listen(8787, "127.0.0.1");
