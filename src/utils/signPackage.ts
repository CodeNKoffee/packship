import crypto from "crypto"
import fs from "fs";
import { PackageSignature } from "../types";

export function signPackage({ packageData, privateKeyPath }: PackageSignature) {
  if (!privateKeyPath) {
    throw new Error("Private key path is not provided.");
  }

  const privateKey = fs.readFileSync(privateKeyPath, "utf8");

  // Serialize the package data (without the signature)
  const packageDataWithoutSignature = { ...packageData };
  delete packageDataWithoutSignature.signature;

 // Create a hash of the package data
  const packageHash = crypto.createHash("SHA256").update(JSON.stringify(packageDataWithoutSignature)).digest("hex");
  // Sign the hash with the private key
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(packageHash);
  signer.end();

  const signature = signer.sign(privateKey, "base64");
  
  return { ...packageData, signature };
}