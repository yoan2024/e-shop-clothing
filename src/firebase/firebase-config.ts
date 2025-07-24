// firebase-config.ts
// This file initializes the Firebase app and exports authentication and Firestore instances

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase project configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCJpCHuYjq0WmP6_Rq7np90WYQ7cMb7ZEg", // API key for your Firebase project
  authDomain: "ecomerce-shopping.firebaseapp.com", // Authentication domain
  projectId: "ecomerce-shopping", // Project ID
  storageBucket: "ecomerce-shopping.appspot.com", // Storage bucket URL
  messagingSenderId: "35191353582", // Messaging sender ID
  appId: "1:35191353582:web:a1d8a68142bf2fc1ad83ff", // Application ID
};

// Initialize the Firebase app with the provided config
const app = initializeApp(firebaseConfig);

// Export Firebase Authentication and Firestore services
export const auth = getAuth(app); // Firebase Authentication instance
export const db = getFirestore(app); // Firestore Database instance
