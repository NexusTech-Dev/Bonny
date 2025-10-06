import { db } from "../lib/firebase.ts";
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { updateAnimalStatus } from "./animalService.ts";

const adoptionsCollection = collection(db, "adoptions");

export type RawAdoption = {
    adopterId: string;
    animalId: string;
    employeeId: string;
    status: string;
    notes?: string;
    adoptionDate?: string;
};

export async function registerAdoption(data: {
    adopterId: string;
    animalId: string;
    employeeId: string;
    status: string;
    notes: string;
    adoptionDate: string
}) {
    // Cria o registro da adoção
    const docRef = await addDoc(adoptionsCollection, {
        ...data,
        createdAt: new Date(),
    });

    // Atualiza o status do animal conforme o status da adoção
    await updateAnimalStatus(data.animalId, data.status);

    return docRef.id;
}

export const getAdoptions = async (): Promise<(RawAdoption & { id: string })[]> => {
    const snapshot = await getDocs(adoptionsCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as RawAdoption),
    }));
};

export const deleteAdoptionById = async (id: string) => {
    const docRef = doc(db, "adoptions", id);
    await deleteDoc(docRef);
};

export const updateAdoption = async (id: string, data: Partial<RawAdoption>) => {
    const docRef = doc(db, "adoptions", id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
    });

    // Sempre que o status da adoção mudar, o status do animal também é atualizado
    if (data.animalId && data.status) {
        await updateAnimalStatus(data.animalId, data.status);
    }
};
