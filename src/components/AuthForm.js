'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/css/authForm.module.css';

export default function AuthForm({ type = 'login' }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const router = useRouter();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (pw) => pw.length >= 6 && /\d/.test(pw);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!validateEmail(email)) {
            setMessageType('error');
            setMessage('Ungültige E-Mail-Adresse.');
            return;
        }

        if (!validatePassword(password)) {
            setMessageType('error');
            setMessage('Passwort muss mindestens 6 Zeichen lang sein und eine Zahl enthalten.');
            return;
        }

        if (type === 'signup' && name.trim().length < 2) {
            setMessageType('error');
            setMessage('Bitte gib einen gültigen Namen ein.');
            return;
        }

        setLoading(true);

        let response;

        if (type === 'signup') {
            response = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            });
        } else {
            response = await supabase.auth.signInWithPassword({
                email,
                password,
            });
        }

        const { error } = response;
        setLoading(false);

        if (error) {
            setMessageType('error');
            setMessage(error.message);
            return;
        }

        if (type === 'signup') {
            setMessageType('info');
            setMessage('Bitte bestätige deine E-Mail-Adresse.');
        }

        if (type === 'login') {
            setMessageType('success');
            setMessage('Login erfolgreich! Weiterleitung…');
            setTimeout(() => router.push('/dashboard'), 1200);
        }
    };

    const handleForgotPassword = async () => {
        if (!validateEmail(email)) {
            setMessageType('error');
            setMessage('Gültige E-Mail für Passwort-Reset erforderlich.');
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setMessageType('error');
            setMessage('Fehler beim Zurücksetzen: ' + error.message);
        } else {
            setMessageType('info');
            setMessage('Passwort-Reset E-Mail wurde gesendet.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.title}>
                {type === 'login' ? 'Einloggen' : 'Konto erstellen'}
            </h2>

            {message && (
                <p className={`${styles.message} ${styles[messageType]}`}>{message}</p>
            )}

            {type === 'signup' && (
                <input
                    type="text"
                    placeholder="Dein Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={styles.input}
                />
            )}

            <input
                type="email"
                placeholder="E-Mail-Adresse"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
            />

            <input
                type="password"
                placeholder="Passwort (min. 6 Zeichen & Zahl)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
            />

            {type === 'login' && (
                <div className={styles.forgot}>
                    <button
                        type="button"
                        className={styles.linkButton}
                        onClick={handleForgotPassword}
                    >
                        Passwort vergessen?
                    </button>
                </div>
            )}

            <button type="submit" disabled={loading} className={styles.button}>
                {loading
                    ? 'Wird geladen...'
                    : type === 'login'
                        ? 'Einloggen'
                        : 'Registrieren'}
            </button>

            <div className={styles.switch}>
                {type === 'login' ? (
                    <>
                        Noch kein Konto? <Link href="/signup">Jetzt registrieren</Link>
                    </>
                ) : (
                    <>
                        Bereits registriert? <Link href="/login">Jetzt einloggen</Link>
                    </>
                )}
            </div>
        </form>
    );
}
