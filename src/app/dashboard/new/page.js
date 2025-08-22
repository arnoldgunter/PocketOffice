'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import styles from '@/css/client.module.css';

export default function NewCustomerPage() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);

        const id = crypto.randomUUID();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        const { error } = await supabase.from('customers').insert([
            {
                id,
                name,
                notes: '',
                user_id: user?.id,
            },
        ]);

        setLoading(false);

        if (error) {
            alert('Fehler beim Erstellen: ' + error.message);
            return;
        }

        router.push(`/dashboard/customers/${id}`);
    };

    return (
        <div className={styles.customerPage}>
            <h2 className={styles.title}>Neuen Kunden hinzufügen</h2>

            <form onSubmit={handleCreate} className={styles.nameForm}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Kundenname eingeben..."
                    className={styles.input}
                />
                <button type="submit" disabled={loading} className={styles.addButton}>
                    {loading ? 'Erstelle...' : 'Kunde erstellen'}
                </button>
            </form>
        </div>
    );
}
