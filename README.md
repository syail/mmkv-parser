# MMKV Parser

A parser of [MMKV](https://github.com/Tencent/MMKV) database.

## Warning

This repository is not full implemented yet.  
Did not support encrypted storage, multiple storage input, crc load, ... etc

## Example

```ts
const data = fs.readFileSync("my_database");

const parser = new MMKVParser(data).load();

const keys = parser.getKeys();

for (const key of keys) {
  console.log(key, parser.readAsString(key));
}
```
