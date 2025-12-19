
'use client';

import { getPlayers } from '@/lib/storage';
import LoginForm from '@/components/LoginForm';
import { useEffect, useState } from 'react';

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlayers().then(data => {
      setPlayers(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', textAlign: 'center' }}>
        <p>Loading players...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', background: 'linear-gradient(to right, var(--accent-blue), var(--accent-green))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Man of the Match
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Login to Vote
      </p>

      <LoginForm players={players} />

      <div style={{ marginTop: '2rem' }}>
        <a href="/results" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
          View Results
        </a>
      </div>
    </div>
  );
}
