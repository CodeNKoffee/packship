import { Command } from "commander";
import { createPackage } from "../utils/createPackage.js";
import { verifySerialCode } from "../utils/verifySerialCode.js"; // Import the new util function
import { confirm, text } from "@clack/prompts";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
import { hashSerial } from "../utils/hashSerialCode.js";
const initCommand = new Command("init");
initCommand
    .description("\nInitialize a new npm package")
    .action(async () => {
    try {
        console.log("\n\x1b[33m%s\x1b[0m", "\n[NOTICE]: If you don't have a copy, you can obtain a copy of the package by visiting https://packship.hatemsoliman.dev");
        // Prompt the user for their serial number
        const serialNumber = await text({
            message: "\nPlease enter your serial number:",
            validate: (value) => (typeof value === "string" && value.trim() ? undefined : "Serial number is required.")
        });
        const cleanedSerialNumber = String(serialNumber).trim(); // Ensure no extra whitespace or quotes
        console.log("\n\x1b[33m%s\x1b[0m", "Entered Serial Number:", cleanedSerialNumber);
        if (!cleanedSerialNumber) {
            console.log("Serial number input was cancelled or invalid.");
            return;
        }
        const hashedSerialCode = hashSerial(cleanedSerialNumber);
        // Call the utility function to verify the serial code
        const { isValid, serialDoc, serialData, userData } = await verifySerialCode(hashedSerialCode);
        if (isValid && serialDoc && serialData) {
            if (serialData.isUsed) {
                console.log("\n\x1b[31m%s\x1b[0m", "This serial code has already been used. Each code can only be used once.");
                console.log("\n\x1b[35m%s\x1b[0m", "Setup and ship your npm package faster with Packship by visiting https://packship.hatemsoliman.dev");
                process.exit();
            }
            console.log("\n\x1b[32m%s\x1b[0m", "Congratulations! Your serial code is valid and ready for use.");
            console.log("\n\x1b[33m%s\x1b[0m", "PLEASE NOTE: Once you begin the package creation process, the serial code will be marked as used and cannot be reused. However, you'll have the flexibility to modify your package details later.");
            const proceedPackageCreation = await confirm({
                message: "Would you like to start creating your package now? This action will mark your serial code as used.",
                initialValue: true
            });
            if (!proceedPackageCreation) {
                console.log("\nPackage creation was cancelled successfully. Your serial code is still valid");
                process.exit();
                return;
            }
            else {
                // Mark the serial number as used
                await updateDoc(doc(db, "fulfilledOrders", serialDoc.id), {
                    isUsed: true
                });
                console.log("Success! The serial code is valid and has been used. Remember, it can only be used once.");
                // Proceed with package creation
                const packageName = await createPackage(cleanedSerialNumber, userData);
                console.log(`\nInitialized your new npm package: ${String(packageName)}\n\nHappy packshipping! 📦🛻💨\n`);
            }
        }
        else {
            console.log("\n\x1b[31m%s\x1b[0m", "Invalid serial number. Please check and try again.");
            process.exit();
        }
    }
    catch (error) {
        console.error("\n\x1b[31m%s\x1b[0m", "An error occurred during the process:", error);
        console.log("\n\x1b[31m%s\x1b[0m", "This could be an internal server issue. Please try again later.");
        process.exit();
    }
});
export default initCommand;
