// src/pages/AnimalRegister.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint, Save, Upload } from "lucide-react";

export default function AnimalRegister() {
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setPreview(URL.createObjectURL(file));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br  flex flex-col items-center px-4 py-10">
            {/* Título */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-extrabold text-gray-800 mb-10 flex items-center gap-2"
            >
                <PawPrint className="w-8 h-8 text-blue-600" /> Cadastro de Animais
            </motion.h1>

            {/* Card de Formulário */}
            <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl p-10 space-y-8"
            >
                {/* Upload de Imagem */}
                <div className="flex flex-col items-center">
                    <label
                        className={`cursor-pointer flex flex-col items-center justify-center w-40 h-40 rounded-full 
    ${preview ? "border-none bg-gray-100" : "border-2 border-dashed border-blue-400 bg-blue-50 hover:bg-blue-100"} 
    transition`}
                    >
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-40 h-40 object-cover rounded-full"
                            />
                        ) : (
                            <div className="flex flex-col items-center">
                                <Upload className="w-8 h-8 text-blue-500 mb-2" />
                                <span className="text-sm text-blue-600 font-medium">Foto</span>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </label>
                    {!preview && (
                        <p className="text-xs text-gray-500 mt-2">
                            Clique para adicionar foto do animal
                        </p>
                    )}
                </div>

                {/* Informações principais */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações do Animal</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input
                            type="text"
                            placeholder="Nome do animal"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <select className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="">Espécie</option>
                            <option value="cachorro">Cachorro</option>
                            <option value="gato">Gato</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Raça"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                            type="number"
                            placeholder="Idade (anos)"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </section>

                {/* Status & Saúde */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Status & Saúde</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <select className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none">
                            <option value="">Status de Adoção</option>
                            <option value="disponivel">Disponível</option>
                            <option value="adotado">Adotado</option>
                            <option value="em_tratamento">Em Tratamento</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Vacinas aplicadas"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </section>

                {/* Observações */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Observações</h2>
                    <textarea
                        rows="4"
                        placeholder="Escreva detalhes adicionais sobre o animal..."
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    ></textarea>
                </section>

                {/* Botão */}
                <div className="flex justify-end">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition font-medium"
                    >
                        <Save className="w-5 h-5" /> Salvar
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
}
