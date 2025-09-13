import {useState} from "react";
import {motion} from "framer-motion";
import {PawPrint, Save, Upload} from "lucide-react";

export default function AnimalRegister() {
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setPreview(URL.createObjectURL(file));
    };

    const inputModern =
        "w-full px-4 py-3 rounded-xl bg-gray-100/70 shadow-sm " +
        "focus:ring-2 focus:ring-blue-500 focus:outline-none " +
        "transition placeholder-gray-400 text-gray-800";

    return (
        <div className="min-h-screen flex flex-col items-center px-4 py-10">
            <motion.h1
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
                className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-10 flex items-center gap-2 text-center"
            >
                <PawPrint className="w-7 h-7 md:w-8 md:h-8 text-blue-600"/> Cadastro de Animais
            </motion.h1>

            <motion.form
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.6}}
                className="bg-white w-full max-w-5xl rounded-3xl shadow-xl p-6 md:p-10 space-y-8"
            >
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações do Animal</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <input type="text" placeholder="Nome" className={inputModern}/>
                        <input type="date" placeholder="Data nascimento" className={inputModern}/>
                        <div className="flex flex-wrap gap-4 items-center">
                            <label className="flex items-center gap-2 text-gray-700">
                                <input type="radio" name="sexo" value="M" className="accent-blue-600"/> Masculino
                            </label>
                            <label className="flex items-center gap-2 text-gray-700">
                                <input type="radio" name="sexo" value="F" className="accent-blue-600"/> Feminino
                            </label>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Características</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <input type="text" placeholder="Cor" className={inputModern}/>
                        <select className={inputModern}>
                            <option value="">Espécie</option>
                            <option value="cachorro">Cachorro</option>
                            <option value="gato">Gato</option>
                        </select>
                        <select className={inputModern}>
                            <option value="">Raça</option>
                            <option value="pastorAlemao">Pastor-Alemão</option>
                            <option value="buldogue">Buldogue</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        <input type="date" placeholder="Data resgate" className={inputModern}/>
                        <select className={inputModern}>
                            <option value="">Porte</option>
                            <option value="pequeno">Pequeno</option>
                            <option value="medio">Médio</option>
                            <option value="grande">Grande</option>
                        </select>
                        <select className={inputModern}>
                            <option value="">Status</option>
                            <option value="disponivel">Disponível</option>
                            <option value="adotado">Adotado</option>
                            <option value="tratamento">Em Tratamento</option>
                        </select>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Observações</h2>
                    <textarea
                        rows={4}
                        placeholder="Escreva detalhes adicionais..."
                        className={`${inputModern} resize-none`}
                    />
                </section>

                <div>
                    <div className="flex justify-center">
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
                                    <span
                                        className="text-xs sm:text-sm text-blue-600 font-medium">Adicionar imagem</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange}/>
                        </label>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <motion.button
                        whileTap={{scale: 0.95}}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-600 text-white shadow hover:bg-gray-700 transition font-medium"
                        type="button"
                    >
                        Cadastrados
                    </motion.button>
                    <motion.button
                        whileTap={{scale: 0.95}}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:from-blue-600 hover:to-blue-800 transition font-medium"
                    >
                        <Save className="w-5 h-5"/> Cadastrar
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
}
