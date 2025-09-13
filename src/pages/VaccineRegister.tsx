import {motion} from "framer-motion";
import {Syringe, Save} from "lucide-react";

export default function VaccineRegister() {
    const inputModern =
        "w-full px-4 py-3 rounded-xl bg-gray-100/70 shadow-sm " +
        "focus:ring-2 focus:ring-red-500 focus:outline-none " +
        "transition placeholder-gray-400 text-gray-800";

    return (
        <div className="min-h-screen flex flex-col items-center px-4 py-10">
            <motion.h1
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
                className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-10 flex items-center gap-2 text-center"
            >
                <Syringe className="w-7 h-7 md:w-8 md:h-8 text-red-600"/> Cadastro de Vacinas
            </motion.h1>

            <motion.form
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.6}}
                className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-6 md:p-10 space-y-8"
            >
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações da Vacina</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" placeholder="Nome da vacina" className={inputModern}/>
                        <input type="text" placeholder="Fabricante" className={inputModern}/>
                        <input type="date" placeholder="Data da aplicação" className={inputModern}/>
                        <input type="date" placeholder="Próximo reforço" className={inputModern}/>
                        <select className={inputModern}>
                            <option value="">Animal</option>
                            <option value="animal1">Fido</option>
                            <option value="animal2">Mimi</option>
                        </select>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Observações</h2>
                    <textarea
                        rows={4}
                        placeholder="Escreva informações adicionais sobre a vacina..."
                        className={`${inputModern} resize-none`}
                    />
                </section>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <motion.button
                        whileTap={{scale: 0.95}}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-600 text-white shadow hover:bg-gray-700 transition font-medium"
                        type="button"
                    >
                        Vincular
                    </motion.button>
                    <motion.button
                        whileTap={{scale: 0.95}}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:from-red-600 hover:to-red-800 transition font-medium"
                    >
                        <Save className="w-5 h-5"/> Salvar
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
}
