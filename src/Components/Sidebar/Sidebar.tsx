import {
    LayoutDashboard,
    Briefcase,
    Archive,
    FileText,
    Menu,
    X,
    LogOut,
    PawPrint,
} from "lucide-react";
import { useEffect, useState } from "react";

function SideBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showToggleButton, setShowToggleButton] = useState(true);

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { id: "animals", label: "Animais", icon: PawPrint, href: "/animals" },
        { id: "staff", label: "Funcionários", icon: Briefcase, href: "/staff" },
        { id: "vaccines", label: "Vacinas", icon: Archive, href: "/vaccines" },
        { id: "adoptions", label: "Adoções", icon: FileText, href: "/adoptions" },
    ];

    useEffect(() => {
        if (!isOpen) {
            const timeout = setTimeout(() => setShowToggleButton(true), 220);
            return () => clearTimeout(timeout);
        } else {
            setShowToggleButton(false);
        }
    }, [isOpen]);

    return (
        <>
            {/* Overlay no mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-full w-64 
                bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400 
                text-white shadow-2xl px-6 py-6 flex flex-col justify-between
                rounded-br-3xl rounded-tr-3xl transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                lg:static lg:translate-x-0`}
            >
                {/* Topo */}
                <div>
                    <button
                        className="lg:hidden mb-6"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Logo */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-md mb-3">
                            <PawPrint className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-wide">
                            Pet<span className="text-yellow-300">Control</span>
                        </h1>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-col gap-3">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium
                                    hover:bg-white/10 hover:backdrop-blur-sm transition group"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Icon className="w-5 h-5 text-yellow-300 group-hover:scale-110 transition" />
                                    {item.label}
                                </a>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout */}
                <div className="mt-6">
                    <button
                        onClick={() => alert("Logout futuramente")}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-red-500 transition"
                    >
                        <LogOut className="w-5 h-5 text-white" />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Botão toggle no mobile */}
            {showToggleButton && !isOpen && (
                <div className="lg:hidden absolute top-4 left-4 z-50">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-2 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                        <Menu className="w-6 h-6 text-white" />
                    </button>
                </div>
            )}
        </>
    );
}

export default SideBar;
