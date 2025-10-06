import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { updateAdoption } from "../../services/adoptionService";
import { getAdopters } from "../../services/adopterService";
import { getStaff } from "../../services/staffService";
import type { AdoptionWithNames } from "../../pages/Adoption/AdoptionList";

type Props = {
    adoption: AdoptionWithNames;
    animals: { id: string; name: string }[];
    onCancel: () => void;
    onSave: (updated: AdoptionWithNames & { animalStatus: string }) => void;
};

export default function EditAdoptionForm({ adoption, animals, onCancel, onSave }: Props) {
    const [formData, setFormData] = useState({
        adopterId: adoption.adopterId,
        animalId: adoption.animalId,
        employeeId: adoption.employeeId,
        status: adoption.status,
        notes: adoption.notes || "",
        adoptionDate: adoption.adoptionDate || "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [adopters, setAdopters] = useState<{ id: string; name: string }[]>([]);
    const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allAdopters, allStaff] = await Promise.all([getAdopters(), getStaff()]);
                setAdopters(allAdopters);
                setEmployees(allStaff);
            } catch {
                toast.error("Erro ao carregar dados.");
            }
        };
        fetchData();
    }, []);

    const adopterOptions = adopters.map(a => ({ value: a.id, label: a.name }));
    const employeeOptions = employees.map(e => ({ value: e.id, label: e.name }));
    const animalOptions = animals.map(a => ({ value: a.id, label: a.name }));
    const statusOptions = [
        { value: "Em andamento", label: "Em andamento" },
        { value: "Adotado", label: "Adotado" },
    ];

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
        menu: (base: any) => ({ ...base, borderRadius: "0.75rem", zIndex: 10, backgroundColor: "#fff" }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#e0f2fe" : "#fff",
            color: state.isSelected ? "#fff" : "#111827",
            cursor: "pointer",
            transition: "background-color 0.15s ease",
        }),
        placeholder: (base: any) => ({ ...base, color: "#9ca3af" }),
        singleValue: (base: any) => ({ ...base, color: "#1f2937" }),
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        ["adopterId", "animalId", "employeeId", "status", "adoptionDate"].forEach(field => {
            if (!formData[field as keyof typeof formData]) newErrors[field] = "Campo obrigatório";
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            // Atualiza apenas a adoção
            await updateAdoption(adoption.id, formData);

            onSave({
                id: adoption.id,
                adopterId: formData.adopterId,
                employeeId: formData.employeeId,
                animalId: formData.animalId,
                status: formData.status as "Adotado" | "Em andamento",
                notes: formData.notes,
                adopterName: adopters.find(a => a.id === formData.adopterId)?.name || adoption.adopterName,
                employeeName: employees.find(e => e.id === formData.employeeId)?.name || adoption.employeeName,
                animalName: animals.find(a => a.id === formData.animalId)?.name || adoption.animalName,
                adoptionDate: formData.adoptionDate,
                animalStatus: formData.status === "Adotado" ? "Adotado" : "Disponível", // usado apenas para exibir na tela
            });
        } catch (err) {
            console.error(err);
            toast.error("Erro ao atualizar adoção.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1">Adotante</label>
                    <Select
                        options={adopterOptions}
                        value={adopterOptions.find(o => o.value === formData.adopterId) || null}
                        onChange={option => setFormData(prev => ({ ...prev, adopterId: option?.value || "" }))}
                        styles={selectStyles(!!errors.adopterId)}
                        placeholder="Adotante"
                    />
                    {errors.adopterId && <span className="text-red-500 text-sm">{errors.adopterId}</span>}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1">Animal</label>
                    <Select
                        options={animalOptions}
                        value={animalOptions.find(o => o.value === formData.animalId) || null}
                        onChange={option => setFormData(prev => ({ ...prev, animalId: option?.value || "" }))}
                        styles={selectStyles(!!errors.animalId)}
                        placeholder="Animal"
                    />
                    {errors.animalId && <span className="text-red-500 text-sm">{errors.animalId}</span>}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1">Funcionário</label>
                    <Select
                        options={employeeOptions}
                        value={employeeOptions.find(o => o.value === formData.employeeId) || null}
                        onChange={option => setFormData(prev => ({ ...prev, employeeId: option?.value || "" }))}
                        styles={selectStyles(!!errors.employeeId)}
                        placeholder="Funcionário"
                    />
                    {errors.employeeId && <span className="text-red-500 text-sm">{errors.employeeId}</span>}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
                    <Select
                        options={statusOptions}
                        value={statusOptions.find(o => o.value === formData.status) || null}
                        onChange={option =>
                            setFormData(prev => ({
                                ...prev,
                                status: (option?.value as "Adotado" | "Em andamento") || "Em andamento"
                            }))
                        }
                        styles={selectStyles(!!errors.status)}
                        placeholder="Status"
                    />
                    {errors.status && <span className="text-red-500 text-sm">{errors.status}</span>}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1">Data da Adoção</label>
                    <input
                        type="date"
                        name="adoptionDate"
                        value={formData.adoptionDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.adoptionDate && <span className="text-red-500 text-sm">{errors.adoptionDate}</span>}
                </div>

                <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700 mb-1">Observações</label>
                    <textarea
                        rows={3}
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    {loading ? "Salvando..." : "Salvar"}
                </button>
            </div>
        </form>
    );
}
