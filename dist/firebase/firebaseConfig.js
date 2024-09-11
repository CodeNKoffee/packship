// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    // apiKey: "AIzaSyBq02FPwuwWaI0E-Dfs5rJqlCgshY3vBp0",
    // authDomain: "packship-cli.firebaseapp.com",
    // projectId: "packship-cli",
    // storageBucket: "packship-cli.appspot.com",
    // messagingSenderId: "362544992503",
    // appId: "1:362544992503:web:f6147ec016b39ff1d6c3f2",
    // measurementId: "G-8CJ5B14NRS"
};
// Declare the app variable here
let app;
// Initialize Firebase only if it hasn't been initialized already
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
}
else {
    app = getApps()[0];
}
// Initialize Firestore with the app
const db = getFirestore(app);
export { db };
