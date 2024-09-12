import crypto from 'crypto';
import fs from 'fs';
import { packageSignature } from '../types/index.js';

export function verifyPackage({ packageData, publicKeyPath }: packageSignature) {
  if (!publicKeyPath) {
    throw new Error('Private key path is not provided.');
  }

  const publicKey = fs.readFileSync(publicKeyPath, 'utf-8');

  // Extract signature and data for verification
  const { signature, ...packageDataWithoutSignature } = packageData;

  // Hash the package data
  const packageHash = crypto.createHash('sha256').update(JSON.stringify(packageDataWithoutSignature)).digest('hex');

  // Verify the signature
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(packageHash);
  verifier.end();

  if (!signature) {
    throw new Error('Signature is missing in the package data.');
  }

  const isVerified = verifier.verify(publicKey, signature || '', 'base64');
  
  if (isVerified) {
    console.log('Package signature is valid. No forgery detected.');
  } else {
    console.log('Invalid package signature! Possible forgery detected.');
  }
  
  return isVerified;
}