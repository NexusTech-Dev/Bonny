import { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import {useNavigate} from "react-router-dom";

type Animal = {
    id: number;
    name: string;
    age: string;
    breed: string;
    status: "Disponível" | "Adotado" | "Em tratamento";
    image?: string;
};

export default function AnimalList() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteAnimal, setDeleteAnimal] = useState<Animal | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setAnimals([
                { id: 1, name: "Lilica", age: "2 anos", breed: "Poodle", status: "Disponível" },
                { id: 2, name: "Rex", age: "3 anos", breed: "Vira-lata", status: "Adotado" },
                { id: 3, name: "Bolt", age: "1 ano", breed: "Labrador", status: "Em tratamento" },
                { id: 4, name: "Mia", age: "4 anos", breed: "Siamês", status: "Disponível" },
                { id: 5, name: "Thor", age: "5 anos", breed: "Pastor Alemão", status: "Disponível" },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const getStatusStyle = (status: Animal["status"]) => {
        switch (status) {
            case "Disponível": return "bg-green-100 text-green-700";
            case "Adotado": return "bg-blue-100 text-blue-700";
            case "Em tratamento": return "bg-yellow-100 text-yellow-700";
        }
    };

    const confirmDelete = () => {
        if (deleteAnimal) {
            setAnimals(prev => prev.filter(a => a.id !== deleteAnimal.id));
            if (selectedAnimal?.id === deleteAnimal.id) setSelectedAnimal(null);
            setDeleteAnimal(null);
        }
    };

    return (
        <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Animais cadastrados</h1>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                        placeholder="Buscar animal..."
                        className="flex-1 sm:w-64 px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow"
                        onClick={() => navigate("/animals")}
                    >
                        <Plus size={18} /> <span className="hidden sm:inline">Cadastrar</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="rounded-2xl shadow-md bg-white overflow-hidden animate-pulse">
                            <div className="h-40 bg-gray-200 flex items-center justify-center">
                                <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
                            </div>
                            <div className="p-4 flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <div className="h-5 bg-gray-300 rounded w-1/2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                </div>
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-8 bg-gray-300 rounded mt-2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : animals.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                    Nenhum animal cadastrado. Clique em "Cadastrar" para adicionar um novo!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {animals.map((animal) => (
                        <div key={animal.id} className="rounded-2xl shadow-md hover:shadow-xl transition bg-white overflow-hidden group">
                            <div className="h-40 bg-gray-200 flex items-center justify-center relative">
                                <span className="text-gray-400 group-hover:opacity-0 transition">Imagem</span>
                                {animal.image && (
                                    <img
                                        src={animal.image}
                                        alt={animal.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                )}
                                <button
                                    onClick={() => setDeleteAnimal(animal)}
                                    className="absolute top-2 right-2 text-red-500 bg-white p-1 rounded-full hover:bg-red-50 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="p-4 flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <h2 className="font-semibold text-gray-800 text-lg">{animal.name}</h2>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusStyle(animal.status)}`}>
                                        {animal.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{animal.age} • {animal.breed}</p>
                                <button
                                    onClick={() => setSelectedAnimal(animal)}
                                    className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-100 transition text-sm font-medium"
                                >
                                    Ver detalhes
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-center gap-2 mt-6">
                        {[1, 2, 3, 4, 5].map((page) => (
                            <button key={page} className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-blue-50 transition text-sm">
                                {page}
                            </button>
                        ))}
                    </div>
                </div>

            )}

            {selectedAnimal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative animate-scaleIn">
                        <button
                            onClick={() => setSelectedAnimal(null)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <div className="h-48 bg-gray-200 flex items-center justify-center rounded-xl mb-4 relative overflow-hidden">
                            <span className="text-gray-400">Imagem do {selectedAnimal.name}</span>
                            {selectedAnimal.image && (
                                <img
                                    src={selectedAnimal.image}
                                    alt={selectedAnimal.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            )}
                        </div>

                        <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedAnimal.name}</h2>
                        <p className="text-gray-600 mb-1"><strong>Idade:</strong> {selectedAnimal.age}</p>
                        <p className="text-gray-600 mb-1"><strong>Raça:</strong> {selectedAnimal.breed}</p>
                        <p className="text-gray-600 mb-1">
                            <strong>Status:</strong>{" "}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(selectedAnimal.status)}`}>
                                {selectedAnimal.status}
                            </span>
                        </p>

                        <div className="flex justify-end mt-6 gap-3">
                            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow">
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteAnimal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scaleIn">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Confirmar exclusão</h2>
                        <p className="text-gray-600 mb-6">Deseja realmente excluir <strong>{deleteAnimal.name}</strong>?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteAnimal(null)}
                                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
