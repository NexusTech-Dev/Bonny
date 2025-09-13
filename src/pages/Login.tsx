import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";

export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
            >
                <div className="flex items-center justify-center gap-2 mb-6">
                    <PawPrint className="w-8 h-8 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-800">PetControl - Sistema Interno</h1>
                </div>

                <form className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">E-mail</label>
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            placeholder="********"
                            className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-blue-600 text-white py-2 rounded-xl mt-4 shadow hover:bg-blue-700 transition"
                    >
                        Entrar
                    </motion.button>
                </form>

                <p className="text-sm text-gray-500 text-center mt-6">
                    Sistema exclusivo para funcionários da ONG
                </p>
            </motion.div>
        </div>
    );
}
