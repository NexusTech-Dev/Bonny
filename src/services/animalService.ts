import { db } from "../lib/firebase.ts";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";

const animalsCollection = collection(db, "animals");

export const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });

export async function registerAnimal(data: any, imageFile?: File) {
    let imageBase64 = "";

    if (imageFile) {
        imageBase64 = await fileToBase64(imageFile);
    }

    const docRef = await addDoc(animalsCollection, {
        ...data,
        image: imageBase64,
        createdAt: new Date(),
    });

    return docRef.id;
}

export async function getAnimals() {
    const snapshot = await getDocs(animalsCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function deleteAnimalById(id: string) {
    const docRef = doc(db, "animals", id);
    await deleteDoc(docRef);
}
