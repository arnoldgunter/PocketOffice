'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import styles from '@/css/account.module.css';

export default function AccountPage() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error) {
                console.error(error.message);
                return;
            }
            setUser(user);
            setName(user?.user_metadata?.full_name || '');
            setEmail(user?.email || '');
        };

        loadUser();
    }, []);

    const updateName = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            data: { full_name: name },
        });

        setLoading(false);

        if (error) {
            setMessageType('error');
            setMessage('Fehler beim Aktualisieren: ' + error.message);
        } else {
            setMessageType('success');
            setMessage('Name erfolgreich geändert');
        }
    };

    const updateEmail = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.updateUser({ email });

        setLoading(false);

        if (error) {
            setMessageType('error');
            setMessage('Fehler beim Ändern der Email: ' + error.message);
        } else {
            setMessageType('info');
            setMessage('Bestätige die Änderung über die zugesendete E-Mail in beiden Postfächern.');
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!email) {
            setMessageType('error');
            setMessage('Bitte zuerst eine gültige E-Mail eingeben.');
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
            setMessage('Passwort-Reset E-Mail wurde gesendet');
        }
    };

    const handleSignOut = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        setLoading(false);

        if (error) {
            setMessageType('error');
            setMessage('Fehler beim Abmelden: ' + error.message);
            return;
        } else {
            router.push('/');
        }
    }

    const deleteAccount = async () => {
        setLoading(true);

        try {
            const res = await fetch('/api/delete-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user?.id }),
            });

            const result = await res.json();
            setLoading(false);

            if (!res.ok) {
                setMessageType('error');
                setMessage('Fehler beim Löschen: ' + result.error);
                setShowDeleteConfirmation(false);
                return;
            }

            setMessageType('success');
            setMessage('Account erfolgreich gelöscht');
            setShowDeleteConfirmation(false);

            setTimeout(() => {
                router.push('/');
            }, 2000);

        } catch (err) {
            setLoading(false);
            setMessageType('error');
            setMessage('Unerwarteter Fehler: ' + err.message);
            setShowDeleteConfirmation(false);
        }
    };

    if (!user) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
            </div>
        );
    }

    return (
        <div className={styles.accountPage}>
            {showDeleteConfirmation && (
                <div className={styles.confirmationDialog}>
                    <p>Bist du sicher, dass du dein Account löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.</p>
                    <button onClick={() => deleteAccount()} className={styles.confirmDeleteButton}>Ja, löschen</button>
                    <button onClick={() => setShowDeleteConfirmation(false)} className={styles.cancelButton}>Abbrechen</button>
                </div>
            )}

            <h2 className={styles.title}>Mein Konto</h2>

            {message && (
                <p
                    className={`${styles.message} ${messageType === 'error'
                        ? styles.error
                        : messageType === 'success'
                            ? styles.success
                            : styles.info
                        }`}
                >
                    {message}
                </p>
            )}

            <form onSubmit={updateName} className={styles.form}>
                <label className={styles.label}>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                />
                <button type="submit" disabled={loading} className={styles.button}>
                    Speichern
                </button>
            </form>

            <form onSubmit={updateEmail} className={styles.form}>
                <label className={styles.label}>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                />
                <button type="submit" disabled={loading} className={styles.button}>
                    Email ändern
                </button>
            </form>

            <form onSubmit={handlePasswordReset} className={styles.form}>
                <label className={styles.label}>Passwort zurücksetzen</label>
                <button type="submit" disabled={loading} className={styles.buttonSecondary}>
                    Link zum Zurücksetzen senden
                </button>
            </form>

            <form className={styles.form}>
                <label className={styles.label}>Abmelden</label>
                <button type="submit" disabled={loading} className={styles.buttonSecondary} onClick={() => handleSignOut()}>
                    Abmelden
                </button>
            </form>

            <div className={styles.dangerZone}>
                <h3 className={styles.dangerTitle}>Gefahrenzone</h3>
                <button
                    onClick={setShowDeleteConfirmation.bind(null, true)}
                    disabled={loading}
                    className={styles.deleteButton}
                >
                    Account löschen
                </button>
            </div>
        </div>
    );
}
