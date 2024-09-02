import { text, select, confirm } from '@clack/prompts';
export async function getPackageDetails() {
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
    return { name, description, languageChoice };
}
export function getProjectOptions(languageChoice) {
    return languageChoice === "TypeScript"
        ? [
            { value: 'react-ts', label: 'React (with TypeScript)' },
            { value: 'node-ts', label: 'Node.js (with TypeScript)' }
        ]
        : [
            { value: 'react-js', label: 'React (with JavaScript)' },
            { value: 'node-js', label: 'Node.js (with JavaScript)' },
            { value: 'vanilla-js', label: 'Vanilla JavaScript' }
        ];
}
export async function getAdditionalChoices() {
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
    const includeCodeOfConduct = await confirm({
        message: 'Do you want to include a CODE_OF_CONDUCT.md file for community guidelines?',
        initialValue: true
    });
    const includeReadme = await confirm({
        message: 'Would you like to include a README.md file to describe your project?',
        initialValue: true
    });
    return {
        includeInternalDir,
        useWebpack,
        useEslint,
        usePostcss,
        useNpmignore,
        includeLicense,
        includeCodeOfConduct,
        includeReadme
    };
}
export async function getLicenseType() {
    return await select({
        message: 'What type of license would you like to include?',
        options: [
            { value: 'MIT', label: 'MIT' },
            { value: 'ISC', label: 'ISC' },
            { value: 'Apache-2.0', label: 'Apache-2.0' },
            { value: 'GPL-3.0', label: 'GPL-3.0' }
        ],
        initialValue: 'MIT'
    });
}
export function shouldIncludeFile(choices) {
    const { includeReadme, useNpmignore, projectType, languageChoice, includeInternalDir, usePostcss, includeLicense, includeCodeOfConduct, useEslint, useWebpack } = choices;
    return [
        // { name: 'package.json', template: 'package.json.hbs', data: {} },
        ...(includeReadme ? [{ name: 'README.md', template: 'README.md.hbs', data: {} }] : []),
        // { name: '.gitignore', template: '.gitignore.hbs', data: {} },
        ...(useNpmignore ? [{ name: '.npmignore', template: '.npmignore.hbs', data: {} }] : []),
        ...(typeof projectType === 'string' && projectType.startsWith('react-')
            ? (languageChoice === 'JavaScript'
                ? [{ name: 'src/index.jsx', template: 'index.jsx.hbs', data: {} }]
                : [
                    { name: 'src/index.tsx', template: 'index.tsx.hbs', data: {} },
                    { name: 'types/index.ts', template: 'index.ts.hbs', data: {} },
                    { name: 'src/declaration.d.ts', template: 'declaration.d.ts.hbs', data: {} }
                ])
            : (languageChoice === 'JavaScript'
                ? [{ name: 'src/index.js', template: 'index.js.hbs', data: {} }]
                : [
                    { name: 'src/index.ts', template: 'index.ts.hbs', data: {} },
                    { name: 'types/index.ts', template: 'index.ts.hbs', data: {} },
                    { name: 'src/declaration.d.ts', template: 'declaration.d.ts.hbs', data: {} }
                ])),
        ...(includeInternalDir
            ? (typeof projectType === 'string' && projectType.startsWith('react-')
                ? (languageChoice === 'JavaScript'
                    ? [{ name: 'src/internal/index.jsx', template: 'index.jsx.hbs', data: {} }]
                    : [{ name: 'src/internal/index.tsx', template: 'index.tsx.hbs', data: {} }])
                : (languageChoice === 'JavaScript'
                    ? [{ name: 'src/internal/index.js', template: 'index.js.hbs', data: {} }]
                    : [{ name: 'src/internal/index.ts', template: 'index.ts.hbs', data: {} }]))
            : []),
        ...(usePostcss
            ? [
                { name: 'postcss.config.js', template: 'postcss.config.hbs', data: {} },
                { name: 'styles/style.css', template: 'style.css.hbs', data: {} }
            ]
            : []),
        ...(includeLicense ? [{ name: 'LICENSE', template: 'LICENSE.hbs', data: {} }] : []),
        ...(includeCodeOfConduct ? [{ name: 'CODE_OF_CONDUCT.md', template: 'CODE_OF_CONDUCT.md.hbs', data: {} }] : []),
        ...(useEslint ? [{ name: '.eslintrc.json', template: 'eslintrc.json.hbs', data: {} }] : []),
        ...(useWebpack ? [{ name: 'webpack.config.js', template: 'webpack.config.hbs', data: {} }] : [])
    ];
}
