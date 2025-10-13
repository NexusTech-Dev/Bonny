import React, { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint, Save, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerAnimal } from "../../services/animalService.ts";
import toast from "react-hot-toast";

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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setImageFile(file);
            setErrors({ ...errors, image: "" });
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
        (error
            ? "border-2 border-red-500 focus:ring-red-500 bg-red-50"
            : "bg-gray-100/70 focus:ring-blue-500");

    const errorStyle = "text-sm text-red-500 mt-1";

    return (
        <div className="min-h-screen flex flex-col items-center px-4 py-10">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-10 flex items-center gap-2 text-center"
            >
                <PawPrint className="w-7 h-7 md:w-8 md:h-8 text-blue-600" /> Cadastro de Animais
            </motion.h1>

            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white w-full max-w-5xl rounded-3xl shadow-xl p-6 md:p-10 space-y-8"
            >
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações do Animal</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Nome</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputModern(!!errors.name)} />
                            {errors.name && <span className={errorStyle}>{errors.name}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Data de Nascimento</label>
                            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className={inputModern(!!errors.birthDate)} />
                            {errors.birthDate && <span className={errorStyle}>{errors.birthDate}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Sexo</label>
                            <div className="flex flex-wrap gap-4 items-center mt-1">
                                <label className="flex items-center gap-2 text-gray-700">
                                    <input type="radio" name="sex" value="M" onChange={handleChange} className="accent-blue-600" /> Macho
                                </label>
                                <label className="flex items-center gap-2 text-gray-700">
                                    <input type="radio" name="sex" value="F" onChange={handleChange} className="accent-blue-600" /> Fêmea
                                </label>
                            </div>
                            {errors.sex && <span className={errorStyle}>{errors.sex}</span>}
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Características</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Cor</label>
                            <input type="text" name="color" value={formData.color} onChange={handleChange} className={inputModern(!!errors.color)} />
                            {errors.color && <span className={errorStyle}>{errors.color}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Espécie</label>
                            <select name="species" value={formData.species} onChange={handleChange} className={inputModern(!!errors.species)}>
                                <option value="">Selecione a espécie</option>
                                <option value="cachorro">Cachorro</option>
                                <option value="gato">Gato</option>
                            </select>
                            {errors.species && <span className={errorStyle}>{errors.species}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Raça</label>
                            <input type="text" name="breed" value={formData.breed} onChange={handleChange} className={inputModern(!!errors.breed)} />
                            {errors.breed && <span className={errorStyle}>{errors.breed}</span>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Data de Resgate</label>
                            <input type="date" name="rescueDate" value={formData.rescueDate} onChange={handleChange} className={inputModern(!!errors.rescueDate)} />
                            {errors.rescueDate && <span className={errorStyle}>{errors.rescueDate}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Porte</label>
                            <select name="size" value={formData.size} onChange={handleChange} className={inputModern(!!errors.size)}>
                                <option value="">Selecione o porte</option>
                                <option value="pequeno">Pequeno</option>
                                <option value="medio">Médio</option>
                                <option value="grande">Grande</option>
                            </select>
                            {errors.size && <span className={errorStyle}>{errors.size}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className={inputModern(!!errors.status)}>
                                <option value="">Selecione o status</option>
                                <option value="Disponível">Disponível</option>
                                <option value="Adotado">Adotado</option>
                                <option value="Em tratamento">Em tratamento</option>
                                <option value="Falecido">Falecido</option>
                            </select>
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
                            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                            <div className="flex flex-col items-center">
                                <Upload className="w-7 h-7 text-blue-500 mb-2" />
                                <span className="text-xs sm:text-sm text-blue-600 font-medium">Adicionar imagem</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => navigate("/animalList")}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-600 text-white shadow hover:bg-gray-700 transition font-medium"
                    >
                        Cadastrados
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition font-medium"
                    >
                        {loading ? "Salvando..." : <><Save className="w-5 h-5" /> Cadastrar</>}
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
}
