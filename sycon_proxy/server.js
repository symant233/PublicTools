const net = require("node:net");
const http2 = require("node:http2");
const { decrypt } = require("./cipher");

const proxyPassword = "anwo289#$&*yhalg";

const proxy = http2.createServer();
proxy.on("stream", (stream, headers) => {
  const auth = headers["authorization"];
  const dataStr = decrypt(auth, proxyPassword); // JSON string or false

  let data; // {d: target, p: port, t: timestamp}

  if (!dataStr) {
    stream.destroy();
    return console.log("invalid auth: ", auth);
  }

  try {
    data = JSON.parse(dataStr);
    if (Date.now() - data.t > 100000) throw Error("timeout");
    console.log("connection:", data);
  } catch {
    stream.destroy();
    return console.log("invalid data: ", dataStr);
  }

  // stream.on("data", (chunk) => console.log(chunk));

  const socket = net.connect(data.p, data.d, () => {
    // stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  stream.on("error", (error) => {
    stream.close(http2.constants.NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
