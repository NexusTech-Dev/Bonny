import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    PawPrint,
    User,
    FileText,
    Heart,
    Calendar,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { getAnimals } from "../../services/animalService.ts";
import { getStaff } from "../../services/staffService.ts";
import type { Animal } from "../../context/AnimalsContext.tsx";
import { useAdoptions } from "../../context/AdoptionsContext.tsx";
import { getVaccines } from "../../services/vaccineService";
import { getAntiparasitics } from "../../services/antiparasiticService";
import { getDewormings } from "../../services/dewormingService";
import {
    getAnimalsWithLateVaccines,
    getAnimalsWithLateAntiparasitics,
    getAnimalsWithLateDeworming
} from "./Alerts/HealthAlerts.ts";
import type { HealthRecord } from "../Health/types/healthRecord.ts";
import  AlertCard  from "../../Components/AlertCard/AlertCard.tsx";
import toast from "react-hot-toast";


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
    const [vaccines, setVaccines] = useState<HealthRecord[]>([]);
    const [antiparasitics, setAntiparasitics] = useState<HealthRecord[]>([]);
    const [dewormings, setDewormings] = useState<HealthRecord[]>([]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [
                    animalsData,
                    staffData,
                    vaccinesData,
                    antiparasiticsData,
                    dewormingsData
                ] = await Promise.all([
                    getAnimals(),
                    getStaff(),
                    getVaccines(),
                    getAntiparasitics(),
                    getDewormings()
                ]);

                setAnimals(animalsData);
                setStaff(staffData);
                setVaccines(vaccinesData);
                setAntiparasitics(antiparasiticsData);
                setDewormings(dewormingsData);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lateVaccines = getAnimalsWithLateVaccines(animals, vaccines);
    const lateAntiparasitics = getAnimalsWithLateAntiparasitics(animals, antiparasitics);
    const lateDewormings = getAnimalsWithLateDeworming(animals, dewormings);

    useEffect(() => {
        if (!loading) {
            const totalAlerts =
                lateVaccines.length +
                lateAntiparasitics.length +
                lateDewormings.length;

            if (totalAlerts > 0) {
                toast.error(`⚠ Existem ${totalAlerts} alertas pendentes de saúde!`, {
                    duration: 4500,
                    style: {
                        background: "#1f1f1f",
                        color: "#fff",
                        fontWeight: "600",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        border: "1px solid rgba(239, 68, 68, 0.25)",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                        fontSize: "14px",
                    },
                    iconTheme: {
                        primary: "#ef4444",
                        secondary: "#ffffff",
                    },
                });
            }
        }
    }, [loading, lateVaccines, lateAntiparasitics, lateDewormings]);

    function parseDate(input: Date | string | number | { toDate?: () => Date } | null | undefined): Date {
        if (!input) return new Date();
        if (input instanceof Date) return input;
        if (typeof input === "number") return new Date(input);
        if (typeof input === "string") return new Date(input);
        if (typeof input === "object" && typeof input.toDate === "function") return input.toDate();
        return new Date();
    }

    const cadastrosDoMes = animals.filter(animal => {
        if (!animal.rescueDate) return false;
        const date = parseDate(animal.rescueDate);
        const month = date.getUTCMonth();
        const year = date.getUTCFullYear();
        return month === currentMonth && year === currentYear;
    }).length;


    const stats = [
        {
            id: 1,
            label: "Total de Animais",
            value: animals.length,
            icon: PawPrint,
            color: "bg-blue-100 text-blue-800",
        },
        {
            id: 2,
            label: "Funcionários",
            value: staff.length,
            icon: User,
            color: "bg-green-100 text-green-800",
        },
        {
            id: 3,
            label: "Adoções",
            value: animals.filter((a) => a.status === "Adotado").length,
            icon: FileText,
            color: "bg-yellow-100 text-yellow-800",
        },
        {
            id: 4,
            label: "Disponíveis para Adoção",
            value: animals.filter((a) => a.status === "Disponível").length,
            icon: Heart,
            color: "bg-pink-100 text-pink-800",
        },
        {
            id: 5,
            label: "Cadastros do Mês",
            value: cadastrosDoMes,
            icon: Calendar,
            color: "bg-purple-100 text-purple-800",
        },
    ];

    const months = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
    ];

    const { adoptions } = useAdoptions();

    const adoptionData = months.map((month, index) => {
        const count = adoptions.filter(a => {
            if (!a.adoptionDate) return false;
            const adoptionMonth = new Date(a.adoptionDate).getMonth();
            return adoptionMonth === index;
        }).length;

        return { month, adoptions: count };
    });

    const registrationData = months.map((month, index) => {
        const count = animals.filter(animal => {
            if (!animal.rescueDate) return false;
            const date = parseDate(animal.rescueDate);
            const monthUTC = date.getUTCMonth();
            const yearUTC = date.getUTCFullYear();
            return monthUTC === index && yearUTC === currentYear;
        }).length;

        return { month, registrations: count };
    });

    const lastAnimals = [...animals]
        .filter(a => !!a.rescueDate)
        .sort((a, b) =>
            new Date(b.rescueDate ?? 0).getTime() -
            new Date(a.rescueDate ?? 0).getTime()
        )
        .slice(0, 5);

    return (
        <div className="min-h-screen p-6">
            <motion.h1
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-extrabold text-gray-900 mb-10"
            >
                Dashboard
            </motion.h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="animate-pulse bg-gray-200 h-24 rounded-2xl"
                        ></div>
                    ))
                ) : (
                    stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: stat.id * 0.1 }}
                                className={`flex flex-col gap-3 p-5 rounded-2xl shadow-md ${stat.color}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-white rounded-full flex items-center justify-center shadow">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xl font-bold">{stat.value}</span>
                                        <span className="text-sm font-medium">{stat.label}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div className="p-6 bg-white shadow rounded-2xl">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Adoções por Mês
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        {adoptionData.some((d) => d.adoptions > 0) ? (
                            <LineChart data={adoptionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="adoptions"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Nenhum dado de adoção disponível
                            </div>
                        )}
                    </ResponsiveContainer>
                </div>

                <div className="p-6 bg-white shadow rounded-2xl">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Cadastros nos últimos meses
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        {registrationData.some(d => d.registrations > 0) ? (
                            <BarChart data={registrationData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="month" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Bar dataKey="registrations" fill="#8b5cf6" barSize={30} />
                            </BarChart>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Nenhum cadastro disponível
                            </div>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Últimos Animais Cadastrados
                </h2>

                <div className="overflow-x-auto shadow-lg rounded-xl">
                    <table className="min-w-full bg-white divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nome
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Raça
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vacina
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Check-up
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading
                                ? Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                        </td>
                                    </tr>
                                ))
                                : lastAnimals.map((animal) => (
                                    <tr
                                        key={animal.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4 text-gray-700 font-medium">
                                            {animal.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {animal.breed}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {animal.status}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {animal.needsVaccine ? "Pendente" : "Ok"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {animal.needsCheckup ? "Pendente" : "Ok"}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Alertas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-6 h-32 rounded-xl bg-gray-200 animate-pulse"></div>
                        ))
                    ) : (
                        <>
                            <AlertCard title="Vacinas atrasadas" color="red" items={lateVaccines} records={vaccines} />
                            <AlertCard title="Antiparasitários atrasados" color="yellow" items={lateAntiparasitics} records={antiparasitics} />
                            <AlertCard title="Vermífugos atrasados" color="yellow" items={lateDewormings} records={dewormings} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
