import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "../landing/components/NavBar";
import { useAuth } from "../auth/providers/AuthProvider";
import { usePendingAppointments } from "@/features/payment";
import { ShoppingCart } from "lucide-react";

export default function PatientTopBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { data: pendingAppointments } = usePendingAppointments();
    const pendingCount = pendingAppointments?.length || 0;
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
                        to="/patient/search"
                        className="
                            font-medium
                            text-text-muted
                            hover:text-primary
                            transition-colors
                        "
                    >
                        Buscador
                    </Link>

                    <Link
                        to="/patient/calendar"
                        className="
                            font-medium
                            text-text-muted
                            hover:text-primary
                            transition-colors
                        "
                    >
                        Calendario
                    </Link>

                    <Link
                        to="/patient/profile"
                        className="
                            font-medium
                            text-text-muted
                            hover:text-primary
                            transition-colors
                        "
                    >
                        Perfil
                    </Link>

                    <Link
                        to="/patient/medical-records"
                        className="
                            font-medium
                            text-text-muted
                            hover:text-primary
                            transition-colors
                        "
                    >
                        Registros
                    </Link>

                    <Link
                        to="/patient/prescriptions"
                        className="
                            font-medium
                            text-text-muted
                            hover:text-primary
                            transition-colors
                        "
                    >
                        Recetas
                    </Link>

                    <Link
                        to="/patient/cart"
                        className="
                            relative
                            font-medium
                            text-text-muted
                            hover:text-primary
                            transition-colors
                        "
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {pendingCount > 0 && (
                            <span className="
                                absolute -top-2 -right-2
                                bg-danger text-white text-xs
                                rounded-full h-5 w-5
                                flex items-center justify-center
                                font-bold
                            ">
                                {pendingCount > 9 ? "9+" : pendingCount}
                            </span>
                        )}
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

                {/* Hamburger */}
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
                            to="/patient/search"
                            className="
                                rounded-lg px-4 py-3
                                text-text
                                hover:bg-surface-alt
                                transition
                            "
                        >
                            Buscador
                        </Link>

                        <Link
                            to="/patient/calendar"
                            className="
                                rounded-lg px-4 py-3
                                text-text
                                hover:bg-surface-alt
                                transition
                            "
                        >
                            Calendario
                        </Link>

                        <Link
                            to="/patient/profile"
                            className="
                                rounded-lg px-4 py-3
                                text-text
                                hover:bg-surface-alt
                                transition
                            "
                        >
                            Perfil
                        </Link>

                        <Link
                            to="/patient/medical-records"
                            className="
                                rounded-lg px-4 py-3
                                text-text
                                hover:bg-surface-alt
                                transition
                            "
                        >
                            Registros
                        </Link>

                        <Link
                            to="/patient/prescriptions"
                            className="
                                rounded-lg px-4 py-3
                                text-text
                                hover:bg-surface-alt
                                transition
                            "
                        >
                            Recetas
                        </Link>

                        <Link
                            to="/patient/cart"
                            className="
                                rounded-lg px-4 py-3
                                text-text
                                hover:bg-surface-alt
                                transition
                                flex items-center justify-between
                            "
                        >
                            <span className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Carrito
                            </span>
                            {pendingCount > 0 && (
                                <span className="
                                    bg-danger text-white text-xs
                                    rounded-full h-5 w-5
                                    flex items-center justify-center
                                    font-bold
                                ">
                                    {pendingCount > 9 ? "9+" : pendingCount}
                                </span>
                            )}
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