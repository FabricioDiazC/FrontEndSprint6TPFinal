import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';


const AVATARS = [
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif", 
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/6.gif",  
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/94.gif", 
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/150.gif", 
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/133.gif", 
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/448.gif", 
];

export default function ProfilePage() {
    const { user, setUser } = useAuth(); 
    const { register, handleSubmit, setValue, watch } = useForm();
    const [myTeams, setMyTeams] = useState([]);
    const [fullProfile, setFullProfile] = useState(null);

    
    const selectedAvatar = watch('avatar');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            
            const profileRes = await api.get('/users/profile');
            setFullProfile(profileRes.data);
            
            
            setValue('username', profileRes.data.username);
            setValue('avatar', profileRes.data.avatar);
            setValue('favoriteTeam', profileRes.data.favoriteTeam?._id || '');

            
            const teamsRes = await api.get('/teams');
            setMyTeams(teamsRes.data);
        } catch (error) {
            toast.error("Error cargando perfil");
        }
    };

    const onSubmit = async (data) => {
        try {
            const res = await api.put('/users/profile', data);
            toast.success("Perfil actualizado");
            
            
            setFullProfile(prev => ({ ...prev, ...res.data })); 
            

            const updatedUserForContext = { ...user, ...res.data };
            localStorage.setItem('user', JSON.stringify(updatedUserForContext));
            setUser(updatedUserForContext); 

            
            loadData();

        } catch (error) {
            toast.error("Error al guardar cambios");
        }
    };

    if (!fullProfile) return <div className="text-center mt-10">Cargando perfil...</div>;

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-4xl font-black text-center mb-8 uppercase tracking-widest text-gray-800">
                Tarjeta de Entrenador
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                
                <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Editar Info</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Apodo / Usuario</label>
                            <input {...register('username')} className="w-full border p-2 rounded" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Elige tu Avatar</label>
                            <div className="grid grid-cols-3 gap-2">
                                {AVATARS.map((url) => (
                                    <img 
                                        key={url}
                                        src={url} 
                                        onClick={() => setValue('avatar', url)}
                                        className={`w-12 h-12 cursor-pointer border-2 rounded-full p-1 hover:bg-gray-100 ${selectedAvatar === url ? 'border-red-500 bg-red-50' : 'border-transparent'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700">Equipo Insignia</label>
                            <select {...register('favoriteTeam')} className="w-full border p-2 rounded">
                                <option value="">-- Ninguno --</option>
                                {myTeams.map(t => (
                                    <option key={t._id} value={t._id}>{t.name}</option>
                                ))}
                            </select>
                        </div>

                        <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
                            Guardar Cambios
                        </button>
                    </form>
                </div>

                
                <div className="md:col-span-2">
                    
                    <div className="bg-linear-to-br from-red-600 to-red-800 rounded-2xl p-1 shadow-2xl transform hover:scale-[1.01] transition duration-500">
                        <div className="bg-white rounded-xl p-6 h-full relative overflow-hidden">
                            
                            
                            <div className="absolute -right-10 -top-10 text-gray-100 opacity-50 pointer-events-none">
                                <svg width="300" height="300" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="10" fill="none" />
                                    <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="10" />
                                    <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="10" fill="white" />
                                </svg>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                                
                                <div className="w-32 h-32 rounded-full border-4 border-yellow-400 bg-gray-100 flex items-center justify-center shadow-lg">
                                    <img src={fullProfile.avatar} alt="Avatar" className="w-24 h-24 object-contain" />
                                </div>

                                <div className="text-center sm:text-left">
                                    <p className="text-gray-500 text-sm font-bold tracking-widest uppercase">Entrenador Pokémon</p>
                                    <h2 className="text-4xl font-black text-gray-800">{fullProfile.username}</h2>
                                    <p className="text-gray-400 mt-1">{fullProfile.email}</p>
                                    <p className="mt-2 text-sm bg-gray-200 inline-block px-2 py-1 rounded">
                                        ID: {fullProfile._id.slice(-6).toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            
                            <div className="mt-8 border-t-2 border-dashed border-gray-300 pt-6">
                                <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                                    ⭐ Equipo Insignia
                                </h3>

                                {fullProfile.favoriteTeam ? (
                                    <div key={fullProfile.favoriteTeam._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="font-bold text-lg">{fullProfile.favoriteTeam.name}</span>
                                            <span className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full font-bold">CHAMPION</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            {fullProfile.favoriteTeam.pokemons?.map((poke,index) => (
                                                <div key={`${poke._id}-${index}`} className="flex flex-col items-center">
                                                    <img src={poke.sprite} alt={poke.name} className="w-12 h-12 hover:-translate-y-1 transition" />
                                                </div>
                                            ))}
                                            
                                            {[...Array(6 - (fullProfile.favoriteTeam.pokemons?.length || 0))].map((_, i) => (
                                                <div key={i} className="w-10 h-10 rounded-full bg-gray-200 opacity-30"></div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-400 py-4 italic border-2 border-dashed rounded-lg">
                                        No has seleccionado un equipo favorito aún.
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}