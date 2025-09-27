import { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAnimals, deleteAnimalById, updateAnimalById } from "../../services/animalService.ts";
import { motion, AnimatePresence } from "framer-motion";

export type Animal = {
    id: string;
    name: string;
    birthDate?: string;
    breed: string;
    status: "Disponível" | "Adotado" | "Em tratamento";
    image?: string;
    sex: string;
    color: string;
    species: string;
    rescueDate: string;
    size: string;
    notes?: string;
};

export default function AnimalList() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [editAnimal, setEditAnimal] = useState<Animal | null>(null);
    const [editForm, setEditForm] = useState<Animal | null>(null);
    const [deleteAnimal, setDeleteAnimal] = useState<Animal | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAnimals();
                setAnimals(data as Animal[]);
            } catch (error) {
                console.error("Erro ao buscar animais:", error);
                toast.error("Erro ao carregar animais.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredAnimals = animals.filter(
        (animal) =>
            animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            animal.breed.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status: Animal["status"]) => {
        switch (status) {
            case "Disponível":
                return "bg-green-100 text-green-700";
            case "Adotado":
                return "bg-blue-100 text-blue-700";
            case "Em tratamento":
                return "bg-yellow-100 text-yellow-700";
        }
    };

    const calcularIdade = (birthDate?: string) => {
        if (!birthDate) return "Não informado";
        const nascimento = new Date(birthDate);
        const hoje = new Date();
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
        return `${idade} ano${idade !== 1 ? "s" : ""}`;
    };

    const handleEditChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        if (!editForm) return;
        const { name, value } = e.target;
        setEditForm({ ...editForm, [name]: value });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editForm) return;
        setSaving(true);
        try {
            await updateAnimalById(editForm.id, editForm, selectedFile);
            setAnimals((prev) => prev.map((a) => (a.id === editForm.id ? editForm : a)));
            toast.success("Animal atualizado com sucesso!");
            setEditAnimal(null);
            setEditForm(null);
            setSelectedFile(undefined);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao atualizar animal.");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteAnimal) return;
        try {
            await deleteAnimalById(deleteAnimal.id);
            setAnimals((prev) => prev.filter((a) => a.id !== deleteAnimal.id));
            setDeleteAnimal(null);
            toast.success("Animal removido com sucesso!");
        } catch (err) {
            console.error(err);
            toast.error("Erro ao excluir animal.");
        }
    };

    const inputStyle = (error?: boolean) =>
        `w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:outline-none transition placeholder-gray-400 text-gray-800 ` +
        (error ? "border-2 border-red-500 focus:ring-red-500 bg-red-50" : "bg-gray-100/70 focus:ring-blue-500");

    return (
        <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Animais cadastrados</h1>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                        placeholder="Buscar animal..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 sm:w-64 px-4 py-2 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
            ) : filteredAnimals.length === 0 ? (
                <div className="text-center text-gray-500 py-20">
                    Nenhum animal encontrado.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAnimals.map((animal) => (
                        <div
                            key={animal.id}
                            className="rounded-2xl shadow-md hover:shadow-xl transition bg-white overflow-hidden group"
                        >
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
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusStyle(
                                            animal.status
                                        )}`}
                                    >
                    {animal.status}
                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {calcularIdade(animal.birthDate)} • {animal.breed}
                                </p>
                                <button
                                    onClick={() => { setSelectedAnimal(animal); }}
                                    className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-100 transition text-sm font-medium"
                                >
                                    Ver detalhes
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {(selectedAnimal || editAnimal) && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {selectedAnimal && (
                            <motion.div
                                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                            >
                                <button
                                    onClick={() => setSelectedAnimal(null)}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                >
                                    <X size={20} />
                                </button>
                                <div className="h-56 bg-gray-200 flex items-center justify-center rounded-xl mb-6 relative overflow-hidden">
                                    {selectedAnimal.image ? (
                                        <img
                                            src={selectedAnimal.image}
                                            alt={selectedAnimal.name}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-400">Sem imagem</span>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedAnimal.name}</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
                                    <p>
                                        <strong>Sexo:</strong> {selectedAnimal.sex === "M" ? "Macho" : "Fêmea"}
                                    </p>
                                    <p>
                                        <strong>Idade:</strong> {calcularIdade(selectedAnimal.birthDate)}
                                    </p>
                                    <p>
                                        <strong>Cor:</strong> {selectedAnimal.color}
                                    </p>
                                    <p>
                                        <strong>Espécie:</strong> {selectedAnimal.species}
                                    </p>
                                    <p>
                                        <strong>Raça:</strong> {selectedAnimal.breed}
                                    </p>
                                    <p>
                                        <strong>Porte:</strong> {selectedAnimal.size}
                                    </p>
                                    <p>
                                        <strong>Data de Resgate:</strong> {selectedAnimal.rescueDate}
                                    </p>
                                    <p>
                                        <strong>Status:</strong>{" "}
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                                selectedAnimal.status
                                            )}`}
                                        >
                      {selectedAnimal.status}
                    </span>
                                    </p>
                                </div>
                                {selectedAnimal.notes && (
                                    <div className="mt-4">
                                        <p className="text-gray-700">
                                            <strong>Observações:</strong> {selectedAnimal.notes}
                                        </p>
                                    </div>
                                )}
                                <div className="flex justify-end mt-6 gap-3">
                                    <button
                                        onClick={() => {
                                            setEditAnimal(selectedAnimal);
                                            setEditForm(selectedAnimal);
                                            setSelectedAnimal(null);
                                        }}
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => setSelectedAnimal(null)}
                                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                                    >
                                        Voltar
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {editAnimal && editForm && (
                            <motion.div
                                className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                            >
                                <button
                                    onClick={() => {
                                        setEditAnimal(null);
                                        setEditForm(null);
                                        setSelectedFile(undefined);
                                    }}
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                >
                                    <X size={20} />
                                </button>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Animal</h2>
                                <form onSubmit={handleEditSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium">Nome</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editForm.name}
                                                onChange={handleEditChange}
                                                className={inputStyle()}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Raça</label>
                                            <input
                                                type="text"
                                                name="breed"
                                                value={editForm.breed}
                                                onChange={handleEditChange}
                                                className={inputStyle()}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Sexo</label>
                                            <select
                                                name="sex"
                                                value={editForm.sex}
                                                onChange={handleEditChange}
                                                className={inputStyle()}
                                            >
                                                <option value="M">Macho</option>
                                                <option value="F">Fêmea</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Espécie</label>
                                            <input
                                                type="text"
                                                name="species"
                                                value={editForm.species}
                                                onChange={handleEditChange}
                                                className={inputStyle()}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Cor</label>
                                            <input
                                                type="text"
                                                name="color"
                                                value={editForm.color}
                                                onChange={handleEditChange}
                                                className={inputStyle()}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Porte</label>
                                            <input
                                                type="text"
                                                name="size"
                                                value={editForm.size}
                                                onChange={handleEditChange}
                                                className={inputStyle()}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Data de Nascimento</label>
                                            <input
                                                type="date"
                                                name="birthDate"
                                                value={editForm.birthDate}
                                                onChange={handleEditChange}
                                                className={inputStyle()}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Data de Resgate</label>
                                            <input
                                                type="date"
                                                name="rescueDate"
                                                value={editForm.rescueDate}
                                                onChange={handleEditChange}
                                                className={inputStyle()}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Status</label>
                                        <select
                                            name="status"
                                            value={editForm.status}
                                            onChange={handleEditChange}
                                            className={inputStyle()}
                                        >
                                            <option value="Disponível">Disponível</option>
                                            <option value="Adotado">Adotado</option>
                                            <option value="Em tratamento">Em tratamento</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Observações</label>
                                        <textarea
                                            name="notes"
                                            value={editForm.notes}
                                            onChange={handleEditChange}
                                            className={`${inputStyle()} resize-none`}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Imagem</label>
                                        <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-xl overflow-hidden mb-2 relative">
                                            {selectedFile ? (
                                                <img src={URL.createObjectURL(selectedFile)} alt="preview" className="w-full h-full object-cover" />
                                            ) : editForm.image ? (
                                                <img src={editForm.image} alt={editForm.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-gray-400">Sem imagem</span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById("animal-image-input")?.click()}
                                            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                                        >
                                            Alterar Imagem
                                        </button>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="animal-image-input"
                                            className="hidden"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0])}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditAnimal(null);
                                                setEditForm(null);
                                                setSelectedFile(undefined);
                                            }}
                                            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
                                        >
                                            {saving ? "Salvando..." : "Salvar"}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {deleteAnimal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scaleIn">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Confirmar exclusão</h2>
                        <p className="text-gray-600 mb-6">
                            Deseja realmente excluir <strong>{deleteAnimal.name}</strong>?
                        </p>
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
