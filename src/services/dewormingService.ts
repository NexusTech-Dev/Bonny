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

interface DewormingData {
    dewormerId: string | string[];
    animalId: string;
    employeeId: string;
    applicationDate: string;
    nextApplicationDate: string;
    notes?: string;
}

const dewormingCollection = collection(db, "dewormings");

export const registerDeworming = async (data: DewormingData & { dewormerId: string[] }) => {
    try {
        await Promise.all(
            data.dewormerId.map((id) =>
                addDoc(dewormingCollection, {
                    ...data,
                    dewormerId: id,
                    applicationDate: Timestamp.fromDate(new Date(data.applicationDate)),
                    nextApplicationDate: data.nextApplicationDate
                        ? Timestamp.fromDate(new Date(data.nextApplicationDate))
                        : null,
                    createdAt: Timestamp.now(),
                })
            )
        );
    } catch (error) {
        console.error("Erro ao registrar vermífugo:", error);
        throw error;
    }
};

export const getDewormings = async (): Promise<HealthRecord[]> => {
    try {
        const snapshot = await getDocs(dewormingCollection);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<HealthRecord, "id">),
        }));
    } catch (error) {
        console.error("Erro ao buscar vermífugos:", error);
        throw error;
    }
};

export const deleteDewormingRecord = async (id: string) => {
    try {
        await deleteDoc(doc(db, "dewormings", id));
    } catch (error) {
        console.error("Erro ao excluir vermífugo:", error);
        throw error;
    }
};
