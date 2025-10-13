import React, { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getStaff, deleteStaffById, updateStaffById } from "../../services/staffService.ts";
import { motion, AnimatePresence } from "framer-motion";

export type Staff = {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    sex: string;
    notes?: string;
    image?: string;
};

export default function StaffList() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [editStaff, setEditStaff] = useState<Staff | null>(null);
    const [editForm, setEditForm] = useState<Staff | null>(null);
    const [deleteStaff, setDeleteStaff] = useState<Staff | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const roles = [
        "Coordenador Geral",
        "Veterinário",
        "Auxiliar de Veterinário",
        "Voluntário",
        "Cuidador de Animais",
        "Assistente Administrativo",
        "Responsável por Adoções",
        "Marketing/Comunicação",
        "Financeiro"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getStaff();
                setStaff(data as Staff[]);
            } catch (error) {
                console.error("Erro ao buscar colaboradores:", error);
                toast.error("Erro ao carregar colaboradores.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredStaff = staff.filter(
        (s) =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            await updateStaffById(editForm.id, { ...editForm, image: editForm.image }, selectedFile);
            setStaff((prev) => prev.map((s) => (s.id === editForm.id ? editForm : s)));
            toast.success("Colaborador atualizado com sucesso!");
            setEditStaff(null);
            setEditForm(null);
            setSelectedFile(undefined);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao atualizar colaborador.");
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteStaff) return;
        try {
            await deleteStaffById(deleteStaff.id);
            setStaff((prev) => prev.filter((s) => s.id !== deleteStaff.id));
            setDeleteStaff(null);
            toast.success("Colaborador removido com sucesso!");
        } catch (err) {
            console.error(err);
            toast.error("Erro ao excluir colaborador.");
        }
    };

    const inputStyle = (error?: boolean) =>
        `w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:outline-none transition placeholder-gray-400 text-gray-800 ` +
        (error ? "border-2 border-red-500 focus:ring-red-500 bg-red-50" : "bg-gray-100/70 focus:ring-blue-500");

    return (
        <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Colaboradores</h1>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                        placeholder="Buscar colaborador..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 sm:w-64 px-4 py-2 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow"
                        onClick={() => navigate("/staff")}
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
            ) : filteredStaff.length === 0 ? (
                <div className="text-center text-gray-500 py-20">Nenhum colaborador encontrado.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredStaff.map((s) => (
                        <div
                            key={s.id}
                            className="rounded-2xl shadow-md hover:shadow-xl transition bg-white overflow-hidden group"
                        >
                            <div className="h-40 bg-gray-200 flex items-center justify-center relative">
                                <span className="text-gray-400 group-hover:opacity-0 transition">Imagem</span>
                                {s.image && (
                                    <img
                                        src={s.image}
                                        alt={s.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                )}
                                <button
                                    onClick={() => setDeleteStaff(s)}
                                    className="absolute top-2 right-2 text-red-500 bg-white p-1 rounded-full hover:bg-red-50 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="p-4 flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <h2 className="font-semibold text-gray-800 text-lg">{s.name}</h2>
                                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-700">
                                        {s.role}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{s.email}</p>
                                <p className="text-sm text-gray-600">{s.phone}</p>
                                <button
                                    onClick={() => setSelectedStaff(s)}
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
                {selectedStaff && (
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
                                onClick={() => setSelectedStaff(null)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>

                            <div className="h-60 bg-gray-200 flex items-center justify-center rounded-xl mb-6 relative overflow-hidden">
                                {selectedStaff.image ? (
                                    <img
                                        src={selectedStaff.image}
                                        alt={selectedStaff.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-400">Sem imagem</span>
                                )}
                            </div>

                            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedStaff.name}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
                                <p><strong>Cargo:</strong> {selectedStaff.role}</p>
                                <p><strong>Email:</strong> {selectedStaff.email}</p>
                                <p><strong>Telefone:</strong> {selectedStaff.phone}</p>
                                <p><strong>Sexo:</strong> {selectedStaff.sex || "Não informado"}</p>
                                <p className="sm:col-span-2"><strong>Observações:</strong> {selectedStaff.notes || "Nenhuma"}</p>
                            </div>

                            <div className="flex justify-end mt-6 gap-3">
                                <button
                                    onClick={() => setSelectedStaff(null)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={() => {
                                        setEditStaff(selectedStaff);
                                        setEditForm(selectedStaff);
                                        setSelectedStaff(null);
                                    }}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
                                >
                                    Editar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {editStaff && editForm && (
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
                                    setEditStaff(null);
                                    setEditForm(null);
                                    setSelectedFile(undefined);
                                }}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Colaborador</h2>
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
                                        <label className="text-sm font-medium">Cargo</label>
                                        <select
                                            name="role"
                                            value={editForm.role}
                                            onChange={handleEditChange}
                                            className={inputStyle()}
                                        >
                                            <option value="">Selecione o cargo</option>
                                            {roles.map((role) => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={editForm.email}
                                            onChange={handleEditChange}
                                            className={inputStyle()}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Telefone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={editForm.phone}
                                            onChange={handleEditChange}
                                            className={inputStyle()}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Sexo</label>
                                        <select
                                            name="sex"
                                            value={editForm.sex || ""}
                                            onChange={handleEditChange}
                                            className={inputStyle()}
                                        >
                                            <option value="">Selecione o sexo</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Feminino">Feminino</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="text-sm font-medium mb-1 block">Observações</label>
                                        <textarea
                                            name="notes"
                                            value={editForm.notes || ""}
                                            onChange={handleEditChange}
                                            className={inputStyle() + " resize-none w-full h-24"}
                                        />
                                    </div>
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
                                        onClick={() => document.getElementById("staff-image-input")?.click()}
                                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                                    >
                                        Alterar Imagem
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="staff-image-input"
                                        className="hidden"
                                        onChange={(e) => setSelectedFile(e.target.files?.[0])}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditStaff(null);
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

            {deleteStaff && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative overflow-hidden"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                    >
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Confirmar exclusão</h2>
                        <p className="text-gray-600 mb-6">
                            Deseja realmente excluir <strong>{deleteStaff.name}</strong>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteStaff(null)}
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
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
