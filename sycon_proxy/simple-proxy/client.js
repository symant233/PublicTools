const http2 = require("node:http2");

const client = http2.connect("http://localhost:8001");

// Must not specify the ':path' and ':scheme' headers
// for CONNECT requests or an error will be thrown.
const req = client.request({
  ":method": "CONNECT",
  ":authority": "localhost:8000",
});

req.on("response", (headers) => {
  console.log(headers[http2.constants.HTTP2_HEADER_STATUS]);
});
let data = "";
req.setEncoding("utf8");
req.on("data", (chunk) => (data += chunk));
req.on("end", () => {
  console.log(`The server says: ${data}`);
  client.close();
});
req.end("Jane");
