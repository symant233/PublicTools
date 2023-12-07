## hash-changer

This tool changes file hash by appending empty buffer after EOF.

### Install

```bash
npm i hash-changer -g
```

### Usages

```
symant@stardust ~ > hc --help
Usage: index [options]

Options:
  -v, --verbose       log processing details
  -i, --input <file>  input file path
  -b, --byte <int>    appending empty byte length (default: "2")
  -r, --remove        remove empty bytes after EOF
  -V, --version       output the version number
  -h, --help          display help for command
```

Example to change file hash: `hc -i <your file path>`

```bash
symant@stardust ~ > hc -i pic.jpg -v
Original MD5: 59e65b102d867c282a185e114a1dad5f
Last 20 bytes: <Buffer 77 f1 13 3f 5f c8 ff 00 85 14 b4 50 1e ff 00 f7 7f 13 ff d9>
Appending null buffer: <Buffer 00 00>
Last 20 bytes: <Buffer 13 3f 5f c8 ff 00 85 14 b4 50 1e ff 00 f7 7f 13 ff d9 00 00>
Current  MD5: 659d748a0eaeeb9425e46e5dcd58e7f5
```
