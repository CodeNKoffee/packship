#!/usr/bin/env node

const path = require('path');
const { Plop, run } = require('plop');

// Process CLI arguments
const args = process.argv.slice(2);

Plop.launch({
  cwd: process.cwd(),
  configPath: path.join(__dirname, '../plopfile.js'),
  require: require,
}, env => run(env, undefined, true));