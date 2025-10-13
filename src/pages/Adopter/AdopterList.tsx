import React, { useState, useEffect, type ChangeEvent } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getAdopters, deleteAdopterById, updateAdopterById } from "../../services/adopterService";
import { motion, AnimatePresence } from "framer-motion";
import female from "../../assets/images/avatars/female.jpg";
import male from "../../assets/images/avatars/male.jpg";
import other from "../../assets/images/avatars/other.jpg";
import { formatCPF, formatCEP, formatPhone } from "./formatters.ts";

export type Adopter = {
    id: string;
    name: string;
    email: string;
    phone: string;
    sex?: string;
    notes?: string;
    rg?: string;
    cpf?: string;
    maritalStatus?: string;
    hasPets?: boolean;
    state?: string;
    city?: string;
    district?: string;
    street?: string;
    number?: string;
    complement?: string;
    cep?: string;
};

type Errors = {
    [key in keyof Adopter]?: string;
};

const ErrorMessage = ({ message }: { message?: string }) => (
    message ? <span className="text-red-500 text-sm mt-1">{message}</span> : null
);

export default function AdopterList() {
    const [adopters, setAdopters] = useState<Adopter[]>([]);
    const [selectedAdopter, setSelectedAdopter] = useState<Adopter | null>(null);
    const [editing, setEditing] = useState<Adopter | null>(null);
    const [deleteAdopter, setDeleteAdopter] = useState<Adopter | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [errors, setErrors] = useState<Errors>({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAdopters();
                setAdopters(data);
            } catch (err) {
                console.error(err);
                toast.error("Erro ao carregar adotantes.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredAdopters = adopters.filter(a =>
        [a.name, a.email, a.phone, a.cpf, a.rg].some(field =>
            field?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const inputStyle = (hasError?: boolean) =>
        `w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:outline-none transition placeholder-gray-400 text-gray-800 bg-gray-100/70 ${hasError ? "ring-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`;

    const handleEditChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        if (!editing) return;

        const { name, value, type } = e.target;
        let newValue: string | boolean = value;

        if (name === "cpf") newValue = formatCPF(value);
        if (name === "cep") newValue = formatCEP(value);
        if (name === "phone") newValue = formatPhone(value);

        if (type === "checkbox") newValue = (e.target as HTMLInputElement).checked;
        if (name === "hasPets") newValue = value === "true";

        setEditing({ ...editing, [name]: newValue });
    };

    const validateEdit = () => {
        if (!editing) return false;

        const otherAdopters = adopters.filter(a => a.id !== editing.id);
        const newErrors: Errors = {};

        if (!editing.name || editing.name.trim() === "") newErrors.name = "Campo obrigatório";
        if (!editing.email || editing.email.trim() === "") newErrors.email = "Campo obrigatório";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editing.email)) newErrors.email = "Email inválido";
        else if (otherAdopters.some(a => a.email === editing.email)) newErrors.email = "Email já cadastrado";

        if (!editing.phone || editing.phone.trim() === "") newErrors.phone = "Campo obrigatório";
        else if (!/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(editing.phone)) newErrors.phone = "Telefone inválido";
        else if (otherAdopters.some(a => a.phone === editing.phone)) newErrors.phone = "Telefone já cadastrado";

        if (!editing.cpf || editing.cpf.trim() === "") newErrors.cpf = "Campo obrigatório";
        else {
            const cpfNumbers = editing.cpf.replace(/\D/g, "");
            if (!/^\d{11}$/.test(cpfNumbers)) newErrors.cpf = "CPF inválido";
            else if (otherAdopters.some(a => a.cpf === editing.cpf)) newErrors.cpf = "CPF já cadastrado";
        }

        if (!editing.rg || editing.rg.trim() === "") newErrors.rg = "Campo obrigatório";
        else if (otherAdopters.some(a => a.rg === editing.rg)) newErrors.rg = "RG já cadastrado";

        if (!editing.sex || editing.sex === "") newErrors.sex = "Campo obrigatório";

        if (editing.hasPets === undefined || editing.hasPets === null) newErrors.hasPets = "Campo obrigatório";

        if (!editing.state || editing.state === "") newErrors.state = "Campo obrigatório";
        if (!editing.city || editing.city.trim() === "") newErrors.city = "Campo obrigatório";
        if (!editing.district || editing.district.trim() === "") newErrors.district = "Campo obrigatório";
        if (!editing.street || editing.street.trim() === "") newErrors.street = "Campo obrigatório";
        if (!editing.number || editing.number.trim() === "") newErrors.number = "Campo obrigatório";
        if (!editing.cep || editing.cep.trim() === "") newErrors.cep = "Campo obrigatório";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error("Corrija os campos destacados.");
            return false;
        }

        return true;
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        if (!validateEdit()) return;

        setSaving(true);
        await toast.promise(
            updateAdopterById(editing.id, editing),
            {
                loading: "Salvando...",
                success: "Adotante atualizado com sucesso!",
                error: "Erro ao atualizar adotante."
            }
        );
        setAdopters(prev => prev.map(a => (a.id === editing.id ? editing : a)));
        setEditing(null);
        setSaving(false);
    };

    const confirmDelete = async () => {
        if (!deleteAdopter) return;
        await toast.promise(
            deleteAdopterById(deleteAdopter.id),
            {
                loading: "Excluindo...",
                success: "Adotante removido com sucesso!",
                error: "Erro ao excluir adotante."
            }
        );
        setAdopters(prev => prev.filter(a => a.id !== deleteAdopter.id));
        setDeleteAdopter(null);
    };

    return (
        <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Adotantes</h1>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                        placeholder="Buscar adotante..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-1 sm:w-64 px-4 py-2 border border-gray-300 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition shadow"
                        onClick={() => navigate("/adopter")}
                    >
                        <Plus size={18} /> <span className="hidden sm:inline">Cadastrar</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="rounded-2xl shadow-md bg-white overflow-hidden animate-pulse p-4 h-48"></div>
                    ))}
                </div>
            ) : filteredAdopters.length === 0 ? (
                <div className="text-center text-gray-500 py-20">Nenhum adotante encontrado.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAdopters.map(a => (
                        <div key={a.id} className="rounded-2xl shadow-md hover:shadow-xl transition bg-white overflow-hidden group">
                            <div className="h-40 bg-gray-200 flex items-center justify-center relative">
                                {a.sex === "Feminino" ? (
                                    <img src={female} alt="Avatar feminino" className="w-24 h-24 object-cover rounded-full" />
                                ) : a.sex === "Masculino" ? (
                                    <img src={male} alt="Avatar masculino" className="w-24 h-24 object-cover rounded-full" />
                                ) : (
                                    <img src={other} alt="Avatar outros" className="w-24 h-24 object-cover rounded-full" />
                                )}

                                <button
                                    onClick={() => setDeleteAdopter(a)}
                                    className="absolute top-2 right-2 text-red-500 bg-white p-1 rounded-full hover:bg-red-50 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="p-4 flex flex-col gap-2">
                                <h2 className="font-semibold text-gray-800 text-lg">{a.name}</h2>
                                <p className="text-sm text-gray-600">{a.email}</p>
                                <p className="text-sm text-gray-600">{a.phone}</p>
                                <p className="text-sm text-gray-600">{a.sex || "Não informado"}</p>
                                <button
                                    onClick={() => setSelectedAdopter(a)}
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
                {selectedAdopter && (
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
                                onClick={() => setSelectedAdopter(null)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedAdopter.name}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
                                <p><strong>Email:</strong> {selectedAdopter.email}</p>
                                <p><strong>Telefone:</strong> {selectedAdopter.phone}</p>
                                <p><strong>Sexo:</strong> {selectedAdopter.sex || "Não informado"}</p>
                                <p><strong>RG:</strong> {selectedAdopter.rg || "Não informado"}</p>
                                <p><strong>CPF:</strong> {selectedAdopter.cpf || "Não informado"}</p>
                                <p><strong>Endereço:</strong> {`${selectedAdopter.street || ""} ${selectedAdopter.number || ""}, ${selectedAdopter.district || ""}, ${selectedAdopter.city || ""} - ${selectedAdopter.state || ""}`}</p>
                                <p><strong>CEP:</strong> {selectedAdopter.cep || "Não informado"}</p>
                                <p><strong>Estado Civil:</strong> {selectedAdopter.maritalStatus || "Não informado"}</p>
                                <p><strong>Possui pets:</strong> {selectedAdopter.hasPets ? "Sim" : "Não"}</p>
                                <p className="sm:col-span-2"><strong>Observações:</strong> {selectedAdopter.notes || "Nenhuma"}</p>
                            </div>
                            <div className="flex justify-end mt-6 gap-3">
                                <button
                                    onClick={() => setSelectedAdopter(null)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                                >
                                    Voltar
                                </button>
                                <button
                                    onClick={() => { setEditing(selectedAdopter); setSelectedAdopter(null); }}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
                                >
                                    Editar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {editing && (
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
                                onClick={() => { setEditing(null); setErrors({}); }}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Adotante</h2>
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Inputs */}
                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Nome</label>
                                        <input type="text" name="name" value={editing.name} onChange={handleEditChange} className={inputStyle(!!errors.name)} />
                                        <ErrorMessage message={errors.name} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Email</label>
                                        <input type="email" name="email" value={editing.email} onChange={handleEditChange} className={inputStyle(!!errors.email)} placeholder="exemplo@email.com" />
                                        <ErrorMessage message={errors.email} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">RG</label>
                                        <input type="text" name="rg" value={editing.rg} onChange={handleEditChange} className={inputStyle(!!errors.rg)} />
                                        <ErrorMessage message={errors.rg} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">CPF</label>
                                        <input type="text" name="cpf" value={editing.cpf} onChange={handleEditChange} className={inputStyle(!!errors.cpf)} />
                                        <ErrorMessage message={errors.cpf} />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Telefone</label>
                                        <input type="tel" name="phone" value={editing.phone} onChange={handleEditChange} className={inputStyle(!!errors.phone)} />
                                        <ErrorMessage message={errors.phone} />
                                    </div>
                                    {/* Estado Civil */}
                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Estado Civil</label>
                                        <select name="maritalStatus" value={editing.maritalStatus || ""} onChange={handleEditChange} className={inputStyle(!!errors.maritalStatus)}>
                                            <option value="">Selecione</option>
                                            <option value="Solteiro(a)">Solteiro(a)</option>
                                            <option value="Casado(a)">Casado(a)</option>
                                            <option value="Divorciado(a)">Divorciado(a)</option>
                                            <option value="Viúvo(a)">Viúvo(a)</option>
                                        </select>
                                        <ErrorMessage message={errors.maritalStatus} />
                                    </div>
                                    {/* Estado */}
                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Estado</label>
                                        <select name="state" value={editing.state || ""} onChange={handleEditChange} className={inputStyle(!!errors.state)}>
                                            <option value="">Selecione</option>
                                            <option value="SP">São Paulo</option>
                                            <option value="RJ">Rio de Janeiro</option>
                                        </select>
                                        <ErrorMessage message={errors.state} />
                                    </div>
                                    {/* Cidade */}
                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Cidade</label>
                                        <input type="text" name="city" value={editing.city || ""} onChange={handleEditChange} className={inputStyle(!!errors.city)} />
                                        <ErrorMessage message={errors.city} />
                                    </div>
                                    {/* Bairro */}
                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Bairro</label>
                                        <input type="text" name="district" value={editing.district || ""} onChange={handleEditChange} className={inputStyle(!!errors.district)} />
                                        <ErrorMessage message={errors.district} />
                                    </div>
                                    {/* Rua */}
                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Rua</label>
                                        <input
                                            type="text"
                                            name="street"
                                            value={editing.street || ""}
                                            onChange={handleEditChange}
                                            className={inputStyle(!!errors.street)}
                                        />
                                        <ErrorMessage message={errors.street} />
                                    </div>

                                    {/* Número */}
                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Número</label>
                                        <input
                                            type="text"
                                            name="number"
                                            value={editing.number || ""}
                                            onChange={handleEditChange}
                                            className={inputStyle(!!errors.number)}
                                        />
                                        <ErrorMessage message={errors.number} />
                                    </div>

                                    {/* Complemento */}
                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">Complemento</label>
                                        <input
                                            type="text"
                                            name="complement"
                                            value={editing.complement || ""}
                                            onChange={handleEditChange}
                                            className={inputStyle(!!errors.complement)}
                                        />
                                        <ErrorMessage message={errors.complement} />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="mb-1 font-medium text-gray-700">CEP</label>
                                        <input
                                            type="text"
                                            name="cep"
                                            value={editing.cep || ""}
                                            onChange={handleEditChange}
                                            className={inputStyle(!!errors.cep)}
                                        />
                                        <ErrorMessage message={errors.cep} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label>Gênero</label>
                                        <select
                                            name="sex"
                                            value={editing.sex || ""}
                                            onChange={handleEditChange}
                                            className={inputStyle(!!errors.cep)}
                                        >
                                            <option value="">Selecione</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Feminino">Feminino</option>
                                            <option value="Outro">Outro</option>
                                        </select>
                                        <ErrorMessage message={errors.sex} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label>Possui animal?</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="hasPets"
                                                    value="true"
                                                    checked={editing.hasPets === true}
                                                    onChange={handleEditChange}
                                                />
                                                Sim
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="hasPets"
                                                    value="false"
                                                    checked={editing.hasPets === false}
                                                    onChange={handleEditChange}
                                                />
                                                Não
                                            </label>
                                            <ErrorMessage message={errors.hasPets}/>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:col-span-2">
                                        <label className="mb-1 font-medium text-gray-700">Observações</label>
                                        <textarea
                                            name="notes"
                                            value={editing.notes || ""}
                                            onChange={handleEditChange}
                                            className={inputStyle(!!errors.notes)}
                                            rows={3}
                                        />
                                        <ErrorMessage message={errors.notes} />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => { setEditing(null); setErrors({}); }}
                                        className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
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

                {deleteAdopter && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirmar exclusão</h2>
                            <p className="text-gray-700 mb-6">
                                Tem certeza que deseja excluir o adotante <strong>{deleteAdopter.name}</strong>?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setDeleteAdopter(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                                >
                                    Excluir
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
