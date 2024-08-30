import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Read the version dynamically from package.json
const packageJsonPath = join(__dirname, '../../package.json');
const { version } = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const versionCommand = new Command("version");
versionCommand
    .description('Display the current version of packship')
    .action(() => {
    console.log(`packship v${version}`);
});
export default versionCommand;
