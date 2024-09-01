#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import { Plop, run } from 'plop';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const args = process.argv.slice(2);

Plop.launch({
  cwd: process.cwd(),
  configPath: path.join(__dirname, '../plopfile.js'),
  require,
}, env => run(env, undefined, true));