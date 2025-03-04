import fs from "fs";
import path from "path";
import { renderTemplate } from "./fileUtils.js";
import { text, select, confirm } from "@clack/prompts";
import { PackageData } from "../types/index.js";
import { registerHandlebarsHelpers } from "./handlebarsHelpers.js";
import { watchCopy } from "./watchCopy.js";

// Register the missing Handlebars helper
registerHandlebarsHelpers();

export async function createPackage() {
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

  // Choose the project type
  const projectType = await select({
    message: "What type of project do you want to create?",
    options: projectOptions,
    initialValue: projectOptions[0].value
  });

  // Get author information
  const authorName = await text({
    message: "Author name:",
    validate: (value) => (value ? undefined : "Author name is required.")
  });

  const authorEmail = await text({
    message: "Author email:",
    validate: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "Please enter a valid email address.")
  });

  // Choose the license
  const license = await select({
    message: "Choose a license:",
    options: [
      { value: "MIT", label: "MIT" },
      { value: "Apache-2.0", label: "Apache 2.0" },
      { value: "GPL-3.0", label: "GPL 3.0" },
      { value: "BSD-3-Clause", label: "BSD 3-Clause" },
      { value: "UNLICENSED", label: "Unlicensed" }
    ],
    initialValue: "MIT"
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

  // Create the package data object
  const packageData: PackageData = {
    name: String(name),
    description: String(description),
    language: String(languageChoice),
    projectType: String(projectType),
    author: {
      name: String(authorName),
      email: String(authorEmail)
    },
    license: String(license)
  };

  // Create the package directory
  const packageDir = path.join(process.cwd(), String(name));
  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir, { recursive: true });
  }

  // Get the template directory based on the project type
  const templateDir = path.join(new URL('../..', import.meta.url).pathname, 'templates', String(projectType));

  // Copy template files to the package directory
  await watchCopy(templateDir, packageDir, packageData);

  return name;
}