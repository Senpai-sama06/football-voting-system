import { getPlayers } from '@/lib/storage';
import AdminDashboard from '@/components/AdminDashboard';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const cookieStore = cookies();
    const isAdmin = cookieStore.get('admin_session');

    if (!isAdmin) {
        redirect('/');
    }

    const players = await getPlayers();

    return (
        <div style={{ marginTop: '2rem', paddingBottom: '3rem' }}>
            <h1 style={{ marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>Admin Panel</h1>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Toggle who played in this session.</p>
            <AdminDashboard initialPlayers={players} />
        </div>
    );
}
