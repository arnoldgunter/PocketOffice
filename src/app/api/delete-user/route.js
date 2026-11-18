import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
        return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
        return NextResponse.json({ error: 'Ungültiges Token' }, { status: 401 });
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (error) {
        console.error('Supabase Fehler:', error);
        return NextResponse.json({ error: 'Löschen fehlgeschlagen' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}