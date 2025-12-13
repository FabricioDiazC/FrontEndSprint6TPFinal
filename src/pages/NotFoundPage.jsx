import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center relative overflow-hidden text-center p-4">
            <div className="absolute opacity-5 pointer-events-none animate-spin-slow">
                <svg width="600" height="600" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="black" strokeWidth="5" fill="none" />
                    <line x1="5" y1="50" x2="95" y2="50" stroke="black" strokeWidth="5" />
                    <circle cx="50" cy="50" r="15" stroke="black" strokeWidth="5" fill="black" />
                </svg>
            </div>


            <div className="relative z-10 flex flex-col items-center">
                <h1 className="text-9xl font-black text-gray-200 select-none">404</h1>
                <div className="-mt-16 mb-6">
                    <img 
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/54.gif" 
                        alt="Psyduck Confundido" 
                        className="w-40 h-40 object-contain mx-auto drop-shadow-xl"
                    />
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Parece que hubo un problema
                </h2>
                
                <p className="text-gray-500 mb-8 max-w-md">
                    La página que buscas no se encuentra o no existe
                </p>

                <Link 
                    to="/" 
                    className="bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 hover:scale-105 transition transform flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Volver a ver la pokedex
                </Link>
            </div>
        </div>
    );
}