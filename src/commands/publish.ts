import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { Command } from "commander";
import readline from 'readline';
import { sendTelemetryEvent } from "../utils/telemetry.js";
import { MESSAGE, COLORS } from "../utils/colors.js";

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
function extractAuthorEmail(author: string | { email?: string, name?: string } | undefined): string {
  // Debug log the incoming author data
  if (process.env.NODE_ENV === "development") {
    console.log('\nAuthor data received:', debugStringify(author));
  }

  if (!author) {
    console.log('Author is undefined or null');
    return "UNKNOWN";
  }

  // If author is an object with email property
  if (typeof author === 'object') {
    if (process.env.NODE_ENV === "development") {
      console.log('Author is an object:', author);
    }
    if (author.email) {
      return author.email;
    }
    // If no email but has name, log this case
    if (author.name) {
      if (process.env.NODE_ENV === "development") {
        console.log('Author object has name but no email:', author.name);
      }
    }
    return "UNKNOWN";
  }

  // If author is a string, try to extract email
  const emailMatch = author.match(/<([^>]+)>/);
  if (emailMatch && emailMatch[1]) {
    return emailMatch[1];
  }

  // If no email found in string
  if (process.env.NODE_ENV === "development") {
    console.log('No email found in author string:', author);
  }
  return "UNKNOWN";
}

// Get local project data from package.json
function getLocalProjectData() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.error(MESSAGE.ERROR('Error: package.json not found in the current directory.'));
      process.exit(1);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return {
      name: packageJson.name,
      version: packageJson.version,
      author: packageJson.author
    };
  } catch (error) {
    console.error(MESSAGE.ERROR('Error reading package.json:'), error);
    process.exit(1);
  }
}

// Check if package exists on npm registry
async function checkNpmRegistry(packageName: string) {
  try {
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
    return { exists: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { exists: false };
    }
    console.error(MESSAGE.ERROR('Error checking npm registry:'), error);
    return { exists: false, error };
  }
}

// Check if 2FA is enabled for npm
function is2FAEnabled(): Promise<boolean> {
  return new Promise((resolve) => {
    exec('npm profile get', (error, stdout) => {
      if (error) {
        console.log(MESSAGE.ERROR('Error checking 2FA status:'), error);
        resolve(false);
        return;
      }

      const twoFactorAuthMatch = stdout.match(/two-factor auth: (.+)/i);
      const is2FA = twoFactorAuthMatch && twoFactorAuthMatch[1].trim().toLowerCase() !== 'disabled';

      resolve(is2FA || false);
    });
  });
}

// Get OTP from user if 2FA is enabled
function getOTP(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(`Enter your npm one-time password (OTP): ${COLORS.BRIGHT}`, (otp) => {
      process.stdout.write(COLORS.RESET); // Reset color after input
      rl.close();
      resolve(otp.trim());
    });
  });
}

// Execute npm publish command
async function executeNpmPublish() {
  const is2FA = await is2FAEnabled();
  let publishCommand = 'npm publish';

  if (is2FA) {
    console.log(MESSAGE.INFO('Two-factor authentication is enabled for your npm account.'));
    const otp = await getOTP();
    publishCommand += ` --otp=${otp}`;
  }

  return new Promise<void>((resolve, reject) => {
    console.log(MESSAGE.INFO(`Executing: ${publishCommand}`));

    exec(publishCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(MESSAGE.ERROR('Error publishing package:'), stderr || error.message);
        reject(error);
        return;
      }

      console.log(stdout);
      console.log(MESSAGE.SUCCESS('Package published successfully!'));
      resolve();
    });
  });
}

// Main publish function
export async function publishPackage() {
  try {
    console.log(MESSAGE.HEADER('Starting package publication process...'));

    // Get local project data
    const projectData = getLocalProjectData();
    const { name, version, author } = projectData;

    if (!name || !version) {
      console.error(MESSAGE.ERROR('Error: Package name or version not found in package.json'));
      process.exit(1);
    }

    console.log(MESSAGE.INFO(`Publishing package: ${MESSAGE.HIGHLIGHT(name)}@${MESSAGE.HIGHLIGHT(version)}`));

    // Check if package already exists on npm
    const npmCheck = await checkNpmRegistry(name);

    if (npmCheck.exists && npmCheck.data?.versions?.[version]) {
      console.error(MESSAGE.ERROR(`Error: Version ${version} already exists on npm. Please update your version number.`));
      process.exit(1);
    }

    // Execute npm publish
    await executeNpmPublish();

    // Send telemetry event for successful publish
    await sendTelemetryEvent({
      type: 'publish',
      name: 'package_published',
      data: {
        success: true,
        packageName: name,
        packageVersion: version
      }
    });

    console.log(`\n${MESSAGE.SUCCESS(`🎉 Successfully published ${name}@${version} to npm!`)}`);
  } catch (error) {
    // Send telemetry event for failed publish
    await sendTelemetryEvent({
      type: 'publish',
      name: 'package_publish_failed',
      data: {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });

    console.error(MESSAGE.ERROR('Failed to publish package:'), error);
    process.exit(1);
  }
}

export default publishCommand;