#!/usr/bin/env node

import path from 'path';
import { Plop, run } from 'plop';

const args = process.argv.slice(2);

Plop.launch({
  cwd: process.cwd(),
  configPath: path.join(__dirname, '../plopfile.js'),
  require: require,
}, env => run(env, undefined, true));