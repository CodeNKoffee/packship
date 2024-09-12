import { verifyPackage } from "./verifyPackage.js";

// Simulate getting the serial number from the environment
const serialNumber = process.env.SERIAL_NUMBER;
const packageName = "your-new-package";

if (!serialNumber) {
  console.log("Serial number is missing. Please check your environment variables.");
  process.exit(1); // Exit with an error code to prevent publishing
}

const isVerified = verifyPackage({ serialNumber, packageName });

if (!isVerified) {
  console.log("Package verification failed. You cannot publish this package.");
  process.exit(1); // Exit with an error code to prevent publishing
} else {
  console.log("Package verified. Proceeding with publishing.");
}