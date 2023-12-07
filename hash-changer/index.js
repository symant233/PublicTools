const fs = require("node:fs");
const crypto = require("node:crypto");
const { program } = require("commander");
const { version } = require("./package.json");

program
  .option("-v, --verbose", "log processing details")
  .requiredOption("-i, --input <file>", "input file path")
  .option("-b, --byte <int>", "appending empty byte length", "2")
  .option("-r, --remove", "remove empty bytes after EOF")
  .version(version)
  .parse();

const options = program.opts(); // parsed options from user Input
// if (options.verbose) console.log(options);
const file = options.input; // input file path
let fileBuffer; // file data buffer

function calculateFileMD5(filePath) {
  const hash = crypto.createHash("md5");
  hash.update(fileBuffer);
  return hash.digest("hex");
}

function logTailBuffers() {
  if (options.verbose) {
    console.log("Last 20 bytes:", fileBuffer.subarray(-20));
  }
}

function getEmptyBufferSize() {
  const currentSize = fileBuffer.byteLength;
  let p = currentSize;
  while (fileBuffer[p - 1] === 0) p--;
  return currentSize - p;
}

const nullBuffer = Buffer.alloc(parseInt(options.byte));

// START OF MAIN PROCEDURE
fileBuffer = fs.readFileSync(file);
console.log("Original MD5:", calculateFileMD5(file));
logTailBuffers();
if (options.verbose && !options.remove)
  console.log("Appending null buffer:", nullBuffer);

if (!options.remove) fs.appendFileSync(file, nullBuffer);
else {
  const emptyLegth = getEmptyBufferSize();
  console.log(`Removing empty {${emptyLegth}} byte(s) after EOF.`);
  fs.truncateSync(file, fileBuffer.byteLength - emptyLegth);
}

fileBuffer = fs.readFileSync(file);
logTailBuffers();
console.log("Current  MD5:", calculateFileMD5(file));
