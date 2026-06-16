import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../landing/components/NavBar";

export default function PatientTopBar() {
    const [menuOpen, setMenuOpen] = useState(false);

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
                        to="/calendar"
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
                        to="/profile"
                        className="
                            font-medium
                            text-text-muted
                            hover:text-primary
                            transition-colors
                        "
                    >
                        Perfil
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
                            to="/search"
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
                            to="/calendar"
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
                            to="/profile"
                            className="
                                rounded-lg px-4 py-3
                                text-text
                                hover:bg-surface-alt
                                transition
                            "
                        >
                            Perfil
                        </Link>

                        <button
                            className="
                                mt-2 rounded-lg px-4 py-3
                                bg-danger
                                text-white
                            "
                        >
                            Salir
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}