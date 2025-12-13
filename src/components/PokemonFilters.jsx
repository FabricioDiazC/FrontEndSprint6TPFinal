import React from 'react';


const POKEMON_TYPES = [
    "normal", "fire", "water", "grass", "electric", "ice", "fighting", 
    "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", 
    "dragon", "steel", "dark", "fairy"
];

const GENERATIONS = [1, 2, 3, 4, 5];

export default function PokemonFilters({ filters, onChange, onClear }) {
    
    
    const handleChange = (key, value) => {
        onChange(key, value);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md mb-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                
                
                <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                    <input 
                        type="text"
                        placeholder="Buscar..."
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
                        value={filters.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                </div>

                
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tipo Elemental</label>
                    <select 
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500 outline-none capitalize"
                        value={filters.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                    >
                        <option value="">Todos los tipos</option>
                        {POKEMON_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Generación</label>
                    <select 
                        className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
                        value={filters.generation}
                        onChange={(e) => handleChange('generation', e.target.value)}
                    >
                        <option value="">Todas (1-5)</option>
                        {GENERATIONS.map(gen => (
                            <option key={gen} value={gen}>Gen {gen}</option>
                        ))}
                    </select>
                </div>

                
                <div>
                    <button 
                        onClick={onClear}
                        className="w-full bg-gray-200 text-gray-700 py-2 rounded font-bold hover:bg-gray-300 transition"
                    >
                        Limpiar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
}