import { parseVarint } from "./varint-parser";

export class MMKVParser {
  private mmkvData: Buffer;
  private offset: number;

  constructor(mmkvData: Buffer) {
    this.mmkvData = mmkvData;
    this.offset = 0;
  }

  private prepareOffset() {
    // Total length bytes
    this.offset += 4;

    // IDK this varint value. probably 0xFFFFFF
    const [length, readBytes] = parseVarint(this.mmkvData, this.offset);

    this.offset += readBytes;
  }

  private getDBSize(): number {
    return this.mmkvData.readUint32LE(0);
  }

  private readUTF8String(length: number): string {
    const value = this.mmkvData.toString(
      "utf-8",
      this.offset,
      this.offset + length
    );
    this.offset += length;

    return value;
  }

  private readBytes(length: number): Buffer {
    const value = this.mmkvData.subarray(this.offset, this.offset + length);
    this.offset += length;

    return value;
  }

  public load() {
    this.prepareOffset();
    const size = this.getDBSize();

    const map: Record<string, Buffer[]> = {};

    while (this.offset < size) {
      const [keyLength, keyReaded] = parseVarint(this.mmkvData, this.offset);
      this.offset += keyReaded;

      const key = this.readUTF8String(keyLength.toNumber());

      if (!(key in map)) {
        map[key] = [];
      }

      const [valueLength, valueReaded] = parseVarint(
        this.mmkvData,
        this.offset
      );
      this.offset += valueReaded;

      map[key].push(this.readBytes(valueLength.toNumber()));
    }
    return map;
  }

  public static readAsString(value: Buffer): string {
    const [keyLength, keyReaded] = parseVarint(value, 0);

    return value
      .subarray(keyReaded, keyLength.toNumber() + keyReaded)
      .toString("utf-8");
  }
}
