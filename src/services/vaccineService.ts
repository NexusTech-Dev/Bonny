import { db } from "../lib/firebase.ts";
import {
    collection,
    addDoc,
    getDocs,
    Timestamp,
} from "firebase/firestore";

interface VaccineData {
    vaccineId: string | string[];
    animalId: string;
    employeeId: string;
    applicationDate: string;
    nextDoseDate: string;
    notes?: string;
    booster1?: string;
    booster2?: string;
    booster3?: string;
}

const vaccineCollection = collection(db, "vaccines");

export const registerVaccine = async (data: VaccineData & { vaccineId: string[] }) => {
    try {
        await Promise.all(
            data.vaccineId.map(id =>
                addDoc(vaccineCollection, {
                    ...data,
                    vaccineId: id,
                    applicationDate: Timestamp.fromDate(new Date(data.applicationDate)),
                    booster1: data.booster1 ? Timestamp.fromDate(new Date(data.booster1)) : null,
                    booster2: data.booster2 ? Timestamp.fromDate(new Date(data.booster2)) : null,
                    booster3: data.booster3 ? Timestamp.fromDate(new Date(data.booster3)) : null,
                    createdAt: Timestamp.now(),
                })
            )
        );
    } catch (error) {
        console.error("Erro ao registrar vacina:", error);
        throw error;
    }
};

export const getVaccines = async () => {
    try {
        const snapshot = await getDocs(vaccineCollection);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Erro ao buscar vacinas:", error);
        throw error;
    }
};
