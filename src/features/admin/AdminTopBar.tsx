import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { Logo } from "../landing/components/NavBar";
import { useAuth } from "../auth/providers/AuthProvider";

function AdminTopBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    return (
        <nav className="
            sticky top-0 z-50
            bg-surface
            border-b
            border-surface-alt
            shadow-sm
        ">
            <div className="mx-auto flex h-16 items-center justify-between px-4 lg:px-8">

                <Link
                    to="/"
                    className="
                        text-xl font-bold
                        text-primary)]
                        hover:text-primary-dark
                        transition-colors
                    "
                >
                    <Logo />
                </Link>

                <div className="hidden md:flex items-center gap-8">

                    <Link
                        to="/admin"
                        className="
                            font-medium
                            text-text-muted
                            hover:text-primary
                            transition-colors
                        "
                    >
                        Inicio
                    </Link>

                    <Link
                        to="/admin/search"
                        className="
                            font-medium
                            text-text-muted
                            hover:text-primary
                            transition-colors
                        "
                    >
                        Buscar
                    </Link>

                    <Link
                        to="/admin/employee"
                        className="
                            font-medium
                            text-text-muted
                            hover:text-primary
                            transition-colors
                        "
                    >
                        Crear
                    </Link>

                    <Link
                        to="/admin/specialties"
                        className="
                            font-medium
                            text-text-muted
                            hover:text-primary
                            transition-colors
                        "
                    >
                        Especialidades
                    </Link>

                    <button
                        className="
                            rounded-lg px-4 py-2
                            bg-danger
                            text-white
                            hover:opacity-90
                            transition
                            cursor-pointer
                        "
                        onClick={() => handleLogout()}
                    >
                        Salir
                    </button>
                </div>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="
                        md:hidden
                        p-2 rounded-lg
                        text-primary
                        hover:bg-surface-alt
                        transition
                    "
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {menuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {menuOpen && (
                <div
                    className="
                        md:hidden
                        border-t
                        border-surface-alt
                        bg-surface
                    "
                >
                    <div className="flex flex-col p-3">

                        <Link
                            to="/admin"
                            className="
                                rounded-lg px-4 py-3
                                text-text
                                hover:bg-surface-alt
                                transition
                            "
                        >
                            Inicio
                        </Link>

                        <Link
                            to="/admin/search"
                            className="
                                rounded-lg px-4 py-3
                                text-text
                                hover:bg-surface-alt
                                transition
                            "
                        >
                            Buscador
                        </Link>

                        <button
                            className="
                                mt-2 rounded-lg px-4 py-3
                                bg-danger
                                text-white
                            "
                            onClick={() => handleLogout()}
                        >
                            Salir
                        </button>
                    </div>
                </div>
            )}
            <Outlet />
        </nav>
    );
}

export default AdminTopBar;