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
  dependencies?: { [key: string]: string }; // Added optional dependencies property
  files?: string[]; // Added optional files property
}