const net = require("node:net");

const socket = net.connect({
  port: 8000,
  host: "localhost",
});
socket.setEncoding("utf8");
socket.on("connect", () => {
  socket.write("TCP connected\n");
  socket.end("[This is end message]");
});
socket.on("data", (chunk) => console.log(chunk));
socket.on("end", () => {
  socket.destroy();
});
