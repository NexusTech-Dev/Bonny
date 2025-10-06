import { useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { deleteAnimalById, updateAnimalById } from "../../services/animalService.ts";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimals, type Animal } from "../../context/AnimalsContext.tsx";

export default function AnimalList() {
    const [editForm, setEditForm] = useState<Animal | null>(null);
    const [deleteAnimal, setDeleteAnimal] = useState<Animal | null>(null);
    const [saving, setSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | undefined>();
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();
    const { animals, updateAnimalStatus, removeAnimalFromContext } = useAnimals();

    const filteredAnimals = animals.filter(
        a =>
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.breed?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status: Animal["status"]) => {
        switch (status) {
            case "Disponível":
                return "bg-green-100 text-green-700";
            case "Adotado":
                return "bg-blue-100 text-blue-700";
            case "Em tratamento":
                return "bg-yellow-100 text-yellow-700";
            case "Em andamento":
                return "bg-purple-100 text-purple-700";
            default:
                return "bg-gray-100 text-gray-700";
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

    const inputStyle = (error?: boolean) =>
        `w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:outline-none transition placeholder-gray-400 text-gray-800 ` +
        (error ? "border-2 border-red-500 focus:ring-red-500 bg-red-50" : "bg-gray-100/70 focus:ring-blue-500");

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
            updateAnimalStatus(editForm.id, editForm.status);
            toast.success("Animal atualizado com sucesso!");
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
            removeAnimalFromContext(deleteAnimal.id);
            toast.success("Animal removido com sucesso!");
            setDeleteAnimal(null);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao excluir animal.");
        }
    };

    return (
        <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Animais cadastrados</h1>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                        placeholder="Buscar animal..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
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

            {filteredAnimals.length === 0 ? (
                <div className="text-center text-gray-500 py-20">Nenhum animal encontrado.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAnimals.map(animal => (
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
                                    {calcularIdade(animal.birthDate)} • {animal.breed || "-"}
                                </p>
                                <button
                                    onClick={() => setEditForm(animal)}
                                    className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-100 transition text-sm font-medium"
                                >
                                    Ver detalhes
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Edição */}
            <AnimatePresence>
                {editForm && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                        >
                            <button
                                onClick={() => {
                                    setEditForm(null);
                                    setSelectedFile(undefined);
                                }}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Detalhes do Animal</h2>

                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: "Nome", name: "name", type: "text" },
                                        { label: "Raça", name: "breed", type: "text" },
                                        { label: "Sexo", name: "sex", type: "select", options: ["M", "F"] },
                                        { label: "Espécie", name: "species", type: "text" },
                                        { label: "Cor", name: "color", type: "text" },
                                        { label: "Porte", name: "size", type: "text" },
                                        { label: "Data de Nascimento", name: "birthDate", type: "date" },
                                        { label: "Data de Resgate", name: "rescueDate", type: "date" },
                                    ].map(field => (
                                        <div key={field.name}>
                                            <label className="text-sm font-medium">{field.label}</label>
                                            {field.type === "select" ? (
                                                <select
                                                    name={field.name}
                                                    value={editForm[field.name as keyof Animal] || ""}
                                                    onChange={handleEditChange}
                                                    className={inputStyle()}
                                                >
                                                    <option value="M">Macho</option>
                                                    <option value="F">Fêmea</option>
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={editForm[field.name as keyof Animal] || ""}
                                                    onChange={handleEditChange}
                                                    className={inputStyle()}
                                                />
                                            )}
                                        </div>
                                    ))}
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
                                        <option value="Em andamento">Em andamento</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Observações</label>
                                    <textarea
                                        name="notes"
                                        value={editForm.notes || ""}
                                        onChange={handleEditChange}
                                        className={`${inputStyle()} resize-none`}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Imagem</label>
                                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-xl overflow-hidden mb-2 relative">
                                        {selectedFile ? (
                                            <img
                                                src={URL.createObjectURL(selectedFile)}
                                                alt="preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : editForm.image ? (
                                            <img
                                                src={editForm.image}
                                                alt={editForm.name}
                                                className="w-full h-full object-cover"
                                            />
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
                                        onChange={e => setSelectedFile(e.target.files?.[0])}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
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
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal de Exclusão */}
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
