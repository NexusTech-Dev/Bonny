import React, { useState, useEffect, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { UserCheck, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
    registerAdopter,
    getAdopterById,
    updateAdopterById, getAdopters,
} from "../../services/adopterService";
import { formatCPF, formatCEP, formatPhone } from "./formatters.ts"

export default function AdopterRegister() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [adopterList, setAdopterList] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        sex: "",
        notes: "",
        rg: "",
        cpf: "",
        maritalStatus: "",
        state: "",
        city: "",
        district: "",
        street: "",
        number: "",
        complement: "",
        cep: "",
        hasPets: false,
    });

    useEffect(() => {
        const fetchAdopters = async () => {
            try {
                const list = await getAdopters();
                setAdopterList(list);

                if (id) {
                    const adopter = await getAdopterById(id);
                    if (!adopter) {
                        toast.error("Adotante não encontrado");
                        return;
                    }

                    setFormData({
                        name: adopter.name,
                        email: adopter.email,
                        phone: adopter.phone,
                        sex: adopter.sex || "",
                        notes: adopter.notes || "",
                        rg: adopter.rg || "",
                        cpf: adopter.cpf || "",
                        maritalStatus: adopter.maritalStatus || "",
                        state: adopter.state || "",
                        city: adopter.city || "",
                        district: adopter.district || "",
                        street: adopter.street || "",
                        number: adopter.number || "",
                        complement: adopter.complement || "",
                        cep: adopter.cep || "",
                        hasPets: !!adopter.hasPets,
                    });
                }
            } catch {
                toast.error("Erro ao carregar adotantes");
            }
        };

        fetchAdopters();
    }, [id]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        let newValue: string | boolean = value;

        if (name === "cpf") newValue = formatCPF(value);
        if (name === "cep") newValue = formatCEP(value);
        if (name === "phone") newValue = formatPhone(value);

        setFormData(prev => ({ ...prev, [name]: newValue }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validate = async () => {
        const newErrors: { [key: string]: string } = {};
        const onlyNumbers = (v: string) => v.replace(/\D/g, "");

        const requiredFields = [
            "name", "email", "phone", "sex", "rg", "cpf",
            "maritalStatus", "state", "city", "district",
            "street", "number", "cep"
        ];

        requiredFields.forEach(field => {
            if (!formData[field as keyof typeof formData]) {
                newErrors[field] = "Campo obrigatório";
            }
        });

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Email inválido";

        if (formData.cpf && !/^\d{11}$/.test(onlyNumbers(formData.cpf)))
            newErrors.cpf = "CPF inválido (11 dígitos)";

        if (formData.rg && !/^\d{5,12}$/.test(onlyNumbers(formData.rg)))
            newErrors.rg = "RG inválido (5 a 12 dígitos)";

        if (formData.cep && !/^\d{8}$/.test(onlyNumbers(formData.cep)))
            newErrors.cep = "CEP inválido (8 dígitos)";

        if (formData.phone && !/^\d{10,11}$/.test(onlyNumbers(formData.phone)))
            newErrors.phone = "Telefone inválido (10 ou 11 dígitos)";

        if (formData.cpf && adopterList.some(a => a.cpf === formData.cpf && a.id !== id))
            newErrors.cpf = "CPF já cadastrado";
        if (formData.rg && adopterList.some(a => a.rg === formData.rg && a.id !== id))
            newErrors.rg = "RG já cadastrado";
        if (formData.email && adopterList.some(a => a.email === formData.email && a.id !== id))
            newErrors.email = "Email já cadastrado";
        if (formData.phone && adopterList.some(a => a.phone === formData.phone && a.id !== id))
            newErrors.phone = "Telefone já cadastrado";


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const isValid = await validate();
            if (!isValid) {
                toast.error("Preencha todos os campos corretamente.");
                return;
            }
            if (id) await updateAdopterById(id, formData);
            else await registerAdopter(formData);
            toast.success(`Adotante ${id ? "atualizado" : "cadastrado"} com sucesso!`);
            setFormData({
                name: "",
                email: "",
                phone: "",
                sex: "",
                notes: "",
                rg: "",
                cpf: "",
                maritalStatus: "",
                state: "",
                city: "",
                district: "",
                street: "",
                number: "",
                complement: "",
                cep: "",
                hasPets: false,
            });
        } catch {
            toast.error("Erro ao salvar adotante.");
        } finally {
            setLoading(false);
        }
    };

    const inputModern = (error?: boolean) =>
        `w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:outline-none transition placeholder-gray-400 text-gray-800 ` +
        (error
            ? "border-2 border-red-500 focus:ring-red-500 bg-red-50"
            : "bg-gray-100/70 focus:ring-green-500");

    const errorStyle = "text-sm text-red-500 mt-1";
    const ErrorMessage = ({ message }: { message?: string }) =>
        message ? <span className={errorStyle}>{message}</span> : null;

    return (
        <div className="min-h-screen flex flex-col items-center px-4 py-10 bg-gray-100">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-10 flex items-center gap-2 text-center"
            >
                <UserCheck className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />{" "}
                Cadastro de Adotantes
            </motion.h1>

            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white w-full max-w-5xl rounded-3xl shadow-xl p-6 md:p-10 space-y-8"
            >
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Informações Pessoais
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Nome</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={inputModern(!!errors.name)}
                            />
                            <ErrorMessage message={errors.name} />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={inputModern(!!errors.email)}
                                placeholder="exemplo@email.com"
                            />
                            <ErrorMessage message={errors.email} />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">RG</label>
                            <input
                                type="text"
                                name="rg"
                                value={formData.rg}
                                onChange={handleChange}
                                className={inputModern(!!errors.rg)}
                            />
                            <ErrorMessage message={errors.rg} />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">CPF</label>
                            <input
                                type="text"
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleChange}
                                className={inputModern(!!errors.cpf)}
                            />
                            <ErrorMessage message={errors.cpf} />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">
                                Estado Civil
                            </label>
                            <select
                                name="maritalStatus"
                                value={formData.maritalStatus}
                                onChange={handleChange}
                                className={inputModern(!!errors.maritalStatus)}
                            >
                                <option value="">Selecione</option>
                                <option value="Solteiro(a)">Solteiro(a)</option>
                                <option value="Casado(a)">Casado(a)</option>
                                <option value="Divorciado(a)">Divorciado(a)</option>
                                <option value="Viúvo(a)">Viúvo(a)</option>
                            </select>
                            <ErrorMessage message={errors.maritalStatus} />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Estado</label>
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className={inputModern(!!errors.state)}
                            >
                                <option value="">Selecione</option>
                                <option value="SP">São Paulo</option>
                                <option value="RJ">Rio de Janeiro</option>
                            </select>
                            <ErrorMessage message={errors.state} />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Cidade</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={inputModern(!!errors.city)}
                            />
                            <ErrorMessage message={errors.city} />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Bairro</label>
                            <input
                                type="text"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                className={inputModern(!!errors.district)}
                            />
                            <ErrorMessage message={errors.district} />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Rua</label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                className={inputModern(!!errors.street)}
                            />
                            <ErrorMessage message={errors.street} />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Número</label>
                            <input
                                type="text"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                className={inputModern(!!errors.number)}
                            />
                            <ErrorMessage message={errors.number} />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Complemento</label>
                            <input
                                type="text"
                                name="complement"
                                value={formData.complement}
                                onChange={handleChange}
                                className={inputModern(!!errors.complement)}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">CEP</label>
                            <input
                                type="text"
                                name="cep"
                                value={formData.cep}
                                onChange={handleChange}
                                className={inputModern(!!errors.cep)}
                            />
                            <ErrorMessage message={errors.cep} />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Telefone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={inputModern(!!errors.phone)}
                            />
                            <ErrorMessage message={errors.phone} />
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Gênero</label>
                            <select
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                className={inputModern(!!errors.sex)}
                            >
                                <option value="">Selecione</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                            </select>
                            <ErrorMessage message={errors.sex} />
                        </div>

                        <div className="flex flex-col justify-end">
                            <label className="mb-1 font-medium text-gray-700">Possui animais?</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="hasPets"
                                        checked={formData.hasPets}
                                        onChange={() => setFormData({...formData, hasPets: true})}
                                    />
                                    Sim
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="hasPets"
                                        checked={!formData.hasPets}
                                        onChange={() => setFormData({...formData, hasPets: false})}
                                    />
                                    Não
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex flex-col">
                    <label className="text-lg font-semibold text-gray-700 mb-2">
                        Observações
                    </label>
                    <textarea
                        rows={4}
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className={inputModern(!!errors.notes) + " resize-none"}
                        placeholder="Alguma observação sobre o adotante..."
                    />
                    <ErrorMessage message={errors.notes} />
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => navigate("/adopterList")}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-600 text-white shadow hover:bg-gray-700 transition font-medium"
                    >
                        Cadastrados
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:from-green-600 hover:to-green-800 transition font-medium"
                    >
                        {loading ? "Salvando..." : <><Save className="w-5 h-5" /> {id ? "Atualizar" : "Cadastrar"}</>}
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
}
