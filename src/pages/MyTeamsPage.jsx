import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import TeamList from '../components/TeamList';
import Swal from 'sweetalert2';

export default function MyTeamsPage() {
    const [teams, setTeams] = useState([]);
    const { register, handleSubmit, reset } = useForm();
    const { user } = useAuth();

    const loadTeams = async () => {
        try {
            const res = await api.get('/teams');
            setTeams(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { loadTeams(); }, []);

    const createTeam = async (data) => {
        try {
            await api.post('/teams', { name: data.name, pokemons: [] });
            toast.success('Equipo creado');
            reset();
            loadTeams();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creando equipo');
        }
    };

  
    const handleDeleteOne = async (teamId, teamName) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar el equipo "${teamName}". Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', 
            cancelButtonColor: '#6b7280', 
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#fff',
            customClass: {
                popup: 'rounded-xl shadow-xl'
            }
        });


        if (result.isConfirmed) {
            try {
                await api.delete(`/teams/${teamId}`);
                toast.success('Equipo eliminado correctamente');
                loadTeams();
            } catch {
                toast.error('No se pudo eliminar el equipo');
            }
        }
    };


    const handleDeleteAll = async () => {
        const result = await Swal.fire({
            title: '⚠️ ¿BORRAR TODO?',
            html: "Estás a punto de eliminar <b>TODOS</b> tus equipos.<br>¡Perderás todos tus Pokémones capturados!",
            icon: 'error', 
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '¡Sí, borrar todo!',
            cancelButtonText: 'No, cancelar'
        });

        if (result.isConfirmed) {
            try {
                await api.delete('/teams');
                Swal.fire(
                    '¡Borrado!',
                    'Se borraron todos tus equipos.',
                    'success'
                );
                
                loadTeams();
            } catch {
                toast.error('Error al eliminar equipos');
            }
        }
    };


    const isAdmin = user?.role?.name === 'admin';
    const canCreate = isAdmin || teams.length < 2;

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Mis Equipos Pokémon</h1>
                <div className="flex items-center gap-4">
                    <span className="bg-gray-200 px-3 py-1 rounded text-sm font-semibold">
                        Equipos: {teams.length} / {isAdmin ? '∞' : '2'}
                    </span>
                    {teams.length > 0 && (
                        <button 
                            onClick={handleDeleteAll}
                            className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm font-bold border border-red-200 hover:bg-red-600 hover:text-white transition"
                        >
                            🗑️ Borrar Todos
                        </button>
                    )}
                </div>
            </div>

           
            <div className={`bg-white p-6 rounded-lg shadow-md mb-8 transition-opacity ${!canCreate ? 'opacity-50' : ''}`}>
                {!canCreate && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 text-sm" role="alert">
                        <b>Límite Alcanzado:</b> Elimina un equipo para crear uno nuevo.
                    </div>
                )}
                <form onSubmit={handleSubmit(createTeam)} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-bold mb-1 text-gray-700">Nuevo Equipo</label>
                        <input 
                            {...register('name')} 
                            placeholder={canCreate ? "Ej: Equipo Fuego" : "Límite alcanzado"} 
                            className="w-full border p-2 rounded disabled:bg-gray-100" 
                            required 
                            disabled={!canCreate}
                        />
                    </div>
                    <button 
                        className={`px-6 py-2 rounded font-bold text-white transition ${canCreate ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
                        disabled={!canCreate}
                    >
                        Crear
                    </button>
                </form>
            </div>

           
            <TeamList 
                teams={teams} 
                onDeleteOne={handleDeleteOne} 
            />

        </div>
    );
}