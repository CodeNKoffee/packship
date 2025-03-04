export interface PackageData {
  name: string;
  description: string;
  language?: string;
  projectType?: string;
  author: {
    name: string;
    email: string;
  };
  license: string;
  version?: string;
  main?: string;
  module?: string;
  type?: string;
  scripts?: { [key: string]: string };
  keywords?: string[];
  peerDependencies?: { [key: string]: string };
  devDependencies?: { [key: string]: string };
  dependencies?: { [key: string]: string };
  files?: string[];
  homepage?: string;
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
  data?: {
    name?: string | symbol;
    description?: string | symbol;
    licenseType?: string | symbol;
    [key: string]: any;
  };
};

export interface TelemetryConfig {
  enabled: boolean;
  userId: string;
}

export interface TelemetryEvent {
  type: 'init' | 'publish' | 'other';
  name: string;
  data?: Record<string, any>;
}