import fs from "node:fs";
import { MMKVParser } from "../src";

const parser = new MMKVParser(fs.readFileSync("bin/mmkv.default"));

const map = parser.load();

for (const key in map) {
  console.log("KEY: ", key);

  const values = map[key];

  for (const value of values) {
    console.log("VALUE: ", MMKVParser.readAsString(value));
  }
}
