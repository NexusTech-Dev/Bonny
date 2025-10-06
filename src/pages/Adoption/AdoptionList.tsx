import { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimals } from "../../context/AnimalsContext";
import { deleteAdoptionById, getAdoptions, updateAdoption } from "../../services/adoptionService.ts";
import EditAdoptionForm from "../../Components/EditAdoptionForm/EditAdoptionForm.tsx";
import {getAdopters} from "../../services/adopterService.ts";
import {getStaff} from "../../services/staffService.ts";

export type Adoption = {
    id: string;
    adopterId: string;
    animalId: string;
    employeeId: string;
    status: string;
    notes?: string;
};

export type AdoptionWithNames = Adoption & {
    adopterName: string;
    employeeName: string;
    animalName: string;
    adoptionDate?: string;
};

type AnimalStatus = "Adotado" | "Em andamento" | "Disponível" | "Em tratamento";

export default function AdoptionList() {
    const { animals, updateAnimalStatus } = useAnimals();
    const [adoptions, setAdoptions] = useState<AdoptionWithNames[]>([]);
    const [selectedAdoption, setSelectedAdoption] = useState<AdoptionWithNames | null>(null);
    const [editAdoption, setEditAdoption] = useState<AdoptionWithNames | null>(null);
    const [deleteAdoption, setDeleteAdoption] = useState<AdoptionWithNames | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdoptions = async () => {
            setLoading(true);
            try {
                const [rawAdoptions, adopters, employees] = await Promise.all([
                    getAdoptions(),
                    getAdopters(),
                    getStaff()
                ]);

                const formatted = rawAdoptions.map(a => {
                    const animal = animals.find(an => an.id === a.animalId);
                    const adopter = adopters.find(ad => ad.id === a.adopterId);
                    const employee = employees.find(emp => emp.id === a.employeeId);

                    return {
                        ...a,
                        animalName: animal?.name ?? "Desconhecido",
                        adopterName: adopter?.name ?? "Desconhecido",
                        employeeName: employee?.name ?? "Desconhecido",
                        status: a.status
                    };
                });

                setAdoptions(formatted);
            } catch (err) {
                console.error(err);
                toast.error("Erro ao carregar adoções.");
            } finally {
                setLoading(false);
            }
        };

        fetchAdoptions();
    }, [animals]);

    useEffect(() => {
        setAdoptions(prev =>
            prev.map(a => {
                const animal = animals.find(an => an.id === a.animalId);
                if (!animal) return a;

                const status =
                    a.status === "Em andamento"
                        ? "Em andamento"
                        : animal.status === "Disponível"
                            ? "Devolvido"
                            : "Adotado";

                return { ...a, status, animalName: animal.name };
            })
        );
    }, [animals]);

    const handleSaveAdoption = async (updatedAdoption: AdoptionWithNames) => {
        try {
            const newAnimalStatus: AnimalStatus =
                updatedAdoption.status === "Adotado"
                    ? "Adotado"
                    : updatedAdoption.status === "Devolvido"
                        ? "Disponível"
                        : "Em andamento";

            await updateAdoption(updatedAdoption.id, {
                status: updatedAdoption.status,
                notes: updatedAdoption.notes
            });

            await updateAnimalStatus(updatedAdoption.animalId, newAnimalStatus);

            setAdoptions(prev =>
                prev.map(a =>
                    a.id === updatedAdoption.id ? { ...a, status: updatedAdoption.status } : a
                )
            );

            toast.success("Adoção atualizada com sucesso!");
            setEditAdoption(null);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao atualizar adoção.");
        }
    };

    const confirmDelete = async () => {
        if (!deleteAdoption) return;
        try {
            await deleteAdoptionById(deleteAdoption.id);
            await updateAnimalStatus(deleteAdoption.animalId, "Disponível");
            setAdoptions(prev => prev.filter(a => a.id !== deleteAdoption.id));
            setDeleteAdoption(null);
            toast.success("Adoção removida com sucesso!");
        } catch (err) {
            console.error(err);
            toast.error("Erro ao excluir adoção.");
        }
    };

    const filteredAdoptions = adoptions.filter(a =>
        [a.adopterName, a.animalName, a.employeeName, a.status]
            .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Adoções</h1>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                        placeholder="Buscar adoção..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-1 sm:w-64 px-4 py-2 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow"
                        onClick={() => navigate("/adoptions")}
                    >
                        <Plus size={18} /> <span className="hidden sm:inline">Cadastrar</span>
                    </button>
                </div>
            </div>

            {/* Lista */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="rounded-2xl shadow-md bg-white overflow-hidden animate-pulse h-60"></div>
                    ))}
                </div>
            ) : filteredAdoptions.length === 0 ? (
                <div className="text-center text-gray-500 py-20">Nenhuma adoção encontrada.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAdoptions.map(a => {
                        const animalData = animals.find(an => an.id === a.animalId);
                        return (
                            <div key={a.id} className="rounded-2xl shadow-md hover:shadow-xl transition bg-white overflow-hidden group">
                                <div className="h-40 bg-gray-100 flex items-center justify-center relative">
                                    {animalData?.image ? (
                                        <img src={animalData.image} alt={a.animalName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-400">Animal</span>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button
                                            onClick={() => setDeleteAdoption(a)}
                                            className="text-red-500 bg-white p-1 rounded-full hover:bg-red-50 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <h2 className="font-semibold text-gray-800 text-lg">{a.animalName}</h2>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                a.status === "Adotado"
                                                    ? "bg-green-100 text-green-600"
                                                    : a.status === "Devolvido"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : "bg-blue-100 text-blue-600"
                                            }`}
                                        >
                      {a.status}
                    </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Adotante: {a.adopterName}</p>
                                    <p className="text-sm text-gray-600">Responsável: {a.employeeName}</p>
                                    <button
                                        onClick={() => setSelectedAdoption(a)}
                                        className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-100 transition text-sm font-medium"
                                    >
                                        Ver detalhes
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modais */}
            <AnimatePresence>
                {selectedAdoption && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                        >
                            <button onClick={() => setSelectedAdoption(null)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedAdoption.animalName}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
                                <p><strong>Adotante:</strong> {selectedAdoption.adopterName}</p>
                                <p><strong>Responsável:</strong> {selectedAdoption.employeeName}</p>
                                <p className="sm:col-span-2"><strong>Status:</strong> {selectedAdoption.status}</p>
                                <p className="sm:col-span-2"><strong>Observações:</strong> {selectedAdoption.notes || "Nenhuma"}</p>
                            </div>
                            <div className="flex justify-end mt-6 gap-3">
                                <button onClick={() => setSelectedAdoption(null)} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">Voltar</button>
                                <button
                                    onClick={() => { setEditAdoption(selectedAdoption); setSelectedAdoption(null); }}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                >
                                    Editar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {editAdoption && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                        >
                            <button onClick={() => setEditAdoption(null)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Adoção</h2>
                            <EditAdoptionForm
                                adoption={editAdoption}
                                animals={animals}
                                onCancel={() => setEditAdoption(null)}
                                onSave={handleSaveAdoption}
                            />
                        </motion.div>
                    </motion.div>
                )}

                {deleteAdoption && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Confirmar exclusão</h2>
                            <p className="text-gray-600 mb-6">
                                Deseja realmente excluir a adoção de <strong>{deleteAdoption.animalName}</strong>?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setDeleteAdoption(null)} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">Cancelar</button>
                                <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow">Excluir</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
