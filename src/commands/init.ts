import { Command } from 'commander';
import { createPackage } from '../utils/createPackage.js';
import { confirm, text } from '@clack/prompts';
import { collection, query, where, getDocs, updateDoc, doc, limit } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig.js'; // Import db
import dotenvSafe from "dotenv-safe";

// dotenv.config();
dotenvSafe.config();

const initCommand = new Command("init");

initCommand
  .description('Initialize a new npm package')
  .action(async () => {
    try {
      // Prompt the user for their serial number
      const serialNumber = await text({
        message: 'Please enter your serial number:',
        validate: (value) => (value ? undefined : 'Serial number is required.')
      });

      if (!serialNumber) {
        console.log("Serial number input was cancelled.");
        return;
      }

      // Query to verify the serial number and check if it's unused
      const serialQuery = query(
        collection(db, "fulfilledOrders"),
        where("serialCode", "==", serialNumber),
        limit(1) // Only fetching one document, even if more exist
      );

      // Log the query in development mode only
      if (process.env.NODE_ENV === 'development') {
        console.log("Querying Firestore with:", { serialCode: serialNumber });
      }

      // Attempt to retrieve the document from Firestore
      const serialSnapshot = await getDocs(serialQuery);

      if (!serialSnapshot.empty) {
        const serialDoc = serialSnapshot.docs[0];
        const serialData = serialDoc.data();

        // Log the query in development mode only
        if (process.env.NODE_ENV === 'development') {
          console.log("Serial Code Details:", serialData.serialCode);
          console.log("isUsed:", serialData.isUsed);
        }

        // Check if the serial number has already been used
        if (serialData.isUsed) {
          console.log("\x1b[31m%s\x1b[0m", "This serial code has already been used. Each code can only be used once.");
          return;
        } 

        console.log("\n\x1b[32m%s\x1b[0m", "Congratulations! Your serial code is valid and ready for use.");

        console.log("\n\x1b[33m%s\x1b[0m", "PLEASE NOTE: Once you begin the package creation process, the serial code will be marked as used and cannot be reused. However, you'll have the flexibility to modify your package details later.");

        const proceedPackageCreation = await confirm({
          message:  'Would you like to start creating your package now? This action will mark your serial code as used.',
          initialValue: true
        });

        if (!proceedPackageCreation) {
          console.log("\nPackage creation was cancelled successfully. Your serial code is still valid");
          return;
        } else {
          // Mark the serial number as used
          await updateDoc(doc(db, "fulfilledOrders", serialDoc.id), {
            isUsed: true
          });
          
          console.log("Success! The serial code is valid and has been used. Remember, it can only be used once.");

          // Proceed with package creation
          const packageName = await createPackage();
          console.log(`Initialized your new npm package: ${String(packageName)}\n\nHappy packshipping! 📦🛻💨\n`);
        }
      } else {
        console.log("\x1b[31m%s\x1b[0m", "Invalid serial number. Please check and try again.");
      }
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", "An error occurred during the process:", error);
      console.log("\x1b[31m%s\x1b[0m", "This could be an internal server issue. Please try again later.");
    }
  });

export default initCommand;