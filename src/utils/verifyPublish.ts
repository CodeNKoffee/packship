import { verifyPackage } from "./verifyPackage.js";
import { verifySerialCode } from "./verifySerialCode.js";
import fs from "fs";
import path from "path";

// Simulate getting the serial number from package.json
const packageJsonPath = path.resolve(process.cwd(), "package.json");

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const { author, email, serialNumber: packageSerial } = packageJson;

// Ensure serialNumber exists in package.json
if (!packageSerial || !packageSerial.startsWith("PACKSHIP-")) {
  console.log("\x1b[31m%s\x1b[0m", "Invalid serial number format. Ensure it starts with 'PACKSHIP-'.");
  process.exit(1); // Exit with an error code to prevent publishing
}

// Extract the hashed serial code part from the serial number
const hashedSerialCodeFromPackage = packageSerial.split("PACKSHIP-")[1];

// Verify serial code validity in Firestore and check if the author matches
const verifySerialAndAuthor = async () => {
  try {
    // Fetch the serial data from Firestore using the hashed serial code
    const { isValid, serialData, userData } = await verifySerialCode(hashedSerialCodeFromPackage);

    if (!isValid || !serialData) {
      console.log("\x1b[31m%s\x1b[0m", "[WARNING]: Invalid or missing serial code. You cannot publish this package.");
      process.exit(1); // Prevent publishing
    }

    // Check if the author matches the registered buyer"s email
    const fullName = `${userData.firstName} ${userData.lastName}`;

    if (userData.email !== email && fullName !== author) {
      console.log("\x1b[31m%s\x1b[0m", "[WARNING]: AUTHOR MISMATCH! The registered buyer is different from the package author.");
      process.exit(1); // Prevent publishing
    }

    // Proceed with signature verification
    const publicKeyPath = "public.key";
    const isVerified = verifyPackage({ packageData: packageJson, publicKeyPath });

    if (!isVerified) {
      console.log("\x1b[31m%s\x1b[0m", "[WARNING]: Package verification failed. You cannot publish this package.");
      process.exit(1); // Prevent publishing
    } else {
      console.log("\x1b[31m%s\x1b[0m", "Package verified. Proceeding with publishing.");
    }
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "An error occurred during the verification process:", error);
    process.exit(1); // Exit with an error code to prevent publishing
  }
};

verifySerialAndAuthor();