import { getPlayers } from '@/lib/storage';
import LoginForm from '@/components/LoginForm';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const players = await getPlayers();

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
