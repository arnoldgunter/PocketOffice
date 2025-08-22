'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '@/css/authForm.module.css';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionValid, setSessionValid] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (session && session.user) {
                setSessionValid(true);
            } else {
                setMessageType('error');
                setMessage('Ungültiger oder abgelaufener Link.');
            }
        };

        checkSession();
    }, []);

    const validatePassword = (pw) => pw.length >= 6 && /\d/.test(pw);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validatePassword(password)) {
            setMessageType('error');
            setMessage('Passwort muss mindestens 6 Zeichen lang sein und eine Zahl enthalten.');
            return;
        }

        if (password !== confirmPassword) {
            setMessageType('error');
            setMessage('Passwörter stimmen nicht überein.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password });
        setLoading(false);

        if (error) {
            setMessageType('error');
            setMessage('Fehler: ' + error.message);
            return;
        }

        setMessageType('success');
        setMessage('Passwort geändert! Weiterleitung…');
        setTimeout(() => router.push('/login'), 2000);
    };

    if (!sessionValid && !message) return null;

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.title}>Passwort zurücksetzen</h2>

            {message && (
                <p className={`${styles.message} ${styles[messageType]}`}>
                    {message}
                </p>
            )}

            {sessionValid && (
                <>
                    <input
                        type="password"
                        placeholder="Neues Passwort"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Passwort bestätigen"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={styles.input}
                    />

                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? 'Speichert…' : 'Passwort ändern'}
                    </button>
                </>
            )}
        </form>
    );
}
