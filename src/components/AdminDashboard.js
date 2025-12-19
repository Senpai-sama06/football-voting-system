
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updatePlayerStatus, createGame } from '@/lib/storage';

export default function AdminDashboard({ initialPlayers }) {
    const [players, setPlayers] = useState(initialPlayers);
    const [creatingGame, setCreatingGame] = useState(false);
    const router = useRouter();

    const toggleStatus = async (playerId, currentStatus) => {
        const newStatus = !currentStatus;
        // Optimistic update
        setPlayers(prev => prev.map(p =>
            String(p.id) === String(playerId) ? { ...p, active: newStatus } : p
        ));

        try {
            const res = await updatePlayerStatus(playerId, newStatus);
            if (!res.success && res.error) throw new Error(res.error);
            router.refresh();
        } catch (e) {
            console.error('Failed to update status', e);
            // Revert
            setPlayers(prev => prev.map(p =>
                String(p.id) === String(playerId) ? { ...p, active: currentStatus } : p
            ));
        }
    };

    const handleCreateGame = async () => {
        if (!confirm("Start a new Match Day? This will archive the previous game and reset the roster.")) return;

        setCreatingGame(true);
        try {
            // Empty name triggers auto-naming in Apps Script if handled there, 
            // OR we generate name here. 
            // My apps_script.js simple createGame uses data.name directly.
            // Let's generate a date-based name here.
            const date = new Date();
            const name = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            await createGame(name);

            // Force reload to get fresh data
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert('Error creating game');
            setCreatingGame(false);
        }
    };

    return (
        <div>
            <header style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ color: 'var(--text-primary)' }}>Admin Console</h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link href="/history" style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontWeight: 'bold' }}>
                            Past Games
                        </Link>
                        <Link href="/" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>
                            Exit
                        </Link>
                    </div>
                </div>

                {/* Create Game Button */}
                <div className="glass-panel" style={{
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(0, 242, 234, 0.05)',
                    border: '1px solid var(--accent-blue)'
                }}>
                    <div>
                        <h3 style={{ margin: 0, color: 'var(--accent-blue)' }}>Next Match</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Start a new session to reset votes & roster.
                        </p>
                    </div>

                    <button
                        onClick={handleCreateGame}
                        disabled={creatingGame}
                        style={{
                            padding: '1rem 2rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 15px rgba(0, 242, 234, 0.4)',
                            opacity: creatingGame ? 0.7 : 1,
                            cursor: creatingGame ? 'wait' : 'pointer'
                        }}
                    >
                        {creatingGame ? 'Setting up...' : 'Start New Game'}
                    </button>
                </div>
            </header>

            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Select Players (Who Played?)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {players.map(player => (
                    <div key={player.id} className="glass-panel" style={{
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: player.active ? '1px solid var(--accent-green)' : '1px solid var(--glass-border)',
                        background: player.active ? 'rgba(0, 255, 157, 0.1)' : 'var(--glass-bg)'
                    }}>
                        <span style={{ fontWeight: '500', color: player.active ? 'white' : 'var(--text-secondary)' }}>
                            {player.name}
                        </span>

                        <button
                            onClick={() => toggleStatus(player.id, player.active)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: player.active ? 'var(--accent-green)' : 'rgba(255, 255, 255, 0.1)',
                                color: player.active ? '#000' : 'var(--text-secondary)',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {player.active ? 'Played' : 'Sitting Out'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
