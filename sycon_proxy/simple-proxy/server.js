const http2 = require("node:http2");
const { NGHTTP2_REFUSED_STREAM } = http2.constants;
const net = require("node:net");

const proxy = http2.createServer();
proxy.on("stream", (stream, headers) => {
  if (headers[":method"] !== "CONNECT") {
    // Only accept CONNECT requests
    stream.close(NGHTTP2_REFUSED_STREAM);
    return;
  }
  const auth = new URL(`tcp://${headers[":authority"]}`);
  // It's a very good idea to verify that hostname and port are
  // things this proxy should be connecting to.
  const socket = net.connect(auth.port, auth.hostname, () => {
    stream.respond();
    socket.pipe(stream);
    stream.pipe(socket);
  });
  socket.on("error", (error) => {
    stream.close(http2.constants.NGHTTP2_CONNECT_ERROR);
  });
});

proxy.listen(8001);
