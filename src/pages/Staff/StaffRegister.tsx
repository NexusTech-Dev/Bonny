import React, {useState, useEffect, type ChangeEvent} from "react";
import {motion} from "framer-motion";
import {UserStar, Save, Upload} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {registerStaff, getStaff, updateStaffById} from "../../services/staffService.ts";

export default function StaffRegister() {
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        sex: "",
        role: "",
        notes: "",
    });

    useEffect(() => {
        if (id) loadStaff();
    }, [id]);

    const loadStaff = async () => {
        setLoading(true);
        try {
            const staffList = await getStaff();
            const staff = staffList.find((s) => s.id === id);
            if (!staff) {
                toast.error("Funcionário não encontrado");
                return;
            }
            setFormData({
                name: staff.name,
                email: staff.email,
                phone: staff.phone,
                sex: staff.sex,
                role: (staff as any).role || "",
                notes: (staff as any).notes || "",
            });
            if (staff.image) setPreview(staff.image);
        } catch {
            toast.error("Erro ao carregar funcionário.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        setErrors({...errors, [name]: ""});
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setImageFile(file);
            setErrors({...errors, image: ""});
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        ["name", "email", "phone", "sex", "role"].forEach((field) => {
            if (!formData[field as keyof typeof formData]) newErrors[field] = "Campo obrigatório";
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            if (id) await updateStaffById(id, formData, imageFile || undefined);
            else await registerStaff(formData, imageFile || undefined);

            toast.success(`Funcionário ${id ? "atualizado" : "cadastrado"} com sucesso!`);
            setFormData({
                name: "",
                email: "",
                phone: "",
                sex: "",
                role: "",
                notes: "",
            })
        } catch {
            toast.error("Erro ao salvar funcionário.");
        } finally {
            setLoading(false);
        }
    };

    const inputModern = (error?: boolean) =>
        `w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:outline-none transition placeholder-gray-400 text-gray-800 ` +
        (error
            ? "border-2 border-red-500 focus:ring-red-500 bg-red-50"
            : "bg-gray-100/70 focus:ring-blue-500");

    const errorStyle = "text-sm text-red-500 mt-1";

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

    return (
        <div className="min-h-screen flex flex-col items-center px-4 py-10 bg-gray-100">
            <motion.h1
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
                className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-10 flex items-center gap-2 text-center"
            >
                <UserStar className="w-7 h-7 md:w-8 md:h-8 text-blue-600"/> Cadastro de Funcionários
            </motion.h1>

            <motion.form
                onSubmit={handleSubmit}
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.6}}
                className="bg-white w-full max-w-5xl rounded-3xl shadow-xl p-6 md:p-10 space-y-8"
            >
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Informações Pessoais</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Nome</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                   className={inputModern(!!errors.name)}/>
                            {errors.name && <span className={errorStyle}>{errors.name}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">E-mail</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange}
                                   className={inputModern(!!errors.email)}/>
                            {errors.email && <span className={errorStyle}>{errors.email}</span>}
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Telefone</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                   className={inputModern(!!errors.phone)}/>
                            {errors.phone && <span className={errorStyle}>{errors.phone}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Sexo</label>
                            <select
                                name="sex"
                                value={formData.sex}
                                onChange={handleChange}
                                className={inputModern(!!errors.sex)}
                            >
                                <option value="">Selecione o gênero</option>
                                <option value="Masculino">Homem</option>
                                <option value="Feminino">Mulher</option>
                                <option value="Outro">Outro</option>
                            </select>
                            {errors.sex && <span className={errorStyle}>{errors.sex}</span>}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Cargo</label>
                            <select name="role" value={formData.role} onChange={handleChange}
                                    className={inputModern(!!errors.role)}>
                                <option value="">Selecione o cargo</option>
                                {roles.map((role) => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                            {errors.role && <span className={errorStyle}>{errors.role}</span>}
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex flex-col">
                        <label className="text-lg font-semibold text-gray-700 mb-2">Observações</label>
                        <textarea
                            rows={4}
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className={inputModern(!!errors.notes) + " resize-none"}
                        />
                        {errors.notes && <span className={errorStyle}>{errors.notes}</span>}
                    </div>
                </section>

                <div className="flex flex-col items-center">
                    <label
                        className={`cursor-pointer flex flex-col items-center justify-center w-40 sm:w-48 h-32 sm:h-36 rounded-2xl
                        ${preview ? "border-0" : "border-2 border-dashed border-blue-400"}
                        bg-blue-50 hover:bg-blue-100 transition relative overflow-hidden`}
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-2xl"/>
                        ) : (
                            <div className="flex flex-col items-center">
                                <Upload className="w-7 h-7 text-blue-500 mb-2"/>
                                <span className="text-xs sm:text-sm text-blue-600 font-medium">Adicionar imagem</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange}/>
                    </label>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <motion.button
                        whileTap={{scale: 0.95}}
                        type="button"
                        onClick={() => navigate("/staffList")}
                        className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gray-600 text-white shadow hover:bg-gray-700 transition font-medium"
                    >
                        Cadastrados
                    </motion.button>

                    <motion.button
                        whileTap={{scale: 0.95}}
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-2xl shadow-lg hover:from-green-600 hover:to-green-800 transition font-medium"
                    >
                        {loading ? "Salvando..." : <><Save className="w-5 h-5"/> Cadastrar</>}
                    </motion.button>
                </div>
            </motion.form>
        </div>
    );
}
