import crypto from "crypto";

export function hashSerial(serialNumber: string) {
  return crypto.createHash("SHA256").update(serialNumber).digest("hex");
};