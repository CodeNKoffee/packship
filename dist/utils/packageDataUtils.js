export function buildPackageData(name, description, languageChoice, licenseType) {
    const devDependencies = {
        webpack: '^5.38.1'
    };
    if (languageChoice === 'TypeScript') {
        devDependencies.typescript = '^4.3.2';
    }
    return {
        name,
        version: '1.0.0',
        description,
        main: languageChoice === 'TypeScript' ? 'dist/index.js' : 'src/index.js',
        scripts: {
            build: 'webpack',
            test: 'echo "No test specified" && exit 1'
        },
        repository: {
            type: 'git',
            url: 'git+https://github.com/yourusername/yourrepo.git'
        },
        keywords: [],
        author: 'Your Name <you@example.com>',
        license: licenseType || 'MIT',
        bugs: {
            url: 'https://github.com/yourusername/yourrepo/issues'
        },
        homepage: 'https://github.com/yourusername/yourrepo#readme',
        devDependencies
    };
}
export function adjustPackageData(packageData, projectType, languageChoice, useWebpack, useEslint, usePostcss) {
    // Adjust scripts, dependencies, and other fields based on user choices
    if (!useWebpack) {
        delete packageData.scripts.build;
        delete packageData.devDependencies?.webpack;
    }
    if (!useEslint) {
        delete packageData.devDependencies?.eslint;
    }
    if (!usePostcss) {
        delete packageData.devDependencies?.postcss;
    }
    return packageData;
}
