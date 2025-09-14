import { db, storage } from "../lib/firebase.ts";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export type AnimalData = {
    name: string;
    birthDate: string;
    sex: string;
    color: string;
    species: string;
    breed: string;
    rescueDate: string;
    size: string;
    status: string;
    notes: string;
    imageUrl?: string;
};

export const registerAnimal = async (data: AnimalData, imageFile?: File) => {
    try {
        let imageUrl = "";

        if (imageFile) {
            const storageRef = ref(storage, `animals/${Date.now()}-${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(storageRef);
        }

        const docRef = await addDoc(collection(db, "animals"), {
            ...data,
            imageUrl,
            createdAt: Timestamp.now(),
        });

        return docRef.id;
    } catch (error) {
        console.error("Erro ao registrar animal:", error);
        throw error;
    }
};
