import { db } from "../lib/firebase.ts";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    type DocumentData,
} from "firebase/firestore";
import type { Adopter } from "../pages/Adopter/AdopterList.tsx";

const adopterCollection = collection(db, "adopters");

export async function registerAdopter(data: Omit<Adopter, "id">): Promise<string> {
    const docRef = await addDoc(adopterCollection, {
        ...data,
        hasPets: !!data.hasPets,
        createdAt: new Date(),
    });
    return docRef.id;
}

export const getAdopters = async (): Promise<Adopter[]> => {
    const snapshot = await getDocs(adopterCollection);
    return snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as DocumentData;
        return {
            id: docSnap.id,
            name: data.name || "Sem nome",
            email: data.email || "",
            phone: data.phone || "",
            sex: data.sex || "",
            notes: data.notes || "",
            rg: data.rg || "",
            cpf: data.cpf || "",
            maritalStatus: data.maritalStatus || "",
            state: data.state || "",
            city: data.city || "",
            district: data.district || "",
            street: data.street || "",
            number: data.number || "",
            complement: data.complement || "",
            cep: data.cep || "",
            hasPets: !!data.hasPets,
        } as Adopter;
    });
};

export const getAdopterById = async (id: string): Promise<Adopter | null> => {
    const docRef = doc(db, "adopters", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const data = docSnap.data() as DocumentData;
    return {
        id: docSnap.id,
        name: data.name || "Sem nome",
        email: data.email || "",
        phone: data.phone || "",
        sex: data.sex || "",
        notes: data.notes || "",
        rg: data.rg || "",
        cpf: data.cpf || "",
        maritalStatus: data.maritalStatus || "",
        state: data.state || "",
        city: data.city || "",
        district: data.district || "",
        street: data.street || "",
        number: data.number || "",
        complement: data.complement || "",
        cep: data.cep || "",
        hasPets: !!data.hasPets,
    } as Adopter;
};

export async function updateAdopterById(id: string, data: Partial<Adopter>) {
    const docRef = doc(db, "adopters", id);
    await updateDoc(docRef, {
        ...data,
        hasPets: data.hasPets !== undefined ? data.hasPets : undefined,
    });
}

export const deleteAdopterById = async (id: string) => {
    await deleteDoc(doc(db, "adopters", id));
};
