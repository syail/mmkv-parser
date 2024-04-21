import { Long } from "bson";

/**
 * Reads a variable integer from a buffer used within Google Protocol Buffers.
 *
 * @reference https://protobuf.dev/programming-guides/encoding/
 *
 * @param buffer The buffer to read from.
 * @param offset The offset to start reading from.
 *
 * @returns A tuple [value, readBytes] where value is the parsed integer and readBytes is the number of bytes read.
 */
export function parseVarint(buffer: Buffer, offset: number): [Long, number] {
  let value = Long.UZERO;
  let shift = 0;
  let curr: number;

  do {
    curr = buffer[offset++];
    value = value.or(Long.fromNumber(curr & 0x7f).shiftLeft(shift));
    shift += 7;
  } while (curr & 0x80);

  return [value, offset];
}
