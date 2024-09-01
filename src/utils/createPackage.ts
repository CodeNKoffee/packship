import fs from 'fs';
import path from 'path';
import renderTemplate from './fileUtils';
import { text, select, confirm } from '@clack/prompts';

export async function createPackage() {
  const name = await text({
    message: 'What is the name of your package?',
    validate: (value) => (value ? undefined : 'Package name is required.')
  });

  const description = await text({
    message: 'Provide a description for your package:'
  });

  const languageChoice = await select({
    message: 'Which language do you want to use for your project?',
    options: [
      { value: 'TypeScript', label: 'TypeScript' },
      { value: 'JavaScript', label: 'JavaScript' }
    ],
    initialValue: 'TypeScript'
  });

  const projectType = await select({
    message: 'What type of project are you creating?',
    options: [
      { value: 'react-js', label: 'React (with JavaScript)' },
      { value: 'react-ts', label: 'React (with TypeScript)' },
      { value: 'vanilla-js', label: 'Vanilla JavaScript' },
      { value: 'node-js', label: 'Node.js' }
    ],
    initialValue: 'react-ts'
  });

  const includeInternalDir = await confirm({
    message: 'Will your project have internal-use components that need an `internal` directory?',
    initialValue: true
  });

  const useWebpack = await confirm({
    message: 'Do you need to bundle your code using Webpack?',
    initialValue: true
  });

  const useEslint = await confirm({
    message: 'Do you want to enforce coding standards with ESLint?',
    initialValue: true
  });

  const usePostcss = await confirm({
    message: 'Will your project involve processing CSS (e.g., adding vendor prefixes)?',
    initialValue: true
  });

  const useNpmignore = await confirm({
    message: 'Do you need to specify files to exclude from your npm package with a .npmignore file?',
    initialValue: true
  });

  const includeLicense = await confirm({
    message: 'Do you want to include a LICENSE file for your project?',
    initialValue: true
  });

  const licenseType = includeLicense
    ? await select({
        message: 'What type of license would you like to include?',
        options: [
          { value: 'MIT', label: 'MIT' },
          { value: 'ISC', label: 'ISC' },
          { value: 'Apache-2.0', label: 'Apache-2.0' },
          { value: 'GPL-3.0', label: 'GPL-3.0' }
        ],
        initialValue: 'MIT'
      })
    : undefined;

  const includeCodeOfConduct = await confirm({
    message: 'Do you want to include a CODE_OF_CONDUCT.md file for community guidelines?',
    initialValue: true
  });

  const includeReadme = await confirm({
    message: 'Would you like to include a README.md file to describe your project?',
    initialValue: true
  });

  const packageDir = path.join(process.cwd(), String(name));

  if (fs.existsSync(packageDir)) {
    throw new Error(`Directory ${String(name)} already exists.`);
  }

  // Create the new package directory
  await fs.promises.mkdir(packageDir, { recursive: true });

  // List of files to generate based on user choices
  const files = [
    { name: 'package.json', template: 'package.json.hbs', data: { name, description } },
    ...(includeReadme ? [{ name: 'README.md', template: 'README.md.hbs', data: { name, description } }] : []),
    { name: '.gitignore', template: '.gitignore.hbs', data: {} },
    ...(useNpmignore ? [{ name: '.npmignore', template: '.npmignore.hbs', data: {} }] : []),
    { name: 'index.js', template: 'index.js.hbs', data: {} },
    { name: 'index.ts', template: 'index.ts.hbs', data: {} },
    ...(includeLicense ? [{ name: 'LICENSE.md', template: 'LICENSE.md.hbs', data: { name, licenseType } }] : []),
    ...(includeCodeOfConduct ? [{ name: 'CODE_OF_CONDUCT.md', template: 'CODE_OF_CONDUCT.md.hbs', data: { name } }] : []),
    ...(useEslint ? [{ name: '.eslintrc.json', template: 'eslintrc.json.hbs', data: {} }] : []),
    ...(usePostcss ? [{ name: 'postcss.config.js', template: 'postcss.config.hbs', data: {} }] : []),
    ...(useWebpack ? [{ name: 'webpack.config.js', template: 'webpack.config.hbs', data: {} }] : [])
  ];

  // Generate each file using its corresponding template
  await Promise.all(
    files.map(async ({ name, template, data }) => {
      const filePath = path.join(packageDir, name);
      const content = renderTemplate(template, {
        name: typeof data.name === 'symbol' ? String(data.name) : data.name,
        description: typeof data.description === 'symbol' ? String(data.description) : data.description,
      });
      await fs.promises.writeFile(filePath, content);
    })
  );

  console.log('Package setup completed successfully.');

  return name;
}