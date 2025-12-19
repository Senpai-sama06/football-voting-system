import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const body = await request.json();
        const { password } = body;

        if (password === 'gem') {
            // Set a simple cookie
            cookies().set('admin_session', 'true', { httpOnly: true, path: '/' });
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Invalid Password' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
