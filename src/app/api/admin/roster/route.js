import { getPlayers } from '@/lib/storage';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Reusing the path from storage.js logic
const DATA_DIR = path.join(process.cwd(), 'data');
const PLAYERS_FILE = path.join(DATA_DIR, 'players.json');

export async function POST(request) {
    try {
        const body = await request.json();
        const { playerId, active } = body;

        const players = getPlayers();
        const updatedPlayers = players.map(p => {
            if (p.id === playerId) {
                return { ...p, active };
            }
            return p;
        });

        fs.writeFileSync(PLAYERS_FILE, JSON.stringify(updatedPlayers, null, 2));

        return NextResponse.json({ success: true, players: updatedPlayers });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
