// firebase-config.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJpCHuYjq0WmP6_Rq7np90WYQ7cMb7ZEg",
  authDomain: "ecomerce-shopping.firebaseapp.com",
  projectId: "ecomerce-shopping",
  storageBucket: "ecomerce-shopping.appspot.com",
  messagingSenderId: "35191353582",
  appId: "1:35191353582:web:a1d8a68142bf2fc1ad83ff",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
