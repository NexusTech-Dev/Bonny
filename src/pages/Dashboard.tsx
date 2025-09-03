// src/pages/Dashboard.tsx
import { motion } from "framer-motion";
import { PawPrint, User, FileText } from "lucide-react";

export default function Dashboard() {
    // Dados fictícios (no futuro você pode substituir por dados reais do backend)
    const stats = [
        { id: 1, label: "Animais", value: 128, icon: PawPrint, color: "from-blue-400 to-blue-600" },
        { id: 2, label: "Funcionários", value: 12, icon: User, color: "from-green-400 to-green-600" },
        { id: 3, label: "Adoções", value: 45, icon: FileText, color: "from-yellow-400 to-yellow-600" },
    ];

    return (
        <div className="min-h-screen flex flex-col gap-8">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-extrabold text-gray-800 mt-10"
            >
                Dashboard
            </motion.h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: stat.id * 0.1 }}
                            className={`flex items-center gap-4 p-6 rounded-3xl shadow-2xl bg-gradient-to-br ${stat.color} text-white`}
                        >
                            <div className="p-4 bg-white/20 rounded-full">
                                <Icon className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold">{stat.value}</span>
                                <span className="text-sm">{stat.label}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
