import { getPlayers, getSessionVotes, getActiveGame, getGames } from '@/lib/storage';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; // Ensure it re-fetches on refresh

export default function ResultsPage({ searchParams }) {
    const players = getPlayers();

    // Determine Session ID
    let sessionId = searchParams.gameId;
    let gameName = "Session Results";

    if (!sessionId) {
        const activeGame = getActiveGame();
        if (activeGame) {
            sessionId = activeGame.id;
            gameName = activeGame.name;
        } else {
            // Fallback to today
            sessionId = new Date().toISOString().split('T')[0];
        }
    } else {
        // Look up name
        const games = getGames();
        const g = games.find(g => g.id === sessionId);
        if (g) gameName = g.name;
    }

    const votes = getSessionVotes(sessionId);

    // Calculate stats
    // stats = { playerId: { sum: 0, count: 0 } }
    const stats = {};

    // Initialize
    players.forEach(p => {
        stats[p.id] = { sum: 0, count: 0, name: p.name };
    });

    // Aggregate
    votes.forEach(vote => {
        Object.entries(vote.ratings).forEach(([targetId, rating]) => {
            if (stats[targetId]) {
                stats[targetId].sum += rating;
                stats[targetId].count += 1;
            }
        });
    });

    // Compute averages
    const results = Object.entries(stats).map(([id, data]) => ({
        id,
        name: data.name,
        average: data.count > 0 ? (data.sum / data.count).toFixed(1) : 0,
        count: data.count
    }));

    // Sort: Average DESC, then Vote Count DESC
    results.sort((a, b) => b.average - a.average || b.count - a.count);

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
                {results.map((player, index) => {
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
