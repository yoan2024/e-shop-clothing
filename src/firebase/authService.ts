import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db } from "./firebase-config";

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
  const idUser = user.uid;
  const refUserDoc = doc(db, "users", idUser);

  let rol = "";
  if (email === "admin@gmail.com") {
    rol = "admin";
  } else {
    rol = "user";
  }

  await setDoc(refUserDoc, {
    name,
    email: email,
    createAt: new Date().toLocaleDateString(),
    phone: "unconfirmed",
    address: "unconfirmed",
    image: "",
    imageDefault: "/images/perfilimg.avif",
    rol,
    estatus: "Active",
    idUser,
  });

  return user;
};

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);
