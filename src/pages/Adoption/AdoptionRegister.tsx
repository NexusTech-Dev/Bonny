import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeartHandshake, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerAdoption } from "../../services/adoptionService.ts";
import { getAdopters } from "../../services/adopterService.ts";
import { getStaff } from "../../services/staffService.ts";
import Select from "react-select";
import { useAnimals } from "../../context/AnimalsContext";

export default function AdoptionRegister() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { animals, updateAnimalStatus } = useAnimals();

    const [formData, setFormData] = useState({
        adopterId: "",
        animalId: "",
        employeeId: "",
        status: "",
        notes: "",
        adoptionDate: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [adopters, setAdopters] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);

    const [selectedAdopter, setSelectedAdopter] = useState<{ value: string; label: string } | null>(null);
    const [selectedAnimal, setSelectedAnimal] = useState<{ value: string; label: string } | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<{ value: string; label: string } | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<{ value: string; label: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [adoptersData, employeesData] = await Promise.all([
                    getAdopters(),
                    getStaff(),
                ]);
                setAdopters(adoptersData);
                setEmployees(employeesData);
            } catch (error) {
                console.error(error);
                toast.error("Erro ao carregar dados.");
            }
        };
        fetchData();
    }, []);

    const availableAnimals = animals.filter(a => a.status === "Disponível");
    const animalOptions = availableAnimals.map(a => ({ value: a.id, label: a.name }));
    const adopterOptions = adopters.map(a => ({ value: a.id, label: `${a.name} — ${a.cpf}` }));
    const employeeOptions = employees.map(e => ({ value: e.id, label: e.name }));
    const statusOptions = [
        { value: "Em andamento", label: "Em andamento" },
        { value: "Adotado", label: "Adotado" },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        const requiredFields = ["adopterId", "animalId", "employeeId", "status", "adoptionDate"];
        requiredFields.forEach((field) => {
            if (!formData[field as keyof typeof formData]) {
                newErrors[field] = "Campo obrigatório";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await registerAdoption(formData);

            if (formData.animalId && formData.status) {
                await updateAnimalStatus(formData.animalId, formData.status as "Adotado" | "Em andamento");
            }

            toast.success("Adoção registrada com sucesso!");
            setFormData({ adopterId: "", animalId: "", employeeId: "", status: "", notes: "", adoptionDate: "" });
            setSelectedAdopter(null);
            setSelectedAnimal(null);
            setSelectedEmployee(null);
            setSelectedStatus(null);
            setErrors({});
        } catch (error) {
            console.error(error);
            toast.error("Erro ao registrar adoção.");
        } finally {
            setLoading(false);
        }
    };

    const inputModern = (error?: boolean) =>
        `w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:outline-none transition placeholder-gray-400 text-gray-800 ` +
        (error ? "border-2 border-red-500 focus:ring-red-500 bg-red-50" : "bg-gray-100/70 focus:ring-blue-500");

    const errorStyle = "text-sm text-red-500 mt-1";

    const selectStyles = (error?: boolean) => ({
        control: (base: any) => ({
            ...base,
            borderRadius: "0.75rem",
            padding: "2px 4px",
            backgroundColor: "#f3f4f6",
            borderColor: error ? "#ef4444" : "#d1d5db",
            boxShadow: "none",
            "&:hover": { borderColor: "#3b82f6" },
        }),
        menu: (base: any) => ({
            ...base,
            borderRadius: "0.75rem",
            zIndex: 10,
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#e0f2fe" : "#ffffff",
            color: state.isSelected ? "#ffffff" : "#111827",
            cursor: "pointer",
            transition: "background-color 0.15s ease",
        }),
        placeholder: (base: any) => ({ ...base, color: "#9ca3af" }),
        singleValue: (base: any) => ({ ...base, color: "#1f2937" }),
    });

    return (
        <div className="min-h-screen flex flex-col items-center px-4 py-10">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-10 flex items-center gap-2 text-center"
            >
                <HeartHandshake className="w-7 h-7 md:w-8 md:h-8 text-blue-600"/> Registro de Adoções
            </motion.h1>

            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-6 md:p-10 space-y-8"
            >
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações da Adoção</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Adotante</label>
                            <Select
                                options={adopterOptions}
                                value={selectedAdopter}
                                onChange={(option) => {
                                    setSelectedAdopter(option);
                                    setFormData({ ...formData, adopterId: option?.value || "" });
                                    setErrors({ ...errors, adopterId: "" });
                                }}
                                noOptionsMessage={() => "Nenhum adotante encontrado"}
                                placeholder="Adotante"
                                styles={selectStyles(!!errors.adopterId)}
                            />
                            {errors.adopterId && <span className={errorStyle}>{errors.adopterId}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Animal</label>
                            <Select
                                options={animalOptions}
                                value={selectedAnimal}
                                onChange={(option) => {
                                    setSelectedAnimal(option);
                                    setFormData({ ...formData, animalId: option?.value || "" });
                                    setErrors({ ...errors, animalId: "" });
                                }}
                                noOptionsMessage={() => "Nenhum animal disponível"}
                                placeholder="Animal"
                                styles={selectStyles(!!errors.animalId)}
                            />
                            {errors.animalId && <span className={errorStyle}>{errors.animalId}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Funcionário Responsável</label>
                            <Select
                                options={employeeOptions}
                                value={selectedEmployee}
                                onChange={(option) => {
                                    setSelectedEmployee(option);
                                    setFormData({ ...formData, employeeId: option?.value || "" });
                                    setErrors({ ...errors, employeeId: "" });
                                }}
                                noOptionsMessage={() => "Nenhum funcionário encontrado"}
                                placeholder="Funcionário"
                                styles={selectStyles(!!errors.employeeId)}
                            />
                            {errors.employeeId && <span className={errorStyle}>{errors.employeeId}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Status</label>
                            <Select
                                options={statusOptions}
                                value={selectedStatus}
                                onChange={(option) => {
                                    setSelectedStatus(option);
                                    setFormData({ ...formData, status: option?.value || "" });
                                    setErrors({ ...errors, status: "" });
                                }}
                                noOptionsMessage={() => "Nenhum status disponível"}
                                placeholder="Status"
                                styles={selectStyles(!!errors.status)}
                            />
                            {errors.status && <span className={errorStyle}>{errors.status}</span>}
                        </div>

                        <div className="flex flex-col sm:col-span-2 lg:col-span-1">
                            <label className="mb-1 font-medium text-gray-700">Data da Adoção</label>
                            <input
                                type="date"
                                name="adoptionDate"
                                value={formData.adoptionDate}
                                onChange={handleChange}
                                className={inputModern(!!errors.adoptionDate)}
                            />
                            {errors.adoptionDate && <span className={errorStyle}>{errors.adoptionDate}</span>}
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold text-gray-700 mb-2">Observações</label>
                        <textarea
                            rows={4}
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className={inputModern(!!errors.notes) + " resize-none"}
                            placeholder="Adicionar observações (opcional)"
                        />
                    </div>
                </section>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => navigate("/adoptionList")}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-600 text-white shadow hover:bg-gray-700 transition font-medium"
                    >
                        Cadastradas
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition font-medium"
                    >
                        {loading ? "Salvando..." : (
                            <>
                                <Save className="w-5 h-5" /> Registrar
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
}
