'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm({ players }) {
    const router = useRouter();
    const [nameInput, setNameInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    // Check if user is typing 'admin'
    const handleNameChange = (e) => {
        const val = e.target.value;
        setNameInput(val);
        if (val.trim().toLowerCase() === 'admin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const trimmedInput = nameInput.trim().toLowerCase();

        if (trimmedInput === 'admin') {
            // Admin Login
            try {
                const res = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password })
                });

                if (res.ok) {
                    router.push('/admin');
                } else {
                    setError('Invalid Password');
                }
            } catch (err) {
                setError('Login failed');
            }
            return;
        }

        // Player Login
        // Find player by name (case-insensitive) & ACTIVE check
        const match = players.find(p => p.name.trim().toLowerCase() === trimmedInput);

        if (match) {
            if (!match.active) {
                setError('This player is marked as inactive for this session.');
                return;
            }
            router.push(`/vote?voterId=${match.id}`);
        } else {
            setError('Player not found. Please check spelling.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ textAlign: 'left' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                        Username
                    </label>
                    <input
                        type="text"
                        value={nameInput}
                        onChange={handleNameChange}
                        placeholder="Enter your name..."
                        style={{
                            width: '100%',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius)',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                </div>

                {isAdmin && (
                    <div style={{ textAlign: 'left', animation: 'fadeIn 0.3s' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                            Admin Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password..."
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1.1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>
                )}

                {error && (
                    <div style={{
                        color: '#ef4444',
                        background: 'rgba(239, 68, 68, 0.1)',
                        padding: '0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius)',
                        border: 'none',
                        background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-green))',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        marginTop: '1rem',
                        boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
                    }}
                >
                    {isAdmin ? 'Admin Login' : 'Enter'}
                </button>
            </form>

            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    Available Players:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                    {players.filter(p => p.active).map(p => (
                        <span key={p.id} style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)'
                        }}>
                            {p.name}
                        </span>
                    ))}
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
