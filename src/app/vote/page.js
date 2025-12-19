import { getPlayers } from '@/lib/storage';
import VotingForm from '@/components/VotingForm';
import { redirect } from 'next/navigation';

export default function VotePage({ searchParams }) {
    const voterId = searchParams.voterId;

    if (!voterId) {
        redirect('/');
    }

    const players = getPlayers();
    const voter = players.find(p => p.id === voterId);

    if (!voter) {
        redirect('/');
    }

    const others = players.filter(p => p.id !== voterId && p.active);

    return (
        <div>
            <VotingForm voter={voter} others={others} />
        </div>
    );
}
