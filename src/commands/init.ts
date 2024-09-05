import { Command } from 'commander';
import { createPackage } from '../utils/createPackage.js';
import { text } from '@clack/prompts';
import { collection, query, where, getDocs, updateDoc, doc, limit } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig.js'; // Import db

const initCommand = new Command("init");

initCommand
  .description('Initialize a new npm package')
  .action(async () => {
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
    const serialQuery = query(
      collection(db, "fulfilledOrders"),
      where("serialCode", "==", serialNumber),
      where("isUsed", "==", false),
      limit(1)
    );

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
    } else {
      console.log("Invalid or already used serial number. Please check and try again.");
    }
  });

export default initCommand;
