export interface PackageData {
  name: string;
  version: string;
  description: string;
  main: string;
  scripts: { [key: string]: string };
  keywords: string[];
  author: string;
  license: string;
  peerDependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
  dependencies?: { [key: string]: string };
  files?: string[];
  repository?: {
    type: string;
    url: string;
  };
  bugs?: {
    url: string;
  };
  homepage?: string;
}