import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="bg-red-600 text-white p-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto">
                
                
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-black tracking-tighter hover:scale-105 transition" onClick={closeMenu}>
                        PokeBuilder
                    </Link>

                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden focus:outline-none hover:bg-red-700 p-2 rounded"
                    >
                        {isOpen ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>

                    <div className="hidden md:flex gap-4 items-center">
                        <NavLinks user={user} logout={logout} />
                    </div>
                </div>

                {/* MENÚ MÓVIL */}
                {isOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-red-500 animate-fade-in flex flex-col space-y-3">
                        <NavLinks user={user} logout={logout} isMobile={true} closeMenu={closeMenu} />
                    </div>
                )}
            </div>
        </nav>
    );
}


function NavLinks({ user, logout, isMobile = false, closeMenu }) {
    
    const linkClass = isMobile 
        ? "block py-2 px-4 hover:bg-red-700 rounded transition font-semibold"
        : "hover:text-yellow-300 transition font-semibold";

    
    const adminBadgeClass = "bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold ml-2 shadow-sm align-middle";

    return (
        <>
            {user ? (
                <>
                    <Link to="/pokedex" className={linkClass} onClick={closeMenu}>Pokedex</Link>
                    <Link to="/teams" className={linkClass} onClick={closeMenu}>Mis Equipos</Link>
                    <Link to="/battle" className={linkClass} onClick={closeMenu}> Arena</Link>
                    
                    

                    {isMobile && <hr className="border-red-400 my-2" />}

                    <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center gap-4'}`}>
                        <Link to="/profile" className="flex items-center gap-2 hover:bg-red-700 p-1 rounded transition" onClick={closeMenu}>
                            <img 
                                src={user.avatar || "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif"} 
                                className="w-8 h-8 bg-white rounded-full border border-gray-300 object-contain" 
                                alt="avatar"
                            />
                            
                            
                            <div className="flex items-center">
                                <span className="font-light truncate max-w-[150px]">{user.username}</span>
                                
                                
                                {user.role?.name === 'admin' && (
                                    <span className={adminBadgeClass}>
                                        Admin
                                    </span>
                                )}
                            </div>
                        </Link>

                        <button 
                            onClick={() => { logout(); closeMenu && closeMenu(); }}
                            className={`${isMobile ? 'w-full text-left' : ''} bg-white text-red-600 px-3 py-1 rounded font-bold hover:bg-gray-200 transition`}
                        >
                            Salir
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <Link to="/login" className={linkClass} onClick={closeMenu}>Login</Link>
                    <Link to="/register" className={linkClass} onClick={closeMenu}>Registro</Link>
                </>
            )}
        </>
    );
}