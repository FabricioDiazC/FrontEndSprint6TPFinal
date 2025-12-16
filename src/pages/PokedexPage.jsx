import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import PokemonFilters from '../components/PokemonFilters'; 
import PokemonGrid from '../components/PokemonGrid';

export default function PokedexPage() {

    const [pokemons, setPokemons] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    const [filters, setFilters] = useState({ name: '', type: '', generation: '' });
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [addingId, setAddingId] = useState(null);

    const currentTeamObj = teams.find(t => t._id === selectedTeam);
    const isTeamFull = currentTeamObj?.pokemons?.length === 6;


    useEffect(() => { loadPokemons(); }, [page, filters]);
    useEffect(() => { loadTeams(); }, []);


    const loadPokemons = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/pokemons', {
                params: {
                    page,
                    limit: 20,
                    ...filters 
                }
            });
            setPokemons(res.data.pokemons);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error(error);
            toast.error("Error cargando la Pokedex");
        } finally {
            setIsLoading(false);
        }
    };

    const loadTeams = async () => {
        try {
            const res = await api.get('/teams');
            setTeams(res.data);
        } catch {
            console.error("Error cargando equipos");
        }
    };


    const addToTeam = async (pokemonId) => {
        if(!selectedTeam) return toast.warning('Selecciona un equipo primero');
        setAddingId(pokemonId);
        try {
            await api.put(`/teams/${selectedTeam}/add`, { pokemonId });
            toast.success('¡Pokémon añadido al equipo!');
            await loadTeams(); 
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al agregar');
        }finally {
            setAddingId(null);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleClearFilters = () => {
        setFilters({ name: '', type: '', generation: '' });
        setPage(1);
    };

    
    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-4xl font-black text-red-600 tracking-tighter uppercase drop-shadow-sm">
                    Pokedex Nacional
                </h1>
                
                <div className="flex items-center gap-2 bg-white p-2 rounded shadow-sm border">
                    <span className="text-sm font-bold text-gray-500">Capturar para:</span>
                    <select 
                        className="p-1 outline-none font-semibold text-blue-600 bg-transparent" 
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        value={selectedTeam}
                    >
                        <option value="">-- Elige Equipo --</option>
                        {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                </div>
            </div>

            
            <PokemonFilters 
                filters={filters} 
                onChange={handleFilterChange} 
                onClear={handleClearFilters} 
            />

            
            <PokemonGrid 
                pokemons={pokemons}
                isLoading={isLoading}
                selectedTeam={selectedTeam}
                onAddToTeam={addToTeam}
                onClearFilters={handleClearFilters}
                addingId={addingId}
                isTeamFull={isTeamFull}
            />

            
            {!isLoading && pokemons.length > 0 && (
                <div className="flex justify-center mt-10 gap-4 items-center">
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))} 
                        disabled={page === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 font-bold"
                    >
                        Anterior
                    </button>
                    
                    <span className="font-mono text-lg bg-white px-4 py-2 rounded border">
                        {page} / {totalPages}
                    </span>
                    
                    <button 
                        onClick={() => setPage(p => p + 1)} 
                        disabled={page >= totalPages}
                        className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 font-bold"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}