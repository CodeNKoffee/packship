import crypto from "crypto";
import fs from "fs";
import path from "path";
import { packageSignature } from "../types";

// Verify package signature
export const verifyPackage = ({ serialNumber, packageName }: packageSignature) => {
  const packagePath = path.join(process.cwd(), packageName, "package.json");
  const packageContent = fs.readFileSync(packagePath, "utf-8");
  const signature = fs.readFileSync(path.join(packagePath, "signature.txt"), "utf-8");

  const publicKey = process.env.PUBLIC_KEY; // Public key for verification
  const verify = crypto.createVerify("SHA256");
  verify.update(serialNumber + packageContent);
  verify.end();

  if (publicKey) {
    return verify.verify(publicKey, signature, "base64");
  } else {
    throw new Error("\nPublic key is missing. Please check your environment variables.");
  }
};