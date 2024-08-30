import fs from 'fs';
import path from 'path';
import { camelCase } from 'change-case';

export default function(plop) {
  // Register camelCase helper
  plop.setHelper('camelCase', (text) => camelCase(text));
  // Define user prompts
  plop.setGenerator('init', {
    description: 'Initialize a new npm package setup',
    prompts: [
      {
        type: 'input',
        name: 'packageName',
        message: 'What is the name of your package?',
      },
      {
        type: 'list',
        name: 'languageChoice',
        message: 'Do you want to use TypeScript or plain JavaScript?',
        choices: ['TypeScript', 'JavaScript'],
        default: 'TypeScript',
      },
      {
        type: 'confirm',
        name: 'includeInternalDir',
        message: 'Do you want to include an `internal` directory for internal-use components?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'includeBabel',
        message: 'Do you want to include a Babel configuration?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'includeWebpack',
        message: 'Do you want to include a Webpack configuration?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'includeEslint',
        message: 'Do you want to include an ESLint configuration?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'includePostcss',
        message: 'Do you want to include a PostCSS configuration?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'includeNpmignore',
        message: 'Do you want to include a .npmignore file?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'includeLicense',
        message: 'Do you want to include a LICENSE file?',
        default: true,
      },
      {
        type: 'list',
        name: 'licenseType',
        message: 'License type:',
        choices: ['MIT', 'ISC', 'Apache-2.0', 'GPL-3.0'],
        default: 'MIT',
        when: function (answers) {
          return answers.includeLicense;
        },
      },
      {
        type: 'confirm',
        name: 'includeCodeOfConduct',
        message: 'Do you want to include a CODE_OF_CONDUCT.md file?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'includeReadme',
        message: 'Do you want to include a README.md file?',
        default: true,
      }
    ],
    actions: function(data) {
      let actions = [];

      // Helper function to check if a file exists
      const fileExists = (filePath) => fs.existsSync(path.resolve(process.cwd(), filePath));

      if (data.languageChoice === 'TypeScript') {
        if (!fileExists('src/index.ts')) {
          actions.push({
            type: 'add',
            path: 'src/index.ts',
            templateFile: 'plop-templates/src/index.ts.hbs'
          });
        }

        if (!fileExists('tsconfig.json')) {
          actions.push({
            type: 'add',
            path: 'tsconfig.json',
            templateFile: 'plop-templates/tsconfig.json.hbs'
          });
        }

        if (!fileExists('types/index.ts')) {
          actions.push({
            type: 'add',
            path: 'types/index.ts',
            templateFile: 'plop-templates/types/index.ts.hbs'
          });
        }
      } else {
        if (!fileExists('src/index.js')) {
          actions.push({
            type: 'add',
            path: 'src/index.js',
            templateFile: 'plop-templates/src/index.js.hbs'
          });
        }
      }

      if (data.includeInternalDir && !fileExists('src/internal')) {
        actions.push({
          type: 'add',
          path: 'src/internal/.gitkeep',
          templateFile: 'plop-templates/src/internal/.gitkeep'
        });
      }

      if (data.includeBabel && !fileExists('babel.config.json')) {
        actions.push({
          type: 'add',
          path: 'babel.config.json',
          templateFile: 'plop-templates/babel.config.hbs'
        });
      }

      if (data.includeWebpack && !fileExists('webpack.config.mjs')) {
        actions.push({
          type: 'add',
          path: 'webpack.config.mjs',
          templateFile: 'plop-templates/webpack.config.hbs'
        });
      }

      if (data.includeEslint && !fileExists('.eslintrc.json')) {
        actions.push({
          type: 'add',
          path: '.eslintrc.json',
          templateFile: 'plop-templates/eslintrc.hbs'
        });
      }

      if (data.includePostcss && !fileExists('postcss.config.js')) {
        actions.push({
          type: 'add',
          path: 'postcss.config.js',
          templateFile: 'plop-templates/postcss.config.hbs'
        });
      }

      if (data.includeNpmignore && !fileExists('.npmignore')) {
        actions.push({
          type: 'add',
          path: '.npmignore',
          templateFile: 'plop-templates/npmignore.hbs'
        });
      }

      if (data.includeLicense && !fileExists('LICENSE')) {
        actions.push({
          type: 'add',
          path: 'LICENSE',
          templateFile: 'plop-templates/license.hbs'
        });
      }

      if (data.includeCodeOfConduct && !fileExists('CODE_OF_CONDUCT.md')) {
        actions.push({
          type: 'add',
          path: 'CODE_OF_CONDUCT.md',
          templateFile: 'plop-templates/code_of_conduct.hbs'
        });
      }

      if (data.includeReadme && !fileExists('README.md')) {
        actions.push({
          type: 'add',
          path: 'README.md',
          templateFile: 'plop-templates/readme.hbs'
        });
      }

      return actions;
    }
  });
};