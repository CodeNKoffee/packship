export interface PackageData {
  name: string;
  version: string;
  description: string;
  email: string;
  main: string;
  module: string;
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

export interface packageSignature {
  packageData: PackageData;
  privateKeyPath?: string;
  publicKeyPath?: string;
  publicKey?: string;
}