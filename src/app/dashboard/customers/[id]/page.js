'use client';

import { useEffect, useState, use } from 'react';
import styles from '@/css/client.module.css';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DocumentList from '@/components/DocumentList';

export default function CustomerDetailPage({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const [customer, setCustomer] = useState(null);

    const [showMessage, setShowMessage] = useState(false);
    const [messageType, setMessageType] = useState('success');
    const [messageText, setMessageText] = useState('');

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        birthdate: '',
        notes: '',
    });

    useEffect(() => {
        const fetchCustomer = async () => {
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error(error.message);
            } else {
                setCustomer(data);
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    birthdate: data.birthdate || '',
                    notes: data.notes || '',
                });
            }
        };

        fetchCustomer();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { error } = await supabase
            .from('customers')
            .update(formData)
            .eq('id', id);

        if (error) {
            setMessageType('error');
            setMessageText('Fehler beim Speichern: ' + error.message);
            setShowMessage(true);
            return;
        }

        setMessageType('success');
        setMessageText('Kundendaten erfolgreich gespeichert!');
        setShowMessage(true);
    };

    const deleteCustomer = async (id) => {
        const { error } = await supabase.from('customers').delete().eq('id', id);

        if (error) {
            setMessageType('error');
            setMessageText('Fehler beim Löschen: ' + error.message);
            setShowMessage(true);
        } else {
            router.push('/dashboard');
        }
    };

    if (!customer) {
        return (
            <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
            </div>
        );
    }

    return (
        <div className={styles.customerPage}>
            {
                showMessage && (
                    <div className={`${styles.message} ${styles[messageType]}`}>
                        {messageText}
                        <Image
                            src="/close.svg"
                            alt="Close Icon"
                            width={20}
                            height={20}
                            onClick={() => setShowMessage(false)}
                            className={styles.closeIcon}
                        />
                    </div>
                )
            }
            {showDeleteConfirmation && (
                <div className={styles.confirmationDialog}>
                    <p>Bist du sicher, dass du diesen Kunden endgültig löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.</p>
                    <button onClick={() => deleteCustomer(id)} className={styles.confirmDeleteButton}>Ja, löschen</button>
                    <button onClick={() => setShowDeleteConfirmation(false)} className={styles.cancelButton}>Abbrechen</button>
                </div>
            )}
            <div className={styles.customerHeader}>
                <h2 className={styles.title}>Kunde: {formData.name}</h2>
                <button className={styles.deleteClientButton} onClick={() => setShowDeleteConfirmation(true)}>Kunde löschen</button>
            </div>
            <div className={styles.customer}>
                <div className={styles.clientDetails}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Name</label>
                            <input
                                className={styles.input}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Max Mustermann"
                            />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>E-Mail</label>
                            <input
                                className={styles.input}
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="max@example.com"
                            />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Telefon</label>
                            <input
                                className={styles.input}
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+49 123 456789"
                            />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Adresse</label>
                            <input
                                className={styles.input}
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Straße 1, Ort"
                            />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Geburtsdatum</label>
                            <input
                                className={styles.input}
                                type="date"
                                name="birthdate"
                                value={formData.birthdate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.fieldGroupFull}>
                            <label className={styles.label}>Notizen</label>
                            <textarea
                                className={styles.input}
                                name="notes"
                                rows="4"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Besondere Infos zum Kunden..."
                            />
                        </div>

                        <button type="submit" className={styles.saveButton}>Speichern</button>
                    </form>
                </div>
                <div className={styles.documentSection}>
                    <h3>Dokumente</h3>
                    <DocumentList
                        customerId={id}
                        setShowMessage={setShowMessage}
                        setMessageType={setMessageType}
                        setMessageText={setMessageText}
                    />
                </div>
            </div>
        </div>
    );
}
