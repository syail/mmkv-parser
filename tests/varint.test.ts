import { parseVarint } from "../src/varint-parser";

const buffer = Buffer.from([parseInt("10010110", 2), parseInt("00000001", 2)]);

const [value, readBytes] = parseVarint(buffer, 0);

if (value.toString() !== "150") {
  throw new Error("Expected 150, got " + value.toString());
}

if (readBytes !== 2) {
  throw new Error("Expected 2, got " + readBytes);
}
