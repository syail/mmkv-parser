import { parseVarint } from "./varint-parser";

export class MMKVParser {
  private mmkvData: Buffer;
  private offset: number;
  private keys: string[];
  private values: Buffer[];

  constructor(mmkvData: Buffer) {
    this.mmkvData = mmkvData;
    this.offset = 0;

    this.keys = [];
    this.values = [];
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

    while (this.offset < size) {
      const [keyLength, keyReaded] = parseVarint(this.mmkvData, this.offset);
      this.offset += keyReaded;

      const key = this.readUTF8String(keyLength.toNumber());

      const [valueLength, valueReaded] = parseVarint(
        this.mmkvData,
        this.offset
      );
      this.offset += valueReaded;

      const value = this.readBytes(valueLength.toNumber());

      this.keys.push(key);
      this.values.push(value);
    }
    return this;
  }

  public getKeys(): string[] {
    return this.keys;
  }

  public readAsString(key: string): string {
    if (!this.keys.includes(key)) {
      throw new Error(`Key ${key} not found`);
    }
    const value = this.values[this.keys.indexOf(key)];

    const [keyLength, keyReaded] = parseVarint(value, 0);

    return value
      .subarray(keyReaded, keyLength.toNumber() + keyReaded)
      .toString("utf-8");
  }
}
