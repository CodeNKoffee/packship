import crypto, { generateKeyPairSync } from "crypto";
import * as fs from "fs";
import * as path from "path";
import { KeyPairPaths } from "../types";

// Function to generate key pair
export default function generateKeys(outputDir: string): KeyPairPaths {
  const { publicKey, privateKey } = generateKeyPairSync('ec', {
    namedCurve: 'secp384r1',
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  // const importedKey = crypto.createPrivateKey({
  //   key: privateKey,
  //   format: "pem",
  //   type: "pkcs8",
  // })

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const publicKeyPath = path.join(outputDir, 'publicKey.pem');
  const privateKeyPath = path.join(outputDir, 'privateKey.pem');

  // Write keys to files
  fs.writeFileSync(publicKeyPath, publicKey);
  fs.writeFileSync(privateKeyPath, privateKey);

  console.log('Keys generated successfully:');
  console.log(`Public key path: ${publicKeyPath}`);
  console.log(`Private key path: ${privateKeyPath}`);

  return { publicKeyPath, privateKeyPath };
}