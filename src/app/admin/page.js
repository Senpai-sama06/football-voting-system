
'use client';

import { getPlayers } from '@/lib/storage';
import AdminDashboard from '@/components/AdminDashboard';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Simple client-side cookie reader
function getCookie(name) {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

export default function AdminPage() {
    const router = useRouter();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const isAdmin = getCookie('admin_session');
        if (!isAdmin) {
            router.push('/');
            return;
        }

        getPlayers().then(data => {
            setPlayers(data);
            setLoading(false);
        });
    }, [router]);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading admin...</div>;

    return (
        <div style={{ marginTop: '2rem', paddingBottom: '3rem' }}>
            <h1 style={{ marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>Admin Panel</h1>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Toggle who played in this session.</p>
            <AdminDashboard initialPlayers={players} />
        </div>
    );
}
