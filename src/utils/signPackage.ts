import crypto from "crypto";
import fs from "fs";
import path from "path";
import { packageSignature } from "../types";

export function signPackage({ serialNumber, packageName }: packageSignature) {
  const packagePath = path.join(process.cwd(), packageName, "package.json");
  const packageContent = fs.readFileSync(packagePath, "utf-8");

  const privateKey = process.env.PRIVATE_KEY;
  const sign = crypto.createSign("SHA256");
  sign.update(serialNumber + packageContent);
  sign.end();

  if (privateKey) {
    const signature = sign.sign(privateKey, "base64");
    fs.writeFileSync(path.join(packagePath, 'signature.txt'), signature);
    return signature;
  } else {
    throw new Error("\nPrivate key is missing. Please check your environment variables.");
  }
}