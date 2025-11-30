import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { Animal } from "../../context/AnimalsContext";
import type { HealthRecord } from "../../pages/Health/types/healthRecord";

interface AlertCardProps {
    title: string;
    color: "red" | "yellow";
    items: Animal[];
    records: HealthRecord[];
}

export default function AlertCard({ title, color, items, records }: AlertCardProps) {
    function getDetails(animalId: string) {
        const rec = records.filter((r) => r.animalId === animalId);
        if (rec.length === 0) return null;

        const sorted = [...rec].sort(
            (a, b) => new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime()
        );

        const last = sorted[sorted.length - 1];
        const next = last.nextDoseDate ? new Date(last.nextDoseDate) : null;
        const today = new Date();

        const daysLate =
            next && next < today
                ? Math.floor((today.getTime() - next.getTime()) / (1000 * 60 * 60 * 24))
                : 0;

        return {
            lastDose: last.applicationDate
                ? new Date(last.applicationDate).toLocaleDateString()
                : "—",
            nextDose: next ? next.toLocaleDateString() : "—",
            daysLate,
        };
    }

    const borderColor = {
        red: "border-red-500",
        yellow: "border-yellow-500",
    };

    const badgeColor = {
        red: "bg-red-600",
        yellow: "bg-yellow-500",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl shadow bg-white border-l-4 ${borderColor[color]}`}
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-gray-700" />
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>

                <span
                    className={`ml-auto ${badgeColor[color]} text-white text-xs py-1 px-3 rounded-full shadow`}
                >
                    {items.length}
                </span>
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto pr-2 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {items.length === 0 && (
                    <p className="text-gray-600 text-sm">Nenhum animal pendente 🎉</p>
                )}

                {items.map((animal) => {
                    const details = getDetails(animal.id);

                    return (
                        <motion.div
                            key={animal.id}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative p-4 rounded-xl bg-gray-50 shadow-sm border hover:shadow-md transition-all flex gap-3"
                        >
                            {details && (
                                <div
                                    className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${
                                        details.daysLate > 15
                                            ? "bg-red-600"
                                            : details.daysLate > 0
                                                ? "bg-yellow-500"
                                                : "bg-gray-300"
                                    }`}
                                />
                            )}

                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                                {animal.name[0].toUpperCase()}
                            </div>

                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{animal.name}</p>

                                {details && (
                                    <div className="text-xs text-gray-600 mt-1">
                                        <p>
                                            Última dose:{" "}
                                            <span className="font-medium">{details.lastDose}</span>
                                        </p>
                                        <p>
                                            Próxima dose:{" "}
                                            <span className="font-medium">{details.nextDose}</span>
                                        </p>

                                        {details.daysLate > 0 && (
                                            <p className="text-red-600 font-bold mt-1">
                                                {details.daysLate} dias de atraso
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
