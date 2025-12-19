import { saveVote, getActiveGame } from '@/lib/storage';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { voterId, ratings } = body;

        if (!voterId || !ratings) {
            return NextResponse.json({ error: 'Missing data' }, { status: 400 });
        }

        // Use Active Game ID
        const activeGame = getActiveGame();
        // Fallback to Date if no game created yet
        const sessionId = activeGame ? activeGame.id : new Date().toISOString().split('T')[0];

        saveVote({
            sessionId,
            voterId,
            ratings
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
