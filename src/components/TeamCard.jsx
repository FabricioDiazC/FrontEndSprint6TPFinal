import React from 'react';

export default function TeamCard({ team, onDelete }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 relative group hover:shadow-lg transition">
            
            {/* Cabecera: Nombre y Botón Borrar */}
            <div className="flex justify-between items-start mb-4 pb-2 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">{team.name}</h2>
                
                <button 
                    onClick={() => onDelete(team._id, team.name)}
                    className="text-gray-400 hover:text-red-500 transition p-1 rounded hover:bg-red-50"
                    title="Eliminar este equipo"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
            
            {/* Grid de Sprites */}
            <div className="flex flex-wrap gap-4 min-h-20">
                {team.pokemons.length === 0 ? (
                    <p className="text-gray-400 italic text-sm self-center">Sin Pokémones...</p> 
                ) : null}
                
                {team.pokemons.map((poke, index) => (
                    <div key={`${poke._id}-${index}`} className="text-center transform hover:scale-110 transition cursor-help relative group/poke">
                        <img src={poke.sprite} alt={poke.name} className="h-14 w-14 mx-auto object-contain" />
                        
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover/poke:opacity-100 pointer-events-none capitalize mb-1 z-10 whitespace-nowrap">
                            {poke.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}