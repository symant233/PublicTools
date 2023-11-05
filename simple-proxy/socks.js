// SOCKS Protocol Version 5 RFC:
// https://datatracker.ietf.org/doc/html/rfc1928

const net = require("net");

net
  .createServer((socket) => {
    socket.once("data", (data) => {
      // console.log(data);
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

        const dstServer = net.connect({
          host: serverStr,
          port: portNum,
        });

        dstServer.on("error", (err) => {
          console.log(`!Server Error(${serverName}):`, err.message);
          socket.destroy();
        });

        socket.on("error", (err) => {
          console.log(`!Client Error(${serverName}):`, err.message);
          dstServer.destroy();
        });

        if (data && data.length > 0) {
          dstServer.write(Buffer.from(data));
        }

        socket.write(
          Buffer.concat([
            Buffer.from([ver, 0, 0, atyp]),
            Buffer.from(dstAddr),
            Buffer.from(dstPort),
          ])
        );

        dstServer.pipe(socket);
        socket.pipe(dstServer);
      });
    });
  })
  .listen(8787, "127.0.0.1");
