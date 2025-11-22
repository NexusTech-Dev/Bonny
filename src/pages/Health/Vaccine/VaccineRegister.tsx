import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {Syringe, Save} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Select from "react-select";
import { useAnimals } from "../../../context/AnimalsContext.tsx";
import { getStaff } from "../../../services/staffService";
import { registerVaccine } from "../../../services/vaccineService.ts";
import {FiArrowLeft} from "react-icons/fi";
import {Link} from "react-router-dom";

export default function VaccineRegister() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { animals } = useAnimals();

    const [formData, setFormData] = useState({
        vaccineId: [] as string[],
        animalId: "",
        employeeId: "",
        applicationDate: "",
        nextDoseDate: "",
        notes: "",
        booster1: "",
        booster2: "",
        booster3:"",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [employees, setEmployees] = useState<any[]>([]);
    const [selectedVaccine, setSelectedVaccine] = useState<any[]>([]);
    const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

    const vaccineOptions = [
        {
            label: "Cães",
            options: [
                { value: "vacina_antirrabica", label: "Antirrábica" },
                { value: "vacina_v8", label: "V8" },
                { value: "vacina_v10", label: "V10" },
                { value: "vacina_gripe_canina", label: "Gripe Canina" },
                { value: "vacina_giardia", label: "Giárdia" },
            ],
        },
        {
            label: "Gatos",
            options: [
                { value: "vacina_antirabica_gato", label: "Antirrábica" },
                { value: "vacina_v3", label: "V3" },
                { value: "vacina_v4", label: "V4" },
                { value: "vacina_v5", label: "V5" },
            ],
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const staffData = await getStaff();
                setEmployees(staffData);
            } catch (error) {
                console.error(error);
                toast.error("Erro ao carregar dados.");
            }
        };
        fetchData();
    }, []);

    const animalOptions = animals.map((a: { id: any; name: any; }) => ({ value: a.id, label: a.name }));
    const employeeOptions = employees.map(e => ({ value: e.id, label: e.name }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        const requiredFields = ["vaccineId", "animalId", "employeeId", "applicationDate"];
        requiredFields.forEach((field) => {
            if (!formData[field as keyof typeof formData] ||
                (Array.isArray(formData[field as keyof typeof formData]) && formData[field as keyof typeof formData].length === 0)) {
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
            await registerVaccine(formData);
            toast.success("Vacinação registrada com sucesso!");

            setFormData({
                vaccineId: [],
                animalId: "",
                employeeId: "",
                applicationDate: "",
                nextDoseDate: "",
                notes: "",
                booster1: "",
                booster2: "",
                booster3: "",
            });
            setSelectedVaccine([]);
            setSelectedAnimal(null);
            setSelectedEmployee(null);
            setErrors({});
        } catch (error) {
            console.error(error);
            toast.error("Erro ao registrar vacinação.");
        } finally {
            setLoading(false);
        }
    };

    const inputModern = (error?: boolean) =>
        `w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:outline-none transition placeholder-gray-400 text-gray-800 ${
            error ? "border-2 border-red-500 focus:ring-red-500 bg-red-50" : "bg-gray-100/70 focus:ring-blue-500"
        }`;

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
            minHeight: "50px",
        }),
        valueContainer: (base: any) => ({
            ...base,
            maxHeight: "80px",
            overflowY: "auto",
        }),
        multiValue: (base: any) => ({
            ...base,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        }),
        multiValueLabel: (base: any) => ({
            ...base,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        }),
        menu: (base: any) => ({
            ...base,
            borderRadius: "0.75rem",
            zIndex: 20,
        }),
    });



    return (
        <div className="min-h-screen flex flex-col items-center px-4 py-10">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-10 flex items-center gap-2"
            >
                <Syringe className="w-7 h-7 text-blue-600"/> Registro de Vacinação
            </motion.h1>

            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-6 md:p-10 space-y-8"
            >
                <section>
                    <Link
                        to="/health"
                        className="inline-flex items-center gap-2 text-bold hover:text-blue-500 transition mb-6"
                    >
                        <FiArrowLeft /> Voltar
                    </Link>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações da Vacina</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Vacina</label>
                            <Select
                                options={vaccineOptions}
                                value={selectedVaccine}
                                onChange={(options) => {
                                    const selected = options as any[];
                                    setSelectedVaccine(selected);
                                    setFormData({ ...formData, vaccineId: selected.map(o => o.value) });
                                    if (selected.length > 0) {
                                        setErrors({ ...errors, vaccineId: "" });
                                    }
                                }}
                                placeholder="Selecione"
                                isMulti
                                styles={selectStyles(!!errors.vaccineId)}
                                closeMenuOnSelect={false}
                            />
                            {errors.vaccineId && <span className={errorStyle}>{errors.vaccineId}</span>}
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
                                placeholder="Selecione"
                                styles={selectStyles(!!errors.animalId)}
                            />
                            {errors.animalId && <span className={errorStyle}>{errors.animalId}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Funcionário Aplicador</label>
                            <Select
                                options={employeeOptions}
                                value={selectedEmployee}
                                onChange={(option) => {
                                    setSelectedEmployee(option);
                                    setFormData({ ...formData, employeeId: option?.value || "" });
                                    setErrors({ ...errors, employeeId: "" });
                                }}
                                placeholder="Selecione"
                                styles={selectStyles(!!errors.employeeId)}
                            />
                            {errors.employeeId && <span className={errorStyle}>{errors.employeeId}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Data de Aplicação</label>
                            <input
                                type="date"
                                name="applicationDate"
                                value={formData.applicationDate}
                                onChange={handleChange}
                                className={inputModern(!!errors.applicationDate)}
                            />
                            {errors.applicationDate && <span className={errorStyle}>{errors.applicationDate}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">1º Reforço</label>
                            <input
                                type="date"
                                name="booster1"
                                value={formData.booster1}
                                onChange={handleChange}
                                className={inputModern()}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">2º Reforço</label>
                            <input
                                type="date"
                                name="booster2"
                                value={formData.booster2}
                                onChange={handleChange}
                                className={inputModern()}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">3º Reforço</label>
                            <input
                                type="date"
                                name="booster3"
                                value={formData.booster3}
                                onChange={handleChange}
                                className={inputModern()}
                            />
                        </div>

                    </div>
                </section>

                <section>
                    <label className="text-lg font-semibold text-gray-700 mb-2">Observações</label>
                    <textarea
                        rows={4}
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className={inputModern() + " resize-none"}
                        placeholder="Alguma observação? (opcional)"
                    />
                </section>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => navigate("/HealthCardList")}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-600 text-white shadow hover:bg-gray-700 transition font-medium"
                    >
                        Carteiras de Saúde
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition font-medium ${
                            loading ? "cursor-not-allowed opacity-50" : ""
                        }`}
                    >
                        {loading ? "Salvando..." : (<><Save className="w-5 h-5" /> Salvar</>)}
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
}
