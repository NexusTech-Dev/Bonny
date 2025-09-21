import {db} from "../lib/firebase.ts";
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc} from "firebase/firestore";
import type {Animal} from "../pages/AnimalList.tsx";

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

export const getAnimals = async (): Promise<Animal[]> => {
    const snapshot = await getDocs(collection(db, "animals"));
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name || "Sem nome",
            sex: data.sex || "M",
            breed: data.breed || "",
            color: data.color || "",
            species: data.species || "",
            rescueDate: data.rescueDate || "",
            size: data.size || "",
            status: data.status || "Disponível",
            notes: data.notes || "",
            image: data.image || "",
            birthDate: data.birthDate || ""
        };
    });
};

export const deleteAnimalById = async (id: string) => {
    await deleteDoc(doc(db, "animals", id));
};

export async function updateAnimalById(id: string, data: any, imageFile?: File) {
    const docRef = doc(db, "animals", id);

    let updateData = { ...data };

    if (imageFile) {
        updateData.image = await fileToBase64(imageFile);
    }

    await updateDoc(docRef, updateData);
}
