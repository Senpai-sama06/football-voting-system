import { getPlayers } from '@/lib/storage';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, pin } = body;

        const players = getPlayers();
        const player = players.find(p => p.id === userId);

        if (player && player.pin === pin) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
