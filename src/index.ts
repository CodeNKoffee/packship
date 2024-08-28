import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

const program = new Command();
const questions: any = [
  { 
    type: 'input', 
    name: 'packageName', 
    message: 'Package Name:' 
  },
  { 
    type: 'input', 
    name: 'version', 
    message: 'Initial Version:', 
    default: '1.0.0' 
  },
  { 
    type: 'input', 
    name: 'description', 
    message: 'Package Description:' 
  }
];

// Set up the CLI structure
program
  .name('packship')
  .description('CLI to help ship npm packages faster')
  .version('0.1.0');

// Function to prompt user for package details
async function promptPackageDetails() {
  const answers = await inquirer.prompt(questions);
  return answers; // Return the answers
}

program
  .command('init')
  .description('Initialize a new npm package')
  .action(async () => {
    const details = await promptPackageDetails();
    console.log('Package Details:', details);

    // Create package directory
    const packageDir = path.resolve(process.cwd(), details.packageName);
    if (!fs.existsSync(packageDir)) {
      fs.mkdirSync(packageDir);
    } else {
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
    } catch (error) {
      console.error('Error writing files:', error);
      process.exit(1);
    }
  });

// Additional commands can be added here using program.command().action()

// Parse the command-line arguments
program.parse(process.argv);