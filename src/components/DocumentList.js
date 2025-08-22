'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from '@/css/client.module.css';
import Image from 'next/image';

export default function DocumentList({ customerId, setShowMessage, setMessageType, setMessageText }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState(null);

    const fetchDocuments = async () => {
        setLoading(true);
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setDocuments([]);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.storage
            .from('customer-documents')
            .list(customerId + '/', {
                limit: 100,
                offset: 0,
            });

        if (error) {
            setShowMessage(true);
            setMessageType('error');
            setMessageText('Fehler beim Laden der Dokumente: ' + error.message);
            setLoading(false);
            return;
        } else {
            setDocuments(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (customerId) {
            fetchDocuments();
        }
    }, [customerId]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const {
            data: { user },
        } = await supabase.auth.getUser();

        const filePath = `${customerId}/${file.name}`;

        const { error } = await supabase.storage
            .from('customer-documents')
            .upload(filePath, file, {
                upsert: true,
                metadata: {
                    owner: user.id,
                },
            });

        if (error) {
            setShowMessage(true);
            setMessageType('error');
            setMessageText('Fehler beim Hochladen: ' + error.message);
        } else {
            fetchDocuments();
        }
    };

    const handleOpen = async (fileName) => {
        const { data, error } = await supabase.storage
            .from('customer-documents')
            .createSignedUrl(`${customerId}/${fileName}`, 60);

        if (error) {
            setShowMessage(true);
            setMessageType('error');
            setMessageText('Fehler beim Öffnen: ' + error.message);
        } else {
            window.open(data.signedUrl, '_blank');
        }
    };

    const handleDelete = async (fileName) => {
        const { error } = await supabase.storage
            .from('customer-documents')
            .remove([`${customerId}/${fileName}`]);

        if (error) {
            setShowMessage(true);
            setMessageType('error');
            setMessageText('Fehler beim Löschen: ' + error.message);
            setShowDeleteConfirmation(false);
            setDocumentToDelete(null);
            return;
        } else {
            setDocuments((prev) =>
                prev.filter((doc) => doc.name !== fileName)
            );
            setShowMessage(true);
            setMessageType('success');
            setMessageText('Dokument erfolgreich gelöscht.');
            setShowDeleteConfirmation(false);
            setDocumentToDelete(null);
        }
    };

    return (
        <div className={styles.documentList}>
            {showDeleteConfirmation && (
                <div className={styles.confirmationDialog}>
                    <p>Bist du sicher, dass du dieses Dokument endgültig löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.</p>
                    <button onClick={() => handleDelete(documentToDelete)} className={styles.confirmDeleteButton}>Ja, löschen</button>
                    <button onClick={() => setShowDeleteConfirmation(false)} className={styles.cancelButton}>Abbrechen</button>
                </div>
            )}

            <input
                type="file"
                onChange={handleUpload}
                className={styles.uploadInput}
            />
            <button
                onClick={() => document.querySelector(`.${styles.uploadInput}`).click()}
                className={styles.uploadButton}
            >
                Datei hochladen
            </button>

            {loading ? (
                <div className={styles.loader}></div>
            ) : (
                <ul className={styles.fileList}>
                    {documents.map((doc) => (
                        <li key={doc.name} className={styles.fileItem}>
                            <span
                                className={styles.fileName}
                                onClick={() => handleOpen(doc.name)}
                            >
                                {doc.name}
                            </span>
                            <Image
                                src="/delete.svg"
                                alt="Delete"
                                width={25}
                                height={25}
                                onClick={() => {
                                    setShowDeleteConfirmation(true);
                                    setDocumentToDelete(doc.name);
                                }}
                                className={styles.deleteIcon}
                            />
                        </li>
                    ))}
                    {documents.length === 0 && <p>Keine Dokumente hochgeladen</p>}
                </ul>
            )}
        </div>
    );
}
