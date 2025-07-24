// Firebase authentication and Firestore user management functions

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase-config";

/**
 * Registers a new user with Firebase Authentication and stores their data in Firestore.
 *
 * @param email - User's email address
 * @param password - User's password
 * @param name - User's full name
 * @returns The created user object
 */
export const signup = async (email: string, password: string, name: string) => {
  // Create a new user with email and password
  const credentials = await createUserWithEmailAndPassword(auth, email, password);
  const user = credentials.user;

  // Set user's display name in Firebase Authentication
  await updateProfile(user, {
    displayName: name,
  });

  const userId = user.uid;
  const userRef = doc(db, "users", userId);

  // Assign role based on email
  const role = email === "admin@gmail.com" ? "admin" : "user";

  // Store user information in Firestore
  await setDoc(userRef, {
    name,
    email,
    createAt: new Date().toLocaleDateString(),
    phone: "unconfirmed",
    address: "unconfirmed",
    image: "",
    imageDefault: "/images/perfilimg.avif",
    rol: role,
    estatus: "Active",
    idUser: userId,
  });

  return user;
};

/**
 * Logs in a user with Firebase Authentication.
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns A promise that resolves with the user credentials
 */
export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

/**
 * Logs out the currently authenticated user.
 *
 * @returns A promise that resolves when the user is signed out
 */
export const logout = () => signOut(auth);
