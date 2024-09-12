import { verifyPackage } from "./verifyPackage.js";
import { verifySerialCode } from "./verifySerialCode.js";
import fs from 'fs';
import path from 'path';

// Simulate getting the serial number from the environment
const serialNumber = process.env.SERIAL_NUMBER;
const packageName = "your-new-package";
const packageJsonPath = path.resolve(process.cwd(), 'package.json');

// Check if the serial number exists
if (!serialNumber) {
  console.log("Serial number is missing. Please check your environment variables.");
  process.exit(1); // Exit with an error code to prevent publishing
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const { author, email } = packageJson;

// Verify serial code validity in Firestore and check if the author matches
const verifySerialAndAuthor = async () => {
  try {
    const { isValid, serialData, userData } = await verifySerialCode(serialNumber);

    if (!isValid) {
      console.log("Invalid serial code. You cannot publish this package.");
      process.exit(1); // Prevent publishing
    }

    // Check if the author matches the registered buyer's email
    if (!serialData) {
      throw new Error("Serial data is missing. Cannot verify the author.");
    }

    const fullName = `${userData.firstName} + ${userData.lastName}`

    if (userData.email !== email && fullName !== author) {
      console.log("Author mismatch! The registered buyer is different from the package author.");
      process.exit(1); // Prevent publishing
    }

    // Proceed with signature verification
    const publicKeyPath = "/public.key";
    const isVerified = verifyPackage({ packageData: packageJson, publicKeyPath });

    if (!isVerified) {
      console.log("Package verification failed. You cannot publish this package.");
      process.exit(1); // Prevent publishing
    } else {
      console.log("Package verified. Proceeding with publishing.");
    }
  } catch (error) {
    console.error("An error occurred during the verification process:", error);
    process.exit(1); // Exit with an error code to prevent publishing
  }
};

verifySerialAndAuthor();