import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { Command } from "commander";
import readline from 'readline';

const publishCommand = new Command("publish");

publishCommand
  .description('Publish a package')
  .action(publishPackage);

// Debug function to safely stringify objects
function debugStringify(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    return `[Cannot stringify: ${error}]`;
  }
}

// Function to parse author string into email
function extractAuthorEmail(author: string | {email?: string, name?: string} | undefined): string {
  // Debug log the incoming author data
  console.log('\nAuthor data received:', debugStringify(author));
  
  if (!author) {
    console.log('Author is undefined or null');
    return "UNKNOWN";
  }
  
  // If author is an object with email property
  if (typeof author === 'object') {
    console.log('Author is an object:', author);
    if (author.email) {
      return author.email;
    }
    // If no email but has name, log this case
    if (author.name) {
      console.log('Author object has name but no email:', author.name);
    }
    return "UNKNOWN";
  }
  
  // If author is a string in the format "Name <email>"
  if (typeof author === 'string') {
    console.log('Author is a string:', author);
    const emailMatch = author.match(/<(.+)>/);
    if (emailMatch) {
      return emailMatch[1];
    }
    // If no email format found in string
    console.log('No email format found in author string');
    return author;
  }
  
  console.log('Author is of unexpected type:', typeof author);
  return "UNKNOWN";
}

// Function to get project data from package.json or .packshiprc
function getLocalProjectData() {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    console.log('\nPackage.json data:', {
      name: packageJson.name,
      author: packageJson.author,
      serialNumber: packageJson.serialNumber || "UNKNOWN"
    });
    
    return {
      serialNumber: packageJson.serialNumber || "UNKNOWN",  
      author: extractAuthorEmail(packageJson.author),
      packageName: packageJson.name,
    };
  } else {
    throw new Error("package.json not found. Ensure you are in the correct project directory.");
  }
}

// Function to check the npm registry for existing package data
async function checkNpmRegistry(packageName: string) {
  const url = `https://registry.npmjs.org/${packageName}`;
  try {
    const response = await axios.get(url);
    console.log('\nNPM Registry response for latest version:', {
      author: response.data.author,
      maintainers: response.data.maintainers,
      'dist-tags': response.data['dist-tags'],
    });
    
    // Get the latest version data
    const latestVersion = response.data['dist-tags']?.latest;
    const latestVersionData = response.data.versions?.[latestVersion];
    
    console.log('\nLatest version data:', {
      version: latestVersion,
      author: latestVersionData?.author,
      maintainers: latestVersionData?.maintainers
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.log('\nPackage not found in npm registry');
      return null;
    }
    console.error('\nError fetching from npm registry:', error);
    return null;
  }
}

function is2FAEnabled(): Promise<boolean> {
  return new Promise((resolve) => {
    exec('npm profile get --json', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error checking 2FA status: ${error}`);
        resolve(false);
      } else {
        const profile = JSON.parse(stdout);
        resolve(profile.tfa && profile.tfa.mode !== 'disabled');
      }
    });
  });
}

// Function to get OTP from user
function getOTP(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Enter your NPM One-Time Password (OTP): ', (otp) => {
      rl.close();
      resolve(otp);
    });
  });
}

// Function to execute npm publish with OTP
async function executeNpmPublish() {
  const twoFAEnabled = await is2FAEnabled();
  let publishCommand = 'npm publish';
  
  if (twoFAEnabled) {
    const otp = await getOTP();
    publishCommand += ` --otp=${otp}`;
  }

  return new Promise((resolve, reject) => {
    exec(publishCommand, (error, stdout, stderr) => {
      if (error) {
        reject(`Error during npm publish: ${stderr}`);
      } else {
        resolve(`Publish successful: ${stdout}`);
      }
    });
  });
}

// Main function to handle package publishing
export async function publishPackage() {
  try {
    console.log('\n=== Starting Package Publication Process ===');
    const localData = getLocalProjectData();
    console.log('\nLocal project data:', debugStringify(localData));
    
    const registryData = await checkNpmRegistry(localData.packageName);
    
    if (!localData.serialNumber) {
      console.error("\nSerial number missing from package.json. Run `packship init` to initialize your package, or restore the serial number if it was removed.");
      process.exit(1);
    }

    if (!registryData) {
      console.log("\nPackage does not exist on npm yet. Proceeding to publish...");
      try {
        const result = await executeNpmPublish();
        console.log("\n\x1b[32m%s\x1b[0m", result);
      } catch (error) {
        console.error(`Error during npm publish: ${error}`);
      }
    } else {
      // Try to get author from multiple possible locations in the registry data
      let registryAuthor = extractAuthorEmail(registryData.author);
      
      // If author is not found in root, try latest version
      if (registryAuthor === "UNKNOWN") {
        const latestVersion = registryData['dist-tags']?.latest;
        const latestVersionData = registryData.versions?.[latestVersion];
        if (latestVersionData?.author) {
          registryAuthor = extractAuthorEmail(latestVersionData.author);
        }
      }
      
      const localAuthor = localData.author;

      console.log('\n=== Author Comparison ===');
      console.log('Registry Author:', registryAuthor);
      console.log('Local Author:', localAuthor);
      console.log('Match Status:', registryAuthor === localAuthor ? 'MATCH' : 'NO MATCH');

      // If registry author is UNKNOWN, allow publication
      if (registryAuthor === "UNKNOWN" || registryAuthor === localAuthor) {
        console.log("\n\x1b[32m%s\x1b[0m", "Package is valid and can be published.");
        try {
          const result = await executeNpmPublish();
          console.log("\n\x1b[32m%s\x1b[0m", result);
        } catch (error) {
          console.error(`Error during npm publish: ${error}`);
        }
      } else {
        console.error("\nAuthor mismatch detected:");
        console.error(`Registry author: ${registryAuthor}`);
        console.error(`Local author: ${localAuthor}`);
        console.error("\nCannot publish. To resolve this:");
        console.error("1. Ensure your package.json author email matches the npm registry");
        console.error("2. Verify you are logged in with the correct npm account");
        console.error("3. Check if you are listed as a maintainer of the package");
      }
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export default publishCommand;