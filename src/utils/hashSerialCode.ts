import crypto from "crypto";

export function hashSerial(serialNumber: string) {
  return crypto.createHash('sha256').update(serialNumber).digest('hex');
};