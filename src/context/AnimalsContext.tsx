import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { collection, onSnapshot, doc, updateDoc, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase.ts";

export type Animal = {
    id: string;
    name: string;
    status: "Disponível" | "Adotado" | "Em tratamento" | "Em andamento";
    breed?: string;
    sex?: string;
    color?: string;
    species?: string;
    rescueDate?: string;
    size?: string;
    notes?: string;
    image?: string;
    birthDate?: string;
    needsVaccine?: boolean;
    needsCheckup?: boolean;
    adoptionDate?: string;
};

type AnimalsContextType = {
    animals: Animal[];
    loading: boolean;
    refresh: () => Promise<void>;
    updateAnimalStatus: (id: string, status: Animal["status"]) => Promise<void>;
    removeAnimalFromContext: (id: string) => void;
    markAnimalAsAdopted: (id: string) => Promise<void>;
    markAnimalAsAvailable: (id: string) => Promise<void>;
};

const AnimalsContext = createContext<AnimalsContextType | undefined>(undefined);

export const AnimalsProvider = ({ children }: { children: ReactNode }) => {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const animalsCol = collection(db, "animals");
        setLoading(true);

        const unsubscribe = onSnapshot(
            animalsCol,
            (snapshot) => {
                const formatted = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Animal, "id">),
                }));
                setAnimals(formatted);
                setLoading(false);
            },
            (error) => {
                console.error("Erro no snapshot de animals:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const refresh = async () => {
        setLoading(true);
        try {
            const animalsCol = collection(db, "animals");
            const snap = await getDocs(animalsCol);
            const formatted = snap.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Animal, "id">),
            }));
            setAnimals(formatted);
        } catch (err) {
            console.error("Erro ao atualizar animais:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateAnimalStatus = async (id: string, status: Animal["status"]) => {
        const docRef = doc(db, "animals", id);
        await updateDoc(docRef, { status });
        setAnimals(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    };

    const markAnimalAsAdopted = async (id: string) => {
        await updateAnimalStatus(id, "Adotado");
    };

    const markAnimalAsAvailable = async (id: string) => {
        await updateAnimalStatus(id, "Disponível");
    };

    const removeAnimalFromContext = (id: string) => {
        setAnimals(prev => prev.filter(a => a.id !== id));
    };

    return (
        <AnimalsContext.Provider value={{
            animals,
            loading,
            refresh,
            updateAnimalStatus,
            removeAnimalFromContext,
            markAnimalAsAdopted,
            markAnimalAsAvailable
        }}>
            {children}
        </AnimalsContext.Provider>
    );
};

export const useAnimals = () => {
    const context = useContext(AnimalsContext);
    if (!context) throw new Error("useAnimals deve ser usado dentro de um AnimalsProvider");
    return context;
};
