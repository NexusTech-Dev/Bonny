import { useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { UserPlus, Save } from "lucide-react";

export default function StaffRegister() {
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setPreview(URL.createObjectURL(file));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center px-4 py-10">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-extrabold text-gray-800 mb-10 flex items-center gap-2"
            >
                <UserPlus className="w-8 h-8 text-green-600" /> Cadastro de Funcionários
            </motion.h1>

            <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl p-10 space-y-8"
            >
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
                                <UserPlus className="w-8 h-8 text-green-500 mb-2" />
                                <span className="text-sm text-green-600 font-medium">Foto</span>
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
                            Clique para adicionar foto do funcionário
                        </p>
                    )}
                </div>

                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações Pessoais</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" placeholder="Nome completo" className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" />
                        <input type="text" placeholder="Cargo" className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" />
                        <input type="email" placeholder="E-mail" className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" />
                        <input type="tel" placeholder="Telefone" className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" />
                        <input type="date" placeholder="Data de Admissão" className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" />
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Observações</h2>
                    <textarea rows={4} placeholder="Escreva informações adicionais sobre o funcionário..." className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none resize-none"></textarea>
                </section>

                <div className="flex justify-end">
                    <motion.button whileTap={{ scale: 0.95 }} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:from-green-600 hover:to-green-800 transition font-medium">
                        <Save className="w-5 h-5" /> Salvar
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
}
