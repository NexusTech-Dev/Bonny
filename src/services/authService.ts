import { auth } from "../lib/firebase";
import {
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

export const loginUser = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
    return await signOut(auth);
};
