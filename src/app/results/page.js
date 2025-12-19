
'use client';

import { getPlayers, getSessionVotes, getActiveGame, getGames } from '@/lib/storage';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function ResultsContent() {
    const searchParams = useSearchParams();
    const [stats, setStats] = useState([]);
    const [gameName, setGameName] = useState("Loading...");
    const [loading, setLoading] = useState(true);

    const gameIdParam = searchParams.get('gameId');

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const [players, games] = await Promise.all([
                getPlayers(),
                getGames()
            ]);

            let sessionId = gameIdParam;
            let name = "Session Results";

            if (!sessionId) {
                const active = await getActiveGame();
                if (active) {
                    sessionId = active.id;
                    name = active.name;
                } else {
                    sessionId = new Date().toISOString().split('T')[0]; // Fallback
                }
            } else {
                const g = games.find(g => String(g.id) === sessionId);
                if (g) name = g.name;
            }

            setGameName(name);

            const votes = await getSessionVotes(sessionId);

            // Calc stats
            const statMap = {};
            players.forEach(p => {
                statMap[String(p.id)] = { sum: 0, count: 0, name: p.name };
            });

            votes.forEach(vote => {
                // vote.ratings is object
                Object.entries(vote.ratings).forEach(([targetId, rating]) => {
                    const tid = String(targetId);
                    if (statMap[tid]) {
                        statMap[tid].sum += rating;
                        statMap[tid].count += 1;
                    }
                });
            });

            const results = Object.entries(statMap).map(([id, data]) => ({
                id,
                name: data.name,
                average: data.count > 0 ? (data.sum / data.count).toFixed(1) : 0,
                count: data.count
            }));

            // Sort
            results.sort((a, b) => b.average - a.average || b.count - a.count);

            setStats(results);
            setLoading(false);
        }

        loadData();
    }, [gameIdParam]);

    if (loading) return <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>Loading results...</div>;

    return (
        <div style={{ paddingBottom: '40px' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center', marginTop: '2rem' }}>
                <h1 style={{
                    background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '2.5rem'
                }}>
                    Leaderboard
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>{gameName}</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats.map((player, index) => {
                    const isTop3 = index < 3;
                    const rankColors = ['#fbbf24', '#94a3b8', '#b45309']; // Gold, Silver, Bronze
                    const borderColor = index < 3 ? rankColors[index] : 'var(--glass-border)';

                    return (
                        <div key={player.id} className="glass-panel" style={{
                            padding: '1.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            border: `1px solid ${borderColor}`,
                            boxShadow: index === 0 ? '0 0 20px rgba(251, 191, 36, 0.2)' : 'none'
                        }}>
                            <div style={{
                                width: '30px',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: index < 3 ? borderColor : 'var(--text-secondary)'
                            }}>
                                #{index + 1}
                            </div>

                            <div style={{ flex: 1, marginLeft: '1rem' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{player.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{player.count} votes</div>
                            </div>

                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: index === 0 ? '#fbbf24' : 'white' }}>
                                {player.average}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <Link href="/" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResultsContent />
        </Suspense>
    );
}
