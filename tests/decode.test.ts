import fs from "node:fs";
import { MMKVParser } from "../src";

const parser = new MMKVParser(fs.readFileSync("bin/mmkv.default")).load();

const keys = parser.getKeys();

for (const key of keys) {
  console.log(key, parser.readAsString(key));
}
