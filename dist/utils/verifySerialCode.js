import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig.js";
export const verifySerialCode = async (serialNumber) => {
    try {
        const serialQuery = query(collection(db, "fulfilledOrders"), where("serialCode", "==", serialNumber), limit(1) // Fetch one document
        );
        const serialSnapshot = await getDocs(serialQuery);
        if (!serialSnapshot.empty) {
            const serialDoc = serialSnapshot.docs[0];
            const serialData = serialDoc.data();
            const userData = {
                email: serialData.email,
                firstName: serialData.firstName,
                lastName: serialData.lastName
            };
            return { isValid: true, serialDoc, serialData, userData }; // Include serialData containing buyer email
        }
        else {
            return { isValid: false };
        }
    }
    catch (error) {
        console.error("An error occurred during serial code verification:", error);
        throw new Error("Serial code verification failed");
    }
};
