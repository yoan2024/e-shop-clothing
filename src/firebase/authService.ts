import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase-config";
import { updateProfile } from "firebase/auth";

export const signup = async (email: string, password: string, name: string) => {
  const credenciales = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = credenciales.user;
  await updateProfile(user, {
    displayName: name,
  });

  return user;
};

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);
