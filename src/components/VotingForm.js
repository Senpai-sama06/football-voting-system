'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VotingForm({ voter, others }) {
    const router = useRouter();
    const [ratings, setRatings] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleRatingChange = (id, value) => {
        setRatings(prev => ({
            ...prev,
            [id]: parseFloat(value)
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);

        // Ensure all displayed players have a rating (default to 0 if untouched)
        const finalRatings = { ...ratings };
        others.forEach(p => {
            if (finalRatings[p.id] === undefined) {
                finalRatings[p.id] = 0;
            }
        });

        try {
            const res = await fetch('/api/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    voterId: voter.id,
                    ratings: finalRatings
                })
            });

            if (res.ok) {
                router.push('/results');
            } else {
                alert('Failed to submit votes');
                setSubmitting(false);
            }
        } catch (e) {
            console.error(e);
            setSubmitting(false);
        }
    };

    return (
        <div style={{ paddingBottom: '100px' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Hello, {voter.name}</p>
                <h2>Rate the Players</h2>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {others.map(player => {
                    const score = ratings[player.id] || 0;
                    return (
                        <div key={player.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{player.name}</span>
                                <span style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: score >= 8 ? 'var(--accent-green)' : score >= 5 ? 'var(--accent-blue)' : 'var(--text-secondary)'
                                }}>
                                    {score}
                                </span>
                            </div>

                            <input
                                type="range"
                                min="0"
                                max="10"
                                step="0.5"
                                value={score}
                                onChange={(e) => handleRatingChange(player.id, e.target.value)}
                                style={{ width: '100%', accentColor: 'var(--accent-blue)' }}
                            />
                        </div>
                    );
                })}
            </div>

            <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90%',
                    maxWidth: '500px',
                    padding: '1rem',
                    borderRadius: 'var(--radius)',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-green))',
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)',
                    transition: 'transform 0.1s',
                }}
            >
                {submitting ? 'Submitting...' : 'Submit ➔'}
            </button>
        </div>
    );
}
