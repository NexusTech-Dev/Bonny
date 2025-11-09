import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Syringe, Shield, Pill, X, Trash2 } from "lucide-react";
import { useAnimals } from "../../../context/AnimalsContext.tsx";
import { getVaccines, deleteVaccineRecord } from "../../../services/vaccineService.ts";
import { getAntiparasitics, deleteAntiparasiticRecord } from "../../../services/antiparasiticService.ts";
import { getDewormings, deleteDewormingRecord } from "../../../services/dewormingService.ts";
import toast from "react-hot-toast";
import type {HealthRecord} from "../types/healthRecord.ts";

export default function HealthCardList() {
    const { animals } = useAnimals();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAnimal, setSelectedAnimal] = useState<any | null>(null);
    const [animalHealth, setAnimalHealth] = useState<{
        vaccines: HealthRecord[];
        antiparasitics: HealthRecord[];
        dewormings: HealthRecord[];
    }>({
        vaccines: [],
        antiparasitics: [],
        dewormings: [],
    });

    useEffect(() => {
        const fetchHealthData = async () => {
            try {
                const [vaccineData, antiparasiticData, dewormingData] = await Promise.all([
                    getVaccines(),
                    getAntiparasitics(),
                    getDewormings(),
                ]);
                setAnimalHealth({
                    vaccines: vaccineData,
                    antiparasitics: antiparasiticData,
                    dewormings: dewormingData,
                });
            } catch (err) {
                console.error(err);
                toast.error("Erro ao carregar dados de saúde.");
            }
        };
        fetchHealthData();
    }, []);

    const filteredAnimals = animals.filter(
        (a) =>
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.breed?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const calcularIdade = (birthDate?: string) => {
        if (!birthDate) return "Não informado";
        const nascimento = new Date(birthDate);
        const hoje = new Date();
        let anos = hoje.getFullYear() - nascimento.getFullYear();
        let meses = hoje.getMonth() - nascimento.getMonth();
        if (meses < 0) {
            anos--;
            meses += 12;
        }
        return anos > 0 ? `${anos} ano${anos !== 1 ? "s" : ""}` : `${meses} mês${meses !== 1 ? "es" : ""}`;
    };

    const formatDate = (timestamp?: any) => {
        if (!timestamp) return "-";
        const date =
            timestamp.toDate?.() instanceof Date
                ? timestamp.toDate()
                : new Date(timestamp);
        return date.toLocaleDateString("pt-BR");
    };

    const getAnimalVaccines = (id: string) =>
        animalHealth.vaccines.filter((v) => v.animalId === id);

    const getAnimalAntiparasitics = (id: string) =>
        animalHealth.antiparasitics.filter((a) => a.animalId === id);

    const getAnimalDewormings = (id: string) =>
        animalHealth.dewormings.filter((d) => d.animalId === id);

    // Funções de remoção
    const handleDelete = async (type: "vaccine" | "antiparasitic" | "deworming", id: string) => {
        if (!window.confirm("Tem certeza que deseja remover este registro?")) return;

        try {
            if (type === "vaccine") {
                await deleteVaccineRecord(id);
                setAnimalHealth((prev) => ({
                    ...prev,
                    vaccines: prev.vaccines.filter((v) => v.id !== id),
                }));
            } else if (type === "antiparasitic") {
                await deleteAntiparasiticRecord(id);
                setAnimalHealth((prev) => ({
                    ...prev,
                    antiparasitics: prev.antiparasitics.filter((a) => a.id !== id),
                }));
            } else {
                await deleteDewormingRecord(id);
                setAnimalHealth((prev) => ({
                    ...prev,
                    dewormings: prev.dewormings.filter((d) => d.id !== id),
                }));
            }
            toast.success("Registro removido com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao remover registro.");
        }
    };

    return (
        <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Carteira de Saúde</h1>
                <input
                    placeholder="Buscar animal..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full sm:w-64"
                />
            </div>

            {filteredAnimals.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                    Nenhum animal encontrado.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAnimals.map((animal) => {
                        const vaccines = getAnimalVaccines(animal.id);
                        const antiparasitics = getAnimalAntiparasitics(animal.id);
                        const dewormings = getAnimalDewormings(animal.id);

                        return (
                            <div
                                key={animal.id}
                                className="rounded-2xl shadow-md hover:shadow-xl transition bg-white overflow-hidden group"
                            >
                                <div className="h-40 bg-gray-200 flex items-center justify-center relative">
                                    {animal.image ? (
                                        <img
                                            src={animal.image}
                                            alt={animal.name}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-400">Sem imagem</span>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col gap-2">
                                    <h2 className="font-semibold text-gray-800 text-lg">
                                        {animal.name}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {calcularIdade(animal.birthDate)} •{" "}
                                        {animal.breed || "-"}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-3 text-sm mt-2">
                                        <div className="flex items-center gap-1 text-blue-600">
                                            <Syringe size={14} />
                                            <span>{vaccines.length} vacinas</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-green-600">
                                            <Shield size={14} />
                                            <span>{antiparasitics.length} antiparasitários</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-purple-600">
                                            <Pill size={14} />
                                            <span>{dewormings.length} vermífugos</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedAnimal(animal)}
                                        className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-100 transition text-sm font-medium"
                                    >
                                        Ver mais
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <AnimatePresence>
                {selectedAnimal && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 relative overflow-y-auto max-h-[90vh]"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                        >
                            <button
                                onClick={() => setSelectedAnimal(null)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                {selectedAnimal.name} — Carteira de Saúde
                            </h2>

                            {/* Vacinas */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-blue-700 flex items-center gap-2 mb-2">
                                    <Syringe size={18} /> Vacinas
                                </h3>
                                <div className="bg-blue-50 rounded-xl p-3">
                                    {getAnimalVaccines(selectedAnimal.id).length > 0 ? (
                                        getAnimalVaccines(selectedAnimal.id).map((v) => (
                                            <div
                                                key={v.id}
                                                className="border-b border-blue-100 py-2 last:border-0 flex justify-between items-start"
                                            >
                                                <div>
                                                    <p><strong>ID:</strong> {v.vaccineId}</p>
                                                    <p><strong>Aplicação:</strong> {formatDate(v.applicationDate)}</p>
                                                    <p><strong>Próxima dose:</strong> {formatDate(v.nextDoseDate)}</p>
                                                    <p><strong>Observações:</strong> {v.notes || "-"}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete("vaccine", v.id)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">Nenhuma vacina registrada.</p>
                                    )}
                                </div>
                            </div>

                            {/* Antiparasitários */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-green-700 flex items-center gap-2 mb-2">
                                    <Shield size={18} /> Antiparasitários
                                </h3>
                                <div className="bg-green-50 rounded-xl p-3">
                                    {getAnimalAntiparasitics(selectedAnimal.id).length > 0 ? (
                                        getAnimalAntiparasitics(selectedAnimal.id).map((a) => (
                                            <div
                                                key={a.id}
                                                className="border-b border-green-100 py-2 last:border-0 flex justify-between items-start"
                                            >
                                                <div>
                                                    <p><strong>ID:</strong> {a.antiparasiticId}</p>
                                                    <p><strong>Aplicação:</strong> {formatDate(a.applicationDate)}</p>
                                                    <p><strong>Próxima aplicação:</strong> {formatDate(a.nextApplicationDate)}</p>
                                                    <p><strong>Observações:</strong> {a.notes || "-"}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete("antiparasitic", a.id)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">Nenhum antiparasitário registrado.</p>
                                    )}
                                </div>
                            </div>

                            {/* Vermífugos */}
                            <div>
                                <h3 className="font-semibold text-purple-700 flex items-center gap-2 mb-2">
                                    <Pill size={18} /> Vermífugos
                                </h3>
                                <div className="bg-purple-50 rounded-xl p-3">
                                    {getAnimalDewormings(selectedAnimal.id).length > 0 ? (
                                        getAnimalDewormings(selectedAnimal.id).map((d) => (
                                            <div
                                                key={d.id}
                                                className="border-b border-purple-100 py-2 last:border-0 flex justify-between items-start"
                                            >
                                                <div>
                                                    <p><strong>ID:</strong> {d.dewormingId}</p>
                                                    <p><strong>Aplicação:</strong> {formatDate(d.applicationDate)}</p>
                                                    <p><strong>Próxima aplicação:</strong> {formatDate(d.nextApplicationDate)}</p>
                                                    <p><strong>Observações:</strong> {d.notes || "-"}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete("deworming", d.id)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">Nenhum vermífugo registrado.</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setSelectedAnimal(null)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                                >
                                    Fechar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
