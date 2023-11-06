const net = require("node:net");
const http2 = require("node:http2");
const { decrypt } = require("./cipher");

const proxyPassword = "anwo289#$&*yhalg";

const proxy = http2.createServer();
proxy.on("stream", (stream, headers) => {
  if (headers[":method"] !== "CONNECT") {
    stream.destroy();
    return console.log("!invalid method: ", headers[":method"]);
  }
  const auth = headers["authorization"];
  const dataStr = decrypt(auth, proxyPassword); // JSON string or false

  let data; // {d: target, p: port, t: timestamp}

  if (!dataStr) {
    stream.destroy();
    return console.log("!invalid auth: ", auth);
  }

  try {
    data = JSON.parse(dataStr);
    if (Date.now() - data.t > 10000) throw Error("ETIMEDOUT");
    console.log("conn:", data);
  } catch {
    stream.destroy();
    return console.log("!invalid data: ", dataStr);
  }

  // stream.on("data", (chunk) => console.log(chunk));

  const socket = net.connect(data.p, data.d, () => {
    stream.respond({ ":status": 200 });
    socket.pipe(stream);
    stream.pipe(socket);
  });
  stream.on("error", (error) => {
    stream.destroy(error);
    socket.destroy(error);
  });
  socket.on("error", (error) => {
    stream.destroy(error);
    socket.destroy(error);
  });
  stream.on("close", () => {
    socket.destroy();
    stream.destroy();
  });
});

proxy.listen(8001);
