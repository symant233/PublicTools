// target TCP server
const net = require("node:net");

const server = net.createServer((socket) => {
  let name = "wan1";
  socket.setEncoding("utf8");
  socket.on("close", () => {
    console.log(name);
  });
  socket.on("data", (chunk) => {
    console.log("chunk", chunk);
    name += chunk;
  });
  socket.on("end", () => socket.end(`hello ${name}`));
});

console.log("listening on localhost:8000");
server.listen(8000);

// nc localhost 8000
// Ctrl+D send EOL
