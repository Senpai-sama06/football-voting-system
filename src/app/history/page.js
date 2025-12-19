
'use client';

import { getGames } from '@/lib/storage';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HistoryPage() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getGames().then(data => {
            setGames(data.reverse());
            setLoading(false);
        });
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading history...</div>;

    return (
        <div style={{ paddingBottom: '40px' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center', marginTop: '2rem' }}>
                <h1 style={{ color: 'var(--accent-gold)' }}>Past Games</h1>
                <Link href="/" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontSize: '0.9rem' }}>
                    Back to Home
                </Link>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {games.map(game => (
                    <Link key={game.id} href={`/results?gameId=${game.id}`} style={{ textDecoration: 'none' }}>
                        <div className="glass-panel" style={{
                            padding: '1.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: game.active ? '1px solid var(--accent-green)' : '1px solid var(--glass-border)'
                        }}>
                            <div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{game.name}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {new Date(game.date).toLocaleDateString()}
                                </div>
                            </div>

                            {game.active && <span style={{ color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: 'bold' }}>ACTIVE</span>}
                        </div>
                    </Link>
                ))}
                {games.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No games recorded yet.</p>}
            </div>
        </div>
    );
}
