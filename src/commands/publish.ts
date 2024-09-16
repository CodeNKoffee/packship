import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { Command } from "commander";

const publishCommand = new Command();

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

// Main function to handle package publishing

publishCommand
  .command("publish")
  .description('Publish a package')
  .action(publishPackage);

export async function publishPackage() {
  try {
    const localData = getLocalProjectData();
    const registryData = await checkNpmRegistry(localData.packageName);

    if (!registryData) {
      console.log("\n\x1b[31m%s\x1b[0m", "Package does not exist on npm. Proceeding to publish...");
      // Execute npm publish
      exec("npm publish", (err, stdout, stderr) => {
        if (err) {
          console.error(`Error during npm publish: ${stderr}`);
        } else {
          console.log(`Publish successful: ${stdout}`);
        }
      });
    } else {
      const registryAuthor = registryData.author?.email;

      // Check if author and package name match
      if (registryAuthor === localData.author) {
        console.log("\n\x1b[31m%s\x1b[0m", "Package is valid and can be published.");
        // Execute npm publish
        exec("npm publish", (err, stdout, stderr) => {
          if (err) {
            console.error(`Error during npm publish: ${stderr}`);
          } else {
            console.log(`Publish successful: ${stdout}`);
          }
        });
      } else {
        console.error("Package name or author mismatch. Cannot publish.");
      }
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

publishCommand.parse(process.argv);

export default publishCommand;