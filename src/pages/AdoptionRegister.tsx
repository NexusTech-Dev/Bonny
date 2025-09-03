// src/pages/AdoptionRegister.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint, UserCheck, Save } from "lucide-react";

export default function AdoptionRegister() {
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) setPreview(URL.createObjectURL(file));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center px-4 py-10">
            {/* Título */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-extrabold text-gray-800 mb-10 flex items-center gap-2"
            >
                <UserCheck className="w-8 h-8 text-green-600" /> Cadastro de Adoções
            </motion.h1>

            {/* Card de Formulário */}
            <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl p-10 space-y-8"
            >
                {/* Upload de Foto do Animal (opcional) */}
                <div className="flex flex-col items-center">
                    <label
                        className={`cursor-pointer flex flex-col items-center justify-center w-40 h-40 rounded-full 
              ${preview ? "border-none bg-gray-100" : "border-2 border-dashed border-green-400 bg-green-50 hover:bg-green-100"} 
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
                                <PawPrint className="w-8 h-8 text-green-500 mb-2" />
                                <span className="text-sm text-green-600 font-medium">Foto do Animal</span>
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
                            Clique para adicionar foto do animal (opcional)
                        </p>
                    )}
                </div>

                {/* Informações principais */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações da Adoção</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <select className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none">
                            <option value="">Animal</option>
                            <option value="animal1">Fido</option>
                            <option value="animal2">Mimi</option>
                            {/* Popular dinamicamente via backend */}
                        </select>
                        <input
                            type="text"
                            placeholder="Nome do adotante"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                        <input
                            type="date"
                            placeholder="Data da adoção"
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                        <select className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none">
                            <option value="">Status</option>
                            <option value="concluida">Concluída</option>
                            <option value="pendente">Pendente</option>
                        </select>
                    </div>
                </section>

                {/* Observações */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Observações</h2>
                    <textarea
                        rows="4"
                        placeholder="Escreva informações adicionais sobre a adoção..."
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                    ></textarea>
                </section>

                {/* Botão Salvar */}
                <div className="flex justify-end">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:from-green-600 hover:to-green-800 transition font-medium"
                    >
                        <Save className="w-5 h-5" /> Salvar
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
}
