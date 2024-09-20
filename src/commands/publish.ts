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

// Function to get project data from package.json or .packshiprc
function getLocalProjectData() {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    return {
      serialNumber: packageJson.serialNumber || "UNKNOWN",  
      author: packageJson.author || "UNKNOWN",
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
    return response.data;
  } catch (error) {
    return null; // Package does not exist on npm
  }
}

// Function to get OTP from user
function getOTP(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Enter your One-Time Password (OTP): ', (otp) => {
      rl.close();
      resolve(otp);
    });
  });
}

// Function to execute npm publish with OTP
async function executeNpmPublish() {
  const otp = await getOTP();
  return new Promise((resolve, reject) => {
    exec(`npm publish --otp=${otp}`, (err, stdout, stderr) => {
      if (err) {
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
    const localData = getLocalProjectData();
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
      const registryAuthor = registryData.author?.email;

      // Check if author and package name match
      if (registryAuthor === localData.author) {
        console.log("\n\x1b[32m%s\x1b[0m", "Package is valid and can be published.");
        try {
          const result = await executeNpmPublish();
          console.log("\n\x1b[32m%s\x1b[0m", result);
        } catch (error) {
          console.error(`Error during npm publish: ${error}`);
        }
      } else {
        console.log(`Registered Author: ${registryAuthor} and Local Data: ${localData.author}`)
        console.error("Package name or author mismatch. Cannot publish. Try publishing with a different name OR Proceed with current name (if you are the rightful owner)");
      }
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

export default publishCommand;