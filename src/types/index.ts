export interface PackageData {
  name: string;
  version: string;
  description: string;
  email: string;
  main: string;
  module: string;
  type: string;
  scripts: { [key: string]: string };
  keywords: string[];
  author: string;
  serialNumber: string;
  license: string;
  peerDependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
  dependencies?: { [key: string]: string };
  files?: string[];
  homepage?: string;
  signature?: string;
  repository?: {
    type: string;
    url: string;
  };
  bugs?: {
    url: string;
  };
}

export type FileConfig = {
  name: string;
  template: string;
  data?: { name: string | symbol; description: string | symbol; licenseType?: string | symbol };
};

export interface PackageSignature {
  packageData: PackageData;
  privateKeyPath?: string;
  publicKeyPath?: string;
  publicKey?: string;
}

export interface KeyPairPaths {
  publicKeyPath: string;
  privateKeyPath: string;
}