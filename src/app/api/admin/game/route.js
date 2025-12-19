import { createGame } from '@/lib/storage';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        let { name } = body;

        if (!name) {
            const date = new Date();
            name = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }

        const newGame = createGame(name);
        return NextResponse.json({ success: true, game: newGame });
    } catch (error) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
