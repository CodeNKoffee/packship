#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';
import { execFile } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const program = new Command();
const questions = [
    { type: 'input', name: 'packageName', message: 'Package Name:' },
    { type: 'input', name: 'version', message: 'Initial Version:', default: '1.0.0' },
    { type: 'input', name: 'description', message: 'Package Description:' }
];
// Set up the CLI structure
program
    .name('packship')
    .description('CLI to help ship npm packages faster')
    .version('0.1.0');
// Function to prompt user for package details
function promptPackageDetails() {
    return __awaiter(this, void 0, void 0, function* () {
        const answers = yield inquirer.prompt(questions);
        return answers; // Return the answers
    });
}
program
    .command('init')
    .description('Initialize a new npm package')
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    const details = yield promptPackageDetails();
    console.log('Package Details:', details);
    // Create package directory
    const packageDir = path.resolve(process.cwd(), details.packageName);
    if (!fs.existsSync(packageDir)) {
        fs.mkdirSync(packageDir);
    }
    else {
        console.error('Directory already exists!');
        process.exit(1);
    }
    // Define package.json content
    const packageJsonContent = {
        name: details.packageName,
        version: details.version,
        description: details.description,
        main: 'index.js',
        scripts: {
            test: 'echo "Error: no test specified" && exit 1',
        },
        keywords: [],
        author: '',
        license: 'ISC',
    };
    // Write files to package directory
    try {
        fs.writeFileSync(path.join(packageDir, 'package.json'), JSON.stringify(packageJsonContent, null, 2));
        fs.writeFileSync(path.join(packageDir, 'README.md'), `# ${details.packageName}\n\n${details.description}\n\n## Installation\n\n\`\`\`\nnpm install ${details.packageName}\n\`\`\`\n\n## Usage\n\n\`\`\`jsx\nimport { ${details.packageName} } from '${details.packageName}';\n\n// Your code here\n\`\`\`\n\n## License\n\nThis project is licensed under the ISC License.`);
        fs.writeFileSync(path.join(packageDir, '.gitignore'), `node_modules/\n.dist/\n*.log\n.env\n.vscode/\n.idea/\n.DS_Store\nThumbs.db`);
        console.log('Initialized new npm package in', packageDir);
    }
    catch (error) {
        console.error('Error writing files:', error);
        process.exit(1);
    }
    // Run bin/index.js as a child process
    const binPath = path.resolve(__dirname, '../bin/index.js');
    execFile('node', [binPath], (error, stdout, stderr) => {
        if (error) {
            console.error('Error running bin/index.js:', error);
            return;
        }
        if (stderr) {
            console.error('Error output:', stderr);
            return;
        }
        console.log('bin/index.js output:', stdout);
    });
}));
// Additional commands can be added here using program.command().action()
// Parse the command-line arguments
program.parse(process.argv);
