import { db } from "../lib/firebase.ts";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
    type DocumentData,
} from "firebase/firestore";
import type { Staff } from "../pages/Staff/StaffList.tsx";

const staffCollection = collection(db, "staff");

export const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });

export async function registerStaff(
    data: Omit<Staff, "id">,
    imageFile?: File
) {
    let imageBase64 = "";

    if (imageFile) {
        imageBase64 = await fileToBase64(imageFile);
    }

    const docRef = await addDoc(staffCollection, {
        ...data,
        image: imageBase64,
        createdAt: new Date(),
    });

    return docRef.id;
}

export const getStaff = async (): Promise<Staff[]> => {
    const snapshot = await getDocs(staffCollection);
    return snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as DocumentData;
        return {
            id: docSnap.id,
            name: data.name || "Sem nome",
            role: data.role || "",
            email: data.email || "",
            phone: data.phone || "",
            sex: data.sex || "",
            image: data.image || "",
        };
    });
};

export const deleteStaffById = async (id: string) => {
    await deleteDoc(doc(db, "staff", id));
};

export async function updateStaffById(
    id: string,
    data: Partial<Staff>,
    imageFile?: File
) {
    const docRef = doc(db, "staff", id);

    let updateData: Partial<Staff> = { ...data };

    if (imageFile) {
        updateData.image = await fileToBase64(imageFile);
    }

    await updateDoc(docRef, updateData);
}
