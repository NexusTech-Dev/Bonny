import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export type Adoption = {
    id: string;
    adopterId: string;
    animalId: string;
    employeeId: string;
    status: string;
    notes?: string;
    adoptionDate?: string;
};

type AdoptionsContextType = {
    adoptions: Adoption[];
};

const AdoptionsContext = createContext<AdoptionsContextType | undefined>(undefined);

export const AdoptionsProvider = ({ children }: { children: ReactNode }) => {
    const [adoptions, setAdoptions] = useState<Adoption[]>([]);

    useEffect(() => {
        const adoptionsCol = collection(db, "adoptions");
        const unsubscribe = onSnapshot(adoptionsCol, (snapshot) => {
            const formatted = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Adoption, "id">),
            }));
            setAdoptions(formatted);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AdoptionsContext.Provider value={{ adoptions }}>
            {children}
        </AdoptionsContext.Provider>
    );
};

export const useAdoptions = () => {
    const context = useContext(AdoptionsContext);
    if (!context) throw new Error("useAdoptions deve ser usado dentro de um AdoptionsProvider");
    return context;
};
