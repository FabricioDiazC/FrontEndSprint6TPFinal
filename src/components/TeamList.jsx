import React from 'react';
import TeamCard from './TeamCard';

export default function TeamList({ teams, onDeleteOne }) {
    

    if (teams.length === 0) {
        return (
            <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg bg-gray-50">
                <p className="text-lg">No tienes equipos creados.</p>
                <p className="text-sm">¡Usa el formulario de arriba para crear uno!</p>
            </div>
        );
    }


    return (
        <div className="space-y-6">
            {teams.map(team => (
                <TeamCard 
                    key={team._id} 
                    team={team} 
                    onDelete={onDeleteOne} 
                />
            ))}
        </div>
    );
}