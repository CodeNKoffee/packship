import fs from 'fs';
import path from 'path';
import { select } from '@clack/prompts';
import { registerHandlebarsHelpers } from './handlebarsHelpers.js';
import { getPackageDetails, getProjectOptions, getAdditionalChoices, getLicenseType, shouldIncludeFile } from './prompts.js';
import { generateFiles } from './fileGeneration.js';
import { buildPackageData, adjustPackageData } from './packageDataUtils.js';
registerHandlebarsHelpers();
export async function createPackage() {
    // Get basic information about the package
    const { name, description, languageChoice, } = await getPackageDetails();
    const nameStr = String(name), descriptionStr = String(description), languageChoiceStr = String(languageChoice);
    const projectOptions = getProjectOptions(languageChoiceStr);
    const projectType = await select({
        message: 'What type of project are you creating?',
        options: projectOptions,
        initialValue: projectOptions[0].value
    });
    const projectTypeStr = String(projectType);
    // Get additional choices
    const { includeInternalDir, useWebpack, useEslint, usePostcss, useNpmignore, includeLicense, includeCodeOfConduct, includeReadme } = await getAdditionalChoices();
    const includeInternalDirBool = Boolean(includeInternalDir), useWebpackBool = Boolean(useWebpack), useEslintBool = Boolean(useEslint), usePostcssBool = Boolean(usePostcss), useNpmignoreBool = Boolean(useNpmignore), includeLicenseBool = Boolean(includeLicense), includeCodeOfConductBool = Boolean(includeCodeOfConduct), includeReadmeBool = Boolean(includeReadme);
    const licenseType = includeLicense ? await getLicenseType() : undefined;
    const licenseTypeStr = String(licenseType);
    // Building the package 
    let packageData = buildPackageData(nameStr, descriptionStr, languageChoiceStr, licenseTypeStr);
    packageData = adjustPackageData(packageData, projectTypeStr, languageChoiceStr, useWebpackBool, useEslintBool, usePostcssBool);
    // Set up the package directory
    const packageDir = path.join(process.cwd(), nameStr);
    if (fs.existsSync(packageDir)) {
        throw new Error(`Directory ${nameStr} already exists.`);
    }
    // Create the package directory
    await fs.promises.mkdir(packageDir, { recursive: true });
    // Define files to generate based on user choices
    const files = shouldIncludeFile({
        includeReadmeBool,
        useNpmignoreBool,
        projectTypeStr,
        languageChoiceStr,
        includeInternalDirBool,
        usePostcssBool,
        includeLicenseBool,
        includeCodeOfConductBool,
        useEslintBool,
        useWebpackBool
    });
    // Generate the files
    await generateFiles(files, packageData, packageDir);
    console.log('Package setup completed successfully.');
    return nameStr;
}
