import { Command } from 'commander';
import { createPackage } from '../utils/createPackage.js';
import { text } from '@clack/prompts';
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
        const serialQuery = query(collection(db, "fulfilledOrders"), where("serialCode", "==", serialNumber), limit(1) // Only fetching one document, even if more exist
        );
        console.log("Querying Firestore with:", {
            serialCode: serialNumber
        });
        // Attempt to retrieve the document from Firestore
        const serialSnapshot = await getDocs(serialQuery);
        if (!serialSnapshot.empty) {
            const serialDoc = serialSnapshot.docs[0];
            const serialData = serialDoc.data();
            // Log the current status of the serial code (whether it's used)
            console.log("Serial code found:", serialData);
            console.log("isUsed:", serialData.isUsed);
            // Check if the serial number has already been used
            if (serialData.isUsed) {
                console.log("Serial code is already used.");
            }
            else {
                // Mark the serial number as used
                await updateDoc(doc(db, "fulfilledOrders", serialDoc.id), {
                    isUsed: true
                });
                // Proceed with package creation
                const packageName = await createPackage();
                console.log(`Initialized your new npm package: ${String(packageName)}\n\nHappy packshipping! 📦🛻💨\n`);
            }
        }
        else {
            console.log("Invalid serial number. Please check and try again.");
        }
    }
    catch (error) {
        console.error("An error occurred during the process:", error);
        console.log("This could be an internal server issue. Please try again later.");
    }
});
export default initCommand;
