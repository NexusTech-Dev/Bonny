import { useState } from "react";
import { motion } from "framer-motion";
import { Syringe, ClipboardEdit } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HealthRegister() {
    const [healthType, setHealthType] = useState("");
    const navigate = useNavigate();

    const inputModern = (error?: boolean) =>
        `w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:outline-none transition placeholder-gray-400 text-gray-800 ` +
        (error
            ? "border-2 border-red-500 focus:ring-red-500 bg-red-50"
            : "bg-gray-100/70 focus:ring-blue-500");

    function handleAccess() {
        if (!healthType) return;

        if (healthType === "vacina") navigate("/vaccineRegister");
        if (healthType === "vermifugo") navigate("/vermifugo");
        if (healthType === "antiparasitario") navigate("/antiparasitario");
    }

    return (
        <div className="min-h-screen flex flex-col items-center px-4 py-10">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-10 flex items-center gap-2 text-center"
            >
                <Syringe className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
                Registro de Saúde
            </motion.h1>

            <motion.form
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-6 md:p-10 space-y-8"
            >
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações de Saúde</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Tipo de Registro</label>
                            <select
                                value={healthType}
                                onChange={(e) => setHealthType(e.target.value)}
                                className={inputModern()}
                            >
                                <option value="">Selecione</option>
                                <option value="vacina">Vacina</option>
                                <option value="vermifugo">Vermífugo</option>
                                <option value="antiparasitario">Antiparasitário</option>
                            </select>
                        </div>
                    </div>
                </section>

                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => navigate("/health-card")}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-1 sm:px-6 py-3 rounded-2xl bg-gray-600 text-white shadow hover:bg-gray-700 transition font-medium"
                    >
                        <ClipboardEdit className="w-5 h-5" />
                        Carteira de Saúde
                    </motion.button>

                    <motion.button
                        whileTap={healthType ? { scale: 0.95 } : {}}
                        type="button"
                        disabled={!healthType}
                        onClick={handleAccess}
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-2xl shadow-lg font-medium transition 
              ${
                            healthType
                                ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Acessar
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
}
