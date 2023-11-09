// target TCP server
const net = require("node:net");

const server = net.createServer((socket) => {
  let data = "";
  socket.setEncoding("utf8");
  socket.on("close", () => {
    console.log(data);
  });
  socket.on("data", (chunk) => {
    console.log("chunk", chunk);
    data += chunk;
  });
  socket.on("end", () => socket.end(`data: ${data}`));
});

console.log("listening on localhost:8000");
server.listen(8000);

// nc localhost 8000
// Ctrl+D send EOL
