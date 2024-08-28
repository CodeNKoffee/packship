import { Command } from 'commander';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read the version dynamically from package.json
const packageJsonPath = join(__dirname, '../../package.json');
const { version } = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

const program = new Command();

program
  .command('version')
  .description('Display the current version of packship')
  .action(() => {
    console.log(`packship v${version}`);
  });

export default program;