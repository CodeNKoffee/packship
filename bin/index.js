#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import { Plop, run } from 'plop';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

Plop.launch({
  cwd: process.cwd(),
  configPath: path.join(__dirname, '../plopfile.js'),
  require: await import('module').then(m => m.createRequire(import.meta.url)),
}, env => run(env, undefined, true));