import React from 'react';


const TYPE_COLORS = {
    normal:   'bg-gray-400 text-white',
    fire:     'bg-orange-500 text-white',
    water:    'bg-blue-500 text-white',
    grass:    'bg-green-500 text-white',
    electric: 'bg-yellow-400 text-white', 
    ice:      'bg-cyan-400 text-white',     
    fighting: 'bg-red-700 text-white',
    poison:   'bg-purple-500 text-white',
    ground:   'bg-yellow-700 text-white',
    flying:   'bg-indigo-400 text-white',
    psychic:  'bg-pink-500 text-white',
    bug:      'bg-lime-600 text-white',
    rock:     'bg-stone-500 text-white',
    ghost:    'bg-purple-800 text-white',
    dragon:   'bg-violet-600 text-white',
    steel:    'bg-slate-400 text-white',
    dark:     'bg-gray-800 text-white',
    fairy:    'bg-pink-400 text-white',
    unknown:  'bg-gray-400 text-white'
};

export default function PokemonGrid({ pokemons, isLoading, selectedTeam, onAddToTeam, onClearFilters }) {
    
    
    if (isLoading) {
        return (
            <div className="text-center py-20 text-gray-500 text-xl font-bold animate-pulse">
                Cargando Pokémones...
            </div>
        );
    }

    
    if (pokemons.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-100 rounded-lg">
                <p className="text-xl text-gray-500">No se encontraron Pokémones con esos filtros.</p>
                {onClearFilters && (
                    <button onClick={onClearFilters} className="mt-4 text-blue-500 underline font-bold">
                        Borrar filtros
                    </button>
                )}
            </div>
        );
    }

    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {pokemons.map((poke) => (
                <div key={poke._id} className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition duration-300 border border-transparent hover:border-red-200">
                    {/* Sprite */}
                    <div className="h-24 flex items-center justify-center">
                        <img src={poke.sprite} alt={poke.name} className="h-20 w-20 object-contain" />
                    </div>
                    
                    {/* Número y Nombre */}
                    <span className="text-gray-400 text-xs font-mono font-bold">
                        #{poke.pokedexNumber.toString().padStart(3, '0')}
                    </span>
                    <h3 className="text-lg font-bold capitalize mt-1 text-gray-800">{poke.name}</h3>
                    
                    {/* Etiquetas de Tipos */}
                    <div className="flex gap-2 mt-2 mb-3">
                        {poke.types.map(t => (
                            <span 
                                key={t} 
                                className={`px-2 py-0.5 text-[10px] rounded-full capitalize font-bold shadow-sm ${TYPE_COLORS[t] || 'bg-gray-400 text-white'}`}
                            >
                                {t}
                            </span>
                        ))}
                    </div>

                    {/* Botón de Agregar al Equipo */}
                    <button 
                        onClick={() => onAddToTeam(poke._id)}
                        className={`mt-auto w-full py-1.5 rounded text-sm font-bold transition shadow-sm
                            ${selectedTeam 
                                ? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-red-200' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                        disabled={!selectedTeam}
                    >
                        {selectedTeam ? 'Capturar' : 'Elige Equipo'}
                    </button>
                </div>
            ))}
        </div>
    );
}