import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import {PawPrint} from "lucide-react";
import {loginUser} from "../services/authService.ts";
import {useAuth} from "../context/AuthContext";
import LoginSkeleton from "../Components/ProtectedSkeleton/LoginSkeleton.tsx";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const {user, loading: authLoading} = useAuth();
    const navigate = useNavigate();

    const getErrorMessage = (err: any) => {
        let code = err?.code;

        if (!code && err?.message) {
            const match = err.message.match(/auth\/[a-z-]+/);
            code = match ? match[0] : "";
        }

        switch (code) {
            case "auth/invalid-email":
                return "E-mail inválido";
            case "auth/user-not-found":
                return "Usuário não encontrado";
            case "auth/wrong-password":
                return "Senha incorreta";
            case "auth/user-disabled":
                return "Conta desativada";
            case "auth/invalid-credential":
                return "Credenciais inválidas";
            default:
                if (err?.message) {
                    return err.message.replace("Firebase: ", "").replace(/\.$/, "");
                }
                return "Erro ao fazer login";
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            navigate("/dashboard");
        }
    }, [user, authLoading, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Preencha e-mail e senha");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await loginUser(email, password);
            navigate("/dashboard");
        } catch (err: any) {
            console.log(err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <LoginSkeleton/>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <motion.div
                initial={{opacity: 0, y: 40}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.6}}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
            >
                <div className="flex items-center justify-center gap-2 mb-6">
                    <PawPrint className="w-8 h-8 text-blue-600"/>
                    <h1 className="text-2xl font-bold text-gray-800">PetControl - Sistema Interno</h1>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">E-mail</label>
                        <input
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                    <motion.button
                        type="submit"
                        whileTap={{scale: 0.95}}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-xl mt-4 shadow hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </motion.button>
                </form>

                <p className="text-sm text-gray-500 text-center mt-6">
                    Sistema exclusivo para funcionários da ONG
                </p>
            </motion.div>
        </div>
    );
}
