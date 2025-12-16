import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'react-toastify';

export default function BattlePage() {
    const [myTeams, setMyTeams] = useState([]);
    const [rivalTeams, setRivalTeams] = useState([]);
    
    const [selectedMyId, setSelectedMyId] = useState('');
    const [selectedRivalId, setSelectedRivalId] = useState('');
    
    const [hasFought, setHasFought] = useState(false);
    const [battleResult, setBattleResult] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [myRes, rivalRes] = await Promise.all([
                    api.get('/teams'),
                    api.get('/teams/community')
                ]);
                setMyTeams(myRes.data);
                setRivalTeams(rivalRes.data);
            } catch {
                toast.error("Error cargando equipos");
            }
        };
        loadData();
    }, []);

    const calculateStats = (team) => {
        if (!team || !team.pokemons) return null;
        return team.pokemons.reduce((acc, poke) => {
            return {
                hp: acc.hp + poke.stats.hp,
                attack: acc.attack + poke.stats.attack,
                defense: acc.defense + poke.stats.defense,
                spAtk: acc.spAtk + poke.stats.spAtk,
                spDef: acc.spDef + poke.stats.spDef,
                speed: acc.speed + poke.stats.speed,
            };
        }, { hp: 0, attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 });
    };

    const myTeam = myTeams.find(t => t._id === selectedMyId);
    const rivalTeam = rivalTeams.find(t => t._id === selectedRivalId);

    const myStats = calculateStats(myTeam);
    const rivalStats = calculateStats(rivalTeam);

    const isMyTeamEmpty = myTeam && myTeam.pokemons.length === 0;
    const isRivalTeamEmpty = rivalTeam && rivalTeam.pokemons.length === 0;
    const canStartBattle = myTeam && rivalTeam && !isMyTeamEmpty && !isRivalTeamEmpty;


    const getChartData = () => {
        if (!myStats || !rivalStats) return [];
        
        const MAX_STAT = 1530;

        return [
            { subject: 'HP', A: myStats.hp, B: rivalStats.hp, fullMark: MAX_STAT },
            { subject: 'Ataque', A: myStats.attack, B: rivalStats.attack, fullMark: MAX_STAT },
            { subject: 'Defensa', A: myStats.defense, B: rivalStats.defense, fullMark: MAX_STAT },
            { subject: 'Velocidad', A: myStats.speed, B: rivalStats.speed, fullMark: MAX_STAT },
            { subject: 'Sp. Atk', A: myStats.spAtk, B: rivalStats.spAtk, fullMark: MAX_STAT },
            { subject: 'Sp. Def', A: myStats.spDef, B: rivalStats.spDef, fullMark: MAX_STAT },
        ];
    };

    const handleStartBattle = () => {
        if (!canStartBattle) return;
        if (!myStats || !rivalStats) return;

        const myTotal = Object.values(myStats).reduce((a, b) => a + b, 0);
        const rivalTotal = Object.values(rivalStats).reduce((a, b) => a + b, 0);

        let resultData = { winner: 'tie', diff: 0 };

        if (myTotal > rivalTotal) {
            resultData = { winner: 'me', diff: myTotal - rivalTotal };
            toast.success("¡Has ganado la batalla!");
        } else if (rivalTotal > myTotal) {
            resultData = { winner: 'rival', diff: rivalTotal - myTotal };
            toast.error("Has perdido contra el rival...");
        } else {
            toast.info("Empate técnico");
        }

        setBattleResult(resultData);
        setHasFought(true);
    };

    const handleSelectionChange = (isMyTeam, newVal) => {
        setHasFought(false);
        setBattleResult(null);
        if (isMyTeam) setSelectedMyId(newVal);
        else setSelectedRivalId(newVal);
    };

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <h1 className="text-4xl font-black text-center mb-8 text-transparent bg-clip-text bg-linear-to-r from-red-600 to-orange-500 uppercase tracking-widest drop-shadow-sm">
                 Arena de Batalla
            </h1>

            {/* Selector de equipos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Equipo del usuario dueño de la cuenta */}
                <div className={`p-6 rounded-xl border-4 transition-all ${selectedMyId ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                    <h2 className="text-xl font-bold text-blue-700 mb-4 uppercase">🔵 Mi equipo</h2>
                    <select 
                        className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => handleSelectionChange(true, e.target.value)}
                        value={selectedMyId}
                    >
                        <option value="">-- Elige a tu equipo --</option>
                        {myTeams.map(t => (
                            <option key={t._id} value={t._id}>{t.name}</option>
                        ))}
                    </select>
                    {myTeam && (
                        <div key={myTeam._id} className="mt-4 flex gap-2 justify-center flex-wrap animate-fade-in">
                            {myTeam.pokemons.length === 0 && <p className="text-red-500 font-bold text-sm">⚠️ Equipo vacío</p>}
                            {myTeam.pokemons.map((p, index) => (
                                <img key={`${p._id}-${index}`} src={p.sprite} alt={p.name} className="w-12 h-12 object-contain" />
                            ))}
                        </div>
                    )}
                </div>

                {/* Equipo rival */}
                <div className={`p-6 rounded-xl border-4 transition-all ${selectedRivalId ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'}`}>
                    <h2 className="text-xl font-bold text-red-700 mb-4 uppercase">🔴 Equipo Retador</h2>
                    <select 
                        className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
                        onChange={(e) => handleSelectionChange(false, e.target.value)}
                        value={selectedRivalId}
                    >
                        <option value="">-- Elige al equipo oponente --</option>
                        {rivalTeams.map(t => (
                            <option key={t._id} value={t._id}>{t.name} (de {t.trainer.username})</option>
                        ))}
                    </select>
                    {rivalTeam && (
                        <div key={rivalTeam._id} className="mt-4 flex gap-2 justify-center flex-wrap animate-fade-in">
                            {rivalTeam.pokemons.length === 0 && <p className="text-red-500 font-bold text-sm">⚠️ Equipo vacío</p>}
                            {rivalTeam.pokemons.map((p, index) => (
                                <img key={`${p._id}-${index}`} src={p.sprite} alt={p.name} className="w-12 h-12 object-contain" />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            
            <div className="flex flex-col items-center my-8 gap-4">
                
                
                {(isMyTeamEmpty || isRivalTeamEmpty) && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 font-bold rounded shadow-sm animate-bounce">
                        ⚠️ Se debe seleccionar un equipo que tenga al menos 1 Pokémon
                    </div>
                )}

                
                {myTeam && rivalTeam && !hasFought && (
                    <button 
                        onClick={handleStartBattle}
                        disabled={!canStartBattle}
                        className={`text-3xl font-black py-4 px-16 rounded-full shadow-lg transition-all uppercase tracking-wider
                            ${canStartBattle 
                                ? 'bg-linear-to-b from-yellow-400 to-orange-500 text-white hover:shadow-xl hover:translate-y-1 active:translate-y-2 animate-pulse cursor-pointer' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed grayscale shadow-none' 
                            }`}
                    >
                        Iniciar el combate
                    </button>
                )}
            </div>

            {/* Grafico */}
            {hasFought && myStats && rivalStats && (
                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 animate-slide-up">
                    
                    <div className={`text-center p-6 rounded-xl mb-8 border-4 ${
                        battleResult.winner === 'me' 
                            ? 'bg-blue-100 border-blue-500 text-blue-800' 
                            : battleResult.winner === 'rival'
                            ? 'bg-red-100 border-red-500 text-red-800'
                            : 'bg-gray-100 border-gray-500'
                    }`}>
                        <h2 className="text-4xl font-extrabold mb-2">
                            {battleResult.winner === 'me' ? "🏆 ¡VICTORIA!" : battleResult.winner === 'rival' ? "❌ DERROTA" : "🤝 EMPATE"}
                        </h2>
                        <p className="text-lg font-medium">
                            Diferencia de poder: <span className="font-bold text-2xl">{battleResult.diff}</span> puntos
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-around">
                        <div className="h-[400px] w-full md:w-2/3">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getChartData()}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" />
                                    <PolarRadiusAxis angle={30} domain={[0, 1530]} /> 
                                    
                                    {/* Tu Equipo (Azul) */}
                                    <Radar
                                        name={`Tu equipo: ${myTeam.name}`}
                                        dataKey="A"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fill="#3b82f6"
                                        fillOpacity={0.5}
                                    />
                                    {/* Rival (Rojo) */}
                                    <Radar
                                        name={`Equipo rival: ${rivalTeam.name}`}
                                        dataKey="B"
                                        stroke="#ef4444"
                                        strokeWidth={3}
                                        fill="#ef4444"
                                        fillOpacity={0.4}
                                    />
                                    <Legend />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 md:mt-0">
                            <button 
                                onClick={() => setHasFought(false)}
                                className="bg-gray-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-900 transition shadow-lg"
                            >
                                Nueva Batalla
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}