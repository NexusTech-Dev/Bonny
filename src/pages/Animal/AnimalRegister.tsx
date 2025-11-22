import React, {useState} from "react";
import {motion} from "framer-motion";
import {PawPrint, Save, Upload} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {registerAnimal} from "../../services/animalService.ts";
import toast from "react-hot-toast";
import Select from "react-select";
import { colors, dogBreeds, catBreeds } from "./animalOptions.ts"

export default function AnimalRegister() {
    const [preview, setPreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        birthDate: "",
        sex: "",
        color: "",
        species: "",
        breed: "",
        rescueDate: "",
        size: "",
        status: "",
        notes: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        setErrors({...errors, [name]: ""});
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setImageFile(file);
            setErrors({...errors, image: ""});
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== "notes" && !value) {
                newErrors[key] = "Campo obrigatório";
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
            await registerAnimal(formData, imageFile || undefined);
            setFormData({
                name: "",
                birthDate: "",
                sex: "",
                color: "",
                species: "",
                breed: "",
                rescueDate: "",
                size: "",
                status: "",
                notes: "",
            });
            setImageFile(null);
            setPreview(null);
            setErrors({});
            toast.success("Animal cadastrado com sucesso!");
        } catch (err) {
            console.error(err);
            toast.error("Erro ao cadastrar animal.");
        } finally {
            setLoading(false);
        }
    };

    const inputModern = (error?: boolean) =>
        `w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:outline-none transition placeholder-gray-400 text-gray-800 ` +
        (error ? "border-2 border-red-500 focus:ring-red-500 bg-red-50" : "bg-gray-100/70 focus:ring-blue-500");

    const selectStyles = (error?: boolean) => ({
        control: (base: any) => ({
            ...base,
            borderRadius: "0.75rem",
            padding: "2px 4px",
            backgroundColor: "#f3f4f6",
            borderColor: error ? "#ef4444" : "#d1d5db",
            boxShadow: "none",
            "&:hover": {borderColor: "#3b82f6"},
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
        placeholder: (base: any) => ({...base, color: "#9ca3af"}),
        singleValue: (base: any) => ({...base, color: "#1f2937"}),
    });

    const errorStyle = "text-sm text-red-500 mt-1";

    const breedOptions = formData.species === "cachorro" ? dogBreeds : formData.species === "gato" ? catBreeds : [];

    return (
        <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-10">
            <motion.h1
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
                className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-10 flex items-center gap-2 text-center"
            >
                <PawPrint className="w-7 h-7 md:w-8 md:h-8 text-blue-600"/> Cadastro de Animais
            </motion.h1>

            <motion.form
                onSubmit={handleSubmit}
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.6}}
                className="bg-white w-full max-w-5xl rounded-3xl shadow-xl p-6 md:p-10 space-y-8 overflow-visible"
            >
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações do Animal</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Nome</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                   className={inputModern(!!errors.name)}/>
                            {errors.name && <span className={errorStyle}>{errors.name}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Data de Nascimento</label>
                            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange}
                                   className={inputModern(!!errors.birthDate)}/>
                            {errors.birthDate && <span className={errorStyle}>{errors.birthDate}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Sexo</label>
                            <div className="flex flex-wrap gap-4 items-center mt-1">
                                <label className="flex items-center gap-2 text-gray-700">
                                    <input
                                        type="radio"
                                        name="sex"
                                        value="M"
                                        checked={formData.sex === "M"}
                                        onChange={handleChange}
                                        className="accent-blue-600"
                                    /> Macho
                                </label>
                                <label className="flex items-center gap-2 text-gray-700">
                                    <input
                                        type="radio"
                                        name="sex"
                                        value="F"
                                        checked={formData.sex === "F"}
                                        onChange={handleChange}
                                        className="accent-blue-600"
                                    /> Fêmea
                                </label>
                            </div>
                            {errors.sex && <span className={errorStyle}>{errors.sex}</span>}
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Características</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col mb-10 text-md">
                            <label className="mb-1 font-medium text-gray-700">Cor</label>
                            <Select
                                options={colors.map((color) => ({label: color, value: color}))}
                                value={colors.find(c => c === formData.color) ? {
                                    label: formData.color,
                                    value: formData.color
                                } : null}
                                onChange={(option) => setFormData({...formData, color: option?.value || ""})}
                                placeholder="Cor"
                                styles={selectStyles(!!errors.color)}
                            />
                            {errors.color && <span className={errorStyle}>{errors.color}</span>}
                        </div>

                        <div className="flex flex-col mb-10">
                            <label className="mb-1 font-medium text-gray-700">Espécie</label>
                            <Select
                                options={[
                                    {label: "Cachorro", value: "cachorro"},
                                    {label: "Gato", value: "gato"},
                                ]}
                                value={
                                    formData.species
                                        ? {
                                            label: formData.species[0].toUpperCase() + formData.species.slice(1),
                                            value: formData.species
                                        }
                                        : null
                                }
                                onChange={(option) => {
                                    setFormData({...formData, species: option?.value || "", breed: ""});
                                }}
                                placeholder="Espécie"
                                styles={selectStyles(!!errors.species)}
                            />
                            {errors.species && <span className={errorStyle}>{errors.species}</span>}
                        </div>

                        <div className="flex flex-col mb-10">
                            <label className="mb-1 font-medium text-gray-700">
                                Raça
                                {!formData.species && (
                                    <span className="text-red-500 text-sm ml-1">
                * selecione a espécie primeiro
            </span>
                                )}
                            </label>
                            <Select
                                options={breedOptions.map((breed) => ({label: breed, value: breed}))}
                                value={
                                    breedOptions.includes(formData.breed)
                                        ? {label: formData.breed, value: formData.breed}
                                        : null
                                }
                                onChange={(option) => setFormData({...formData, breed: option?.value || ""})}
                                placeholder={formData.species ? "Raça" : "Selecione Espécie"}
                                isDisabled={!formData.species}
                                styles={selectStyles(!!errors.breed)}
                                noOptionsMessage={() =>
                                    formData.species === ""
                                        ? "Selecione uma espécie primeiro"
                                        : "Nenhuma raça encontrada"
                                }
                            />
                            {errors.breed && <span className={errorStyle}>{errors.breed}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Data de Resgate</label>
                            <input type="date" name="rescueDate" value={formData.rescueDate} onChange={handleChange}
                                   className={inputModern(!!errors.rescueDate)}/>
                            {errors.rescueDate && <span className={errorStyle}>{errors.rescueDate}</span>}
                        </div>

                        <div className="flex flex-col mb-10">
                            <label className="mb-1 font-medium text-gray-700">Porte</label>
                            <Select
                                options={[
                                    {label: "Pequeno", value: "pequeno"},
                                    {label: "Médio", value: "medio"},
                                    {label: "Grande", value: "grande"},
                                ]}
                                value={
                                    formData.size
                                        ? {
                                            label: formData.size[0].toUpperCase() + formData.size.slice(1),
                                            value: formData.size
                                        }
                                        : null
                                }
                                onChange={(option) => setFormData({...formData, size: option?.value || ""})}
                                placeholder="Porte"
                                styles={selectStyles(!!errors.size)}
                            />
                            {errors.size && <span className={errorStyle}>{errors.size}</span>}
                        </div>

                        <div className="flex flex-col mb-10">
                            <label className="mb-1 font-medium text-gray-700">Status</label>
                            <Select
                                options={[
                                    {label: "Disponível", value: "Disponível"},
                                    {label: "Adotado", value: "Adotado"},
                                    {label: "Em tratamento", value: "Em tratamento"},
                                    {label: "Falecido", value: "Falecido"},
                                ]}
                                value={formData.status ? {label: formData.status, value: formData.status} : null}
                                onChange={(option) => setFormData({...formData, status: option?.value || ""})}
                                placeholder="Status"
                                styles={selectStyles(!!errors.status)}
                            />
                            {errors.status && <span className={errorStyle}>{errors.status}</span>}
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
                        />
                        {errors.notes && <span className={errorStyle}>{errors.notes}</span>}
                    </div>
                </section>

                <div className="flex flex-col items-center">
                    <label
                        className={`cursor-pointer flex flex-col items-center justify-center w-40 sm:w-48 h-32 sm:h-36 rounded-2xl
                        ${preview ? "border-0" : "border-2 border-dashed border-blue-400"}
                        bg-blue-50 hover:bg-blue-100 transition relative overflow-hidden`}
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-2xl"/>
                        ) : (
                            <div className="flex flex-col items-center">
                                <Upload className="w-7 h-7 text-blue-500 mb-2"/>
                                <span className="text-xs sm:text-sm text-blue-600 font-medium">Adicionar imagem</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange}/>
                    </label>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <motion.button
                        whileTap={{scale: 0.95}}
                        type="button"
                        onClick={() => navigate("/animalList")}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-600 text-white shadow hover:bg-gray-700 transition font-medium"
                    >
                        Cadastrados
                    </motion.button>

                    <motion.button
                        whileTap={{scale: 0.95}}
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition font-medium"
                    >
                        {loading ? (
                            <span className="animate-pulse">Salvando...</span>
                        ) : (
                            <>
                                <Save className="w-5 h-5"/> Cadastrar
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
}
