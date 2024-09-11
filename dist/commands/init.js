import { Command } from 'commander';
import { createPackage } from '../utils/createPackage.js';
import { text } from '@clack/prompts';
import { collection, query, where, getDocs, updateDoc, doc, limit } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig.js'; // Import db
import dotenvSafe from "dotenv-safe";
// import dotenv from "dotenv";
// dotenv.config();
dotenvSafe.config();
const initCommand = new Command("init");
initCommand
    .description('Initialize a new npm package')
    .action(async () => {
    // For debugging purposes
    console.log({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    });
    const requiredEnvVars = [
        process.env.FIREBASE_API_KEY,
        process.env.FIREBASE_AUTH_DOMAIN,
        process.env.FIREBASE_PROJECT_ID,
        process.env.FIREBASE_STORAGE_BUCKET,
        process.env.FIREBASE_MESSAGE_SENDER_ID,
        process.env.FIREBASE_APP_ID,
        process.env.FIREBASE_MEASUREMENT_ID
    ];
    for (const varName of requiredEnvVars) {
        if (!varName) {
            throw new Error(`Missing required environment variable: ${varName}`);
        }
    }
    // Prompt the user for their serial number
    const serialNumber = await text({
        message: 'Please enter your serial number:',
        validate: (value) => (value ? undefined : 'Serial number is required.')
    });
    if (!serialNumber) {
        console.log("Serial number input was cancelled.");
        return;
    }
    // Verify the serial number
    const serialQuery = query(collection(db, "fulfilledOrders"), where("serialCode", "==", serialNumber), where("isUsed", "==", false), limit(1));
    console.log("Querying Firestore with:", {
        serialCode: serialNumber,
        isUsed: false
    });
    const serialSnapshot = await getDocs(serialQuery);
    if (!serialSnapshot.empty) {
        const serialDoc = serialSnapshot.docs[0];
        const serialData = serialDoc.data();
        // Mark the serial number as used
        await updateDoc(doc(db, "fulfilledOrders", serialDoc.id), {
            isUsed: true
        });
        // Proceed with package creation
        const packageName = await createPackage();
        console.log(`Initialized your new npm package: ${String(packageName)}\n\nHappy packshipping! 📦🛻💨\n`);
    }
    else {
        console.log("Invalid or already used serial number. Please check and try again.");
    }
});
export default initCommand;
