'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// NOTE: We need to fetch players via API or Server Component. 
// Since this is a Client Component (needs state for Modal), let's pass data in?
// Or better, keep page.js as Server Component and make a client ClientGrid.
// Let's refactor page.js to be Server and import ClientLoginGrid.

export default function LoginGrid({ players }) {
    const router = useRouter();
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePlayerClick = (player) => {
        setSelectedPlayer(player);
        setPin('');
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: selectedPlayer.id, pin })
            });

            if (res.ok) {
                router.push(`/vote?voterId=${selectedPlayer.id}`);
            } else {
                setError('Incorrect PIN');
                setLoading(false);
            }
        } catch (err) {
            setError('Something went wrong');
            setLoading(false);
        }
    };

    return (
        <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                {players.map((player) => (
                    <div
                        key={player.id}
                        onClick={() => handlePlayerClick(player)}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '1.5rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--text-primary)',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                            fontWeight: '500',
                            textAlign: 'center'
                        }}
                        className="player-card"
                    >
                        {player.name}
                    </div>
                ))}
            </div>

            {selectedPlayer && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100
                }} onClick={() => setSelectedPlayer(null)}>
                    <div
                        onClick={e => e.stopPropagation()}
                        className="glass-panel"
                        style={{ padding: '2rem', width: '90%', maxWidth: '400px', border: '1px solid var(--accent-blue)' }}
                    >
                        <h3 style={{ marginBottom: '1rem', color: 'var(--accent-blue)' }}>Welcome, {selectedPlayer.name}</h3>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Enter PIN to vote</p>

                        <form onSubmit={handleLogin}>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength="4"
                                value={pin}
                                onChange={e => setPin(e.target.value)}
                                placeholder="PIN"
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    fontSize: '1.5rem',
                                    textAlign: 'center',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius)',
                                    color: 'white',
                                    marginBottom: '1rem',
                                    outline: 'none'
                                }}
                            />

                            {error && <p style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius)',
                                    border: 'none',
                                    background: 'var(--accent-blue)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                }}
                            >
                                {loading ? 'Checking...' : 'Login'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
