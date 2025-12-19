
import { getPlayers, updatePlayerStatus } from '@/lib/storage';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { playerId, active } = body;

        await updatePlayerStatus(playerId, active);

        // Return updated list
        const players = await getPlayers();

        return NextResponse.json({ success: true, players });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
