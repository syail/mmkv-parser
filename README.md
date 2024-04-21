# MMKV Parser

A parser of [MMKV](https://github.com/Tencent/MMKV) database.

## Warning

This repository is not full implemented yet.  
Did not support encrypted storage, multiple storage input, crc load, ... etc

## Example

```ts
import fs from "node:fs";
import { MMKVParser } from "@syail/mmkv-parser";

const parser = new MMKVParser(fs.readFileSync("bin/mmkv.default"));

const map = parser.load();

for (const key in map) {
  console.log("KEY: ", key);

  const values = map[key];

  for (const value of values) {
    console.log("VALUE: ", MMKVParser.readAsString(value));
  }
}
```

## Data Structure

Header
| name | offset | size |
|:-------------------:|:------:|:----:|
| Data Length (int32) | 0 | 4 |
| Unknown (varint) | 4 | n |
| Body | 4+n | - |

Body
| name |
|:-------------------:|
| key size (varint) |
| key (string) |
| value size (varint) |
| value |
