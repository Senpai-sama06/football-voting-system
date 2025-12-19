
'use client';

import { getPlayers } from '@/lib/storage';
import VotingForm from '@/components/VotingForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function VoteContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    const voterId = searchParams.get('voterId');

    useEffect(() => {
        if (!voterId) {
            router.push('/');
            return;
        }

        getPlayers().then(data => {
            setPlayers(data);
            setLoading(false);
        });
    }, [voterId, router]);

    if (loading) return <div className="glass-panel" style={{ padding: '2rem' }}>Loading...</div>;

    const voter = players.find(p => p.id === voterId);
    if (!voter) {
        // If loaded and not found, maybe invalid ID
        return <div className="glass-panel" style={{ padding: '2rem' }}>Voter not found.</div>;
    }

    const others = players.filter(p => p.id !== voterId && p.active);

    return (
        <div>
            <VotingForm voter={voter} others={others} />
        </div>
    );
}

export default function VotePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VoteContent />
        </Suspense>
    );
}
