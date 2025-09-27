import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PawPrint, User, FileText, Heart, Calendar, AlertCircle } from "lucide-react";
import { getAnimals } from "../services/animalService";
import { getStaff } from "../services/staffService.ts";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";

interface Animal {
    id: string;
    name: string;
    breed: string;
    status: "Disponível" | "Adotado" | "Em tratamento";
    needsVaccine?: boolean;
    needsCheckup?: boolean;
}

export interface Staff {
    id: string;
    name: string;
    role: string;
    email: string;
    phone?: string;
    image?: string;
    createdAt?: Date;
}

export default function Dashboard() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const animalsData = await getAnimals();
                setAnimals(animalsData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const staffData = await getStaff();
                setStaff(staffData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const stats = [
        { id: 1, label: "Total de Animais", value: animals.length, icon: PawPrint, color: "bg-blue-100 text-blue-800" },
        { id: 2, label: "Funcionários", value: staff.length, icon: User, color: "bg-green-100 text-green-800" },
        { id: 3, label: "Adoções", value: animals.filter(a => a.status === "Adotado").length, icon: FileText, color: "bg-yellow-100 text-yellow-800" },
        { id: 4, label: "Animais aguardando adoção", value: animals.filter(a => a.status === "Disponível").length, icon: Heart, color: "bg-pink-100 text-pink-800" },
        { id: 5, label: "Cadastros este mês", value: 15, icon: Calendar, color: "bg-purple-100 text-purple-800" },
    ];

    const alerts = [
        { id: 1, message: `${animals.filter(a => a.needsVaccine).length} animais precisam de vacinação`, color: "red" },
        { id: 2, message: `${animals.filter(a => a.needsCheckup).length} animais precisam de checkup`, color: "yellow" },
    ];

    const adoptionData = [
        { month: "Jan", adoptions: 4 },
        { month: "Fev", adoptions: 6 },
        { month: "Mar", adoptions: 8 },
        { month: "Abr", adoptions: 5 },
        { month: "Mai", adoptions: 10 },
        { month: "Jun", adoptions: 7 },
    ];

    const registrationData = [
        { month: "Jan", registrations: 3 },
        { month: "Fev", registrations: 5 },
        { month: "Mar", registrations: 7 },
        { month: "Abr", registrations: 4 },
        { month: "Mai", registrations: 9 },
        { month: "Jun", registrations: 6 },
    ];

    return (
        <div className="min-h-screen p-6">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-extrabold text-gray-900 mb-8"
            >
                Dashboard
            </motion.h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: stat.id * 0.1 }}
                            className={`flex flex-col gap-3 p-5 rounded-2xl shadow-md ${stat.color} bg-opacity-90`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white rounded-full flex items-center justify-center shadow">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold">{loading ? "-" : stat.value}</span>
                                    <span className="text-sm font-medium">{stat.label}</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div className="p-6 bg-white shadow rounded-2xl">
                    <h2 className="text-xl font-semibold mb-4">Adoções nos últimos meses</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={adoptionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
                            <Line type="monotone" dataKey="adoptions" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="p-6 bg-white shadow rounded-2xl">
                    <h2 className="text-xl font-semibold mb-4">Cadastros nos últimos meses</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={registrationData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
                            <Bar dataKey="registrations" fill="#8b5cf6" barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Últimos Animais Cadastrados</h2>
                <div className="overflow-x-auto shadow-lg rounded-xl">
                    <table className="min-w-full bg-white divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raça</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vacina</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Checkup</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {animals.slice(-5).map((animal) => (
                                <tr key={animal.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{animal.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{animal.breed}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{animal.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{animal.needsVaccine ? "Pendente" : "Ok"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{animal.needsCheckup ? "Pendente" : "Ok"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Alertas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`flex items-center p-4 bg-${alert.color}-50 text-${alert.color}-800 rounded-xl shadow`}
                        >
                            <AlertCircle className="w-6 h-6 mr-2" />
                            {alert.message}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
