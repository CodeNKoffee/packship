import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig.js'; // Import db

export const verifySerialCode = async (serialNumber: string) => {
  try {
    // Query to verify the serial number and check if it's unused
    const serialQuery = query(
      collection(db, "fulfilledOrders"),
      where("serialCode", "==", serialNumber),
      limit(1) // Only fetching one document
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

      // Log the serial code details in development mode only
      if (process.env.NODE_ENV === 'development') {
        console.log("Serial Code Details:", serialData.serialCode);
        console.log("isUsed:", serialData.isUsed);
      }

      // Return the serial document data if found
      return { isValid: true, serialDoc, serialData };
    } else {
      return { isValid: false };
    }
  } catch (error) {
    console.error("An error occurred during serial code verification:", error);
    throw new Error("Serial code verification failed");
  }
};