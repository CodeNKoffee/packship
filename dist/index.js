#!/usr/bin/env node
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Command } from 'commander';
import initCommand from './commands/init.js';
import versionCommand from './commands/version.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const program = new Command();
// Questions for CLI
const questions = [
    { type: 'input', name: 'packageName', message: 'Package Name:' },
    { type: 'input', name: 'version', message: 'Initial Version:', default: '1.0.0' },
    { type: 'input', name: 'description', message: 'Package Description:' }
];
// Set up the CLI structure
program
    .name('packship')
    .description('CLI to help ship npm packages faster')
    .version('0.1.27');
// Register commands correctly with names
program.addCommand(initCommand);
program.addCommand(versionCommand);
// Parse the command-line arguments
program.parse(process.argv);
