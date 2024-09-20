import fs from "fs";
import path from "path";
import { renderTemplate } from "./fileUtils.js";
import { text, select, confirm } from "@clack/prompts";
import { registerHandlebarsHelpers } from "./handlebarsHelpers.js";
import { signPackage } from "./signPackage.js";
import { verifyPackage } from "./verifyPackage.js";
import { hashSerial } from "./hashSerialCode.js";
import generateKeys from "./generateKeys.js";
// Register the missing Handlebars helper
registerHandlebarsHelpers();
export async function createPackage(serialNumber, userData) {
    const authorFirstName = userData.firstName;
    const authorLastName = userData.lastName;
    const emailFromDB = userData.email;
    // Get basic information about the package
    const name = await text({
        message: "What is the name of your package?",
        validate: (value) => (/^(?:@[a-zA-Z0-9-*~]+\/)?[a-zA-Z0-9-~]+$/.test(value) ? undefined : "Invalid package name. Follow npm naming conventions.")
    });
    const description = await text({
        message: "Provide a description for your package:"
    });
    // Choose the language
    const languageChoice = await select({
        message: "Which language do you want to use for your project?",
        options: [
            { value: "TypeScript", label: "TypeScript" },
            { value: "JavaScript", label: "JavaScript" }
        ],
        initialValue: "TypeScript"
    });
    // Filter project types based on the selected language
    const projectOptions = languageChoice === "TypeScript"
        ? [
            { value: "react-ts", label: "React (with TypeScript)" },
            { value: "node-ts", label: "Node.js (with TypeScript)" }
        ]
        : [
            { value: "react-js", label: "React (with JavaScript)" },
            { value: "node-js", label: "Node.js (with JavaScript)" },
            { value: "vanilla-js", label: "Vanilla JavaScript" }
        ];
    const projectType = await select({
        message: "What type of project are you creating?",
        options: projectOptions,
        initialValue: projectOptions[0].value
    });
    // Include internal directory if needed
    const includeInternalDir = await confirm({
        message: "Will your project have internal-use components that need an `internal` directory?",
        initialValue: true
    });
    // Additional choices for tooling and configuration
    const useWebpack = await confirm({
        message: "Do you need to bundle your code using Webpack?",
        initialValue: true
    });
    const useEslint = await confirm({
        message: "Do you want to enforce coding standards with ESLint?",
        initialValue: true
    });
    const usePostcss = await confirm({
        message: "Will your project involve processing CSS (e.g., adding vendor prefixes)?",
        initialValue: true
    });
    const useNpmignore = await confirm({
        message: "Do you need to specify files to exclude from your npm package with a .npmignore file?",
        initialValue: true
    });
    const includeLicense = await confirm({
        message: "Do you want to include a LICENSE file for your project?",
        initialValue: true
    });
    const licenseType = includeLicense
        ? await select({
            message: "What type of license would you like to include?",
            options: [
                { value: "MIT", label: "MIT" },
                { value: "ISC", label: "ISC" },
                { value: "Apache-2.0", label: "Apache-2.0" },
                { value: "GPL-3.0", label: "GPL-3.0" }
            ],
            initialValue: "MIT"
        })
        : undefined;
    const includeCodeOfConduct = await confirm({
        message: "Do you want to include a CODE_OF_CONDUCT.md file for community guidelines?",
        initialValue: true
    });
    const includeReadme = await confirm({
        message: "Would you like to include a README.md file to describe your project?",
        initialValue: true
    });
    // Define base package.json data
    let packageData = {
        name: String(name),
        version: "0.1.0",
        description: String(description),
        main: languageChoice === "JavaScript" ? "index.js" : "dist/index.js",
        module: languageChoice === "JavaScript" ? "index.mjs" : "dist/index.mjs",
        type: typeof projectType === "string" && projectType.startsWith("node-") ? "commonjs" : "module",
        scripts: {
            test: "echo 'Error: no test specified' && exit 1",
            "packship:publish": "packship publish",
        },
        keywords: [],
        author: `${authorFirstName} ${authorLastName}`,
        email: emailFromDB,
        serialNumber: `PACKSHIP-${hashSerial(serialNumber)}`,
        license: String(licenseType) || "MIT",
        signature: ""
    };
    // Dynamically adjust package.json fields based on user choices
    if (typeof projectType === "string" && projectType.startsWith("react-")) {
        packageData = {
            ...packageData,
            peerDependencies: {
                react: "^18.2.0",
                "react-dom": "^18.2.0"
            },
            devDependencies: {
                "@babel/cli": "^7.10.5",
                "@babel/core": "^7.23.9",
                "@babel/preset-env": "^7.23.9",
                "@babel/preset-react": "^7.23.3"
            },
            scripts: {
                ...packageData.scripts,
                "build-babel": "babel src --out-dir dist --presets=@babel/preset-react,@babel/preset-env",
                build: languageChoice === "JavaScript" ? "npm run build-babel" : "tsc && npm run build-babel"
            }
        };
        if (languageChoice === "TypeScript") {
            packageData.devDependencies = {
                ...packageData.devDependencies,
                "@babel/preset-typescript": "^7.24.7",
                "@types/react": "^18.3.3",
                "@types/react-dom": "^18.3.0",
                "ts-loader": "^9.5.1",
                typescript: "^4.9.5"
            };
            packageData.scripts.build = "tsc && npm run build-babel";
        }
    }
    if (useWebpack) {
        packageData.devDependencies = {
            ...packageData.devDependencies,
            webpack: "^5.0.0",
            "webpack-cli": "^5.1.4",
        };
        packageData.scripts["build-webpack"] = "webpack --config webpack.config.js";
        packageData.scripts.build += " && npm run build-webpack";
    }
    if (useEslint) {
        packageData.devDependencies = {
            ...packageData.devDependencies,
            eslint: "^7.32.0",
            "eslint-plugin-react": "^7.24.0"
        };
        if (languageChoice === "TypeScript") {
            packageData.devDependencies = {
                ...packageData.devDependencies,
                "@typescript-eslint/eslint-plugin": "^5.0.0",
                "@typescript-eslint/parser": "^5.0.0"
            };
        }
        packageData.scripts.lint = "eslint .";
    }
    // Adjust dependencies based on other choices like PostCSS, etc.
    if (usePostcss) {
        packageData.devDependencies = {
            ...packageData.devDependencies,
            autoprefixer: "^10.3.1",
            postcss: "^8.4.5"
        };
    }
    // Generate cryptographic keys
    const outputDir = path.join(process.cwd(), 'keys'); // Define where you want the keys stored
    const { publicKeyPath, privateKeyPath } = generateKeys(outputDir);
    // Sign the packageData with signPackage
    const signedPackage = signPackage({ packageData, privateKeyPath });
    if (process.env.NODE_ENV === "development") {
        console.log("\n\x1b[32m%s\x1b[0m", "Package signed with signature:", signedPackage.signature);
    }
    // Assign the signature after signing the package
    packageData.signature = signedPackage.signature; // Corrected to reference signedPackage
    // Verify the package to check for forgery
    const isValid = verifyPackage({ packageData: signedPackage, publicKeyPath });
    if (process.env.NODE_ENV === "development") {
        console.log("\nPackage verification result:", isValid ? "Valid" : "Invalid");
    }
    packageData = signedPackage;
    // Set up the package directory
    const packageDir = path.join(process.cwd(), String(name));
    if (fs.existsSync(packageDir)) {
        throw new Error(`Directory ${String(name)} already exists.`);
    }
    // Create the package directory
    await fs.promises.mkdir(packageDir, { recursive: true });
    // Define files to generate based on user choices
    const files = [
        { name: "package.json", template: "package.json.hbs", data: { name, description } },
        ...(includeReadme ? [{ name: "README.md", template: "README.md.hbs", data: { name, description, licenseType } }] : []),
        { name: ".gitignore", template: ".gitignore.hbs", data: {} },
        ...(useNpmignore ? [{ name: ".npmignore", template: ".npmignore.hbs", data: {} }] : []),
        // Check if it"s a React project
        ...(typeof projectType === "string" && projectType.startsWith("react-")
            ? (languageChoice === "JavaScript"
                ? [{ name: "src/index.jsx", template: "index.jsx.hbs", data: {} }] // React with JavaScript
                : [
                    { name: "src/index.tsx", template: "index.tsx.hbs", data: {} }, // React with TypeScript
                    { name: "types/index.ts", template: "index.ts.hbs", data: {} },
                    { name: "src/declaration.d.ts", template: "declaration.d.ts.hbs", data: {} }
                ])
            : (languageChoice === "JavaScript"
                ? [{ name: "src/index.js", template: "index.js.hbs", data: {} }] // Non-React with JavaScript
                : [
                    { name: "src/index.ts", template: "index.ts.hbs", data: {} }, // Non-React with TypeScript
                    { name: "types/index.ts", template: "index.ts.hbs", data: {} },
                    { name: "src/declaration.d.ts", template: "declaration.d.ts.hbs", data: {} }
                ])),
        ...(includeInternalDir
            ? (typeof projectType === "string" && projectType.startsWith("react-")
                ? (languageChoice === "JavaScript"
                    ? [{ name: "src/internal/index.jsx", template: "index.jsx.hbs", data: {} }]
                    : [{ name: "src/internal/index.tsx", template: "index.tsx.hbs", data: {} }])
                : (languageChoice === "JavaScript"
                    ? [{ name: "src/internal/index.js", template: "index.js.hbs", data: {} }]
                    : [{ name: "src/internal/index.ts", template: "index.ts.hbs", data: {} }]))
            : []),
        ...(usePostcss
            ? [
                { name: "postcss.config.js", template: "postcss.config.hbs", data: {} },
                { name: "styles/style.css", template: "style.css.hbs", data: {} }
            ]
            : []),
        ...(includeLicense ? [{ name: "LICENSE.md", template: "LICENSE.md.hbs", data: { name, licenseType } }] : []),
        ...(includeCodeOfConduct ? [{ name: "CODE_OF_CONDUCT.md", template: "CODE_OF_CONDUCT.md.hbs", data: { name } }] : []),
        ...(useEslint ? [{ name: ".eslintrc.json", template: "eslintrc.json.hbs", data: {} }] : []),
        ...(useWebpack ? [{ name: "webpack.config.js", template: "webpack.config.hbs", data: { libraryName: name } }] : []),
        // Add Babel config if it"s a React project
        ...(typeof projectType === "string" && projectType.startsWith("react-")
            ? [{ name: "babel.config.json", template: "babel.config.hbs", data: {} }]
            : []),
        // Add tsconfig.json if language choice is TypeScript
        ...(languageChoice === "TypeScript" ? [{ name: "tsconfig.json", template: "tsconfig.json.hbs", data: {} }] : [])
    ];
    // Ensure the packageData object conforms to the expected types for rendering
    const templateData = {
        name: String(packageData.name),
        version: packageData.version,
        description: String(packageData.description),
        serialNumber: packageData.serialNumber,
        email: packageData.email,
        module: packageData.module,
        main: packageData.main,
        scripts: packageData.scripts,
        keywords: packageData.keywords,
        author: packageData.author,
        license: packageData.license,
        peerDependencies: packageData.peerDependencies,
        devDependencies: packageData.devDependencies,
        dependencies: packageData.dependencies, // Ensure this is correctly populated or handled if undefined
        files: packageData.files // Ensure this is correctly populated or handled if undefined
    };
    // Generate each file using its corresponding template
    await Promise.all(files.map(async ({ name, template, data }) => {
        const filePath = path.join(packageDir, name);
        // Ensure name and description are strings
        const preparedData = {
            ...templateData,
            ...data,
            name: typeof data.name === "symbol" ? String(data.name) : data.name,
            description: typeof data.description === "symbol" ? String(data.description) : data.description,
        };
        const content = renderTemplate(template, preparedData);
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        await fs.promises.writeFile(filePath, content);
    }));
    console.log("\n\x1b[32m%s\x1b[0m", "Package setup completed successfully.");
    return name;
}
