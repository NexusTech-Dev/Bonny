import { db } from "../lib/firebase.ts";
import {
    collection,
    addDoc,
    getDocs,
    Timestamp,
    deleteDoc,
    doc,
} from "firebase/firestore";
import type {HealthRecord} from "../pages/Health/types/healthRecord.ts";

export interface AntiparasiticData {
    antiparasiticId: string | string[];
    animalId: string;
    employeeId: string;
    applicationDate: string;
    nextApplicationDate?: string | null;
    notes?: string;
}

const antiparasiticCollection = collection(db, "antiparasitics");

export const registerAntiparasitic = async (
    data: AntiparasiticData & { antiparasiticId: string[] }
) => {
    try {
        await Promise.all(
            data.antiparasiticId.map(async (id) => {
                await addDoc(antiparasiticCollection, {
                    antiparasiticId: id,
                    animalId: data.animalId,
                    employeeId: data.employeeId,
                    applicationDate: Timestamp.fromDate(new Date(data.applicationDate)),
                    nextApplicationDate: data.nextApplicationDate
                        ? Timestamp.fromDate(new Date(data.nextApplicationDate))
                        : null,
                    notes: data.notes || "",
                    createdAt: Timestamp.now(),
                });
            })
        );
    } catch (error) {
        console.error("Erro ao registrar antiparasitário:", error);
        throw error;
    }
};

export const getAntiparasitics = async (): Promise<HealthRecord[]> => {
    try {
        const snapshot = await getDocs(antiparasiticCollection);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<HealthRecord, "id">),
        }));
    } catch (error) {
        console.error("Erro ao buscar antiparasitários:", error);
        throw error;
    }
};

export const deleteAntiparasiticRecord = async (id: string) => {
    try {
        await deleteDoc(doc(db, "antiparasitics", id));
    } catch (error) {
        console.error("Erro ao excluir antiparasitário:", error);
        throw error;
    }
};
