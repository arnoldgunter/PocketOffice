import styles from "@/css/privacy.module.css";

export const metadata = {
    title: "Datenschutzerklärung | POKO",
    description: "Datenschutzerklärung für POKO – Pocket Office",
};

export default function PrivacyPage() {
    return (
        <div className={styles.container}>
            <h1>Datenschutzerklärung</h1>

            <section>
                <h2>1. Verantwortlicher</h2>
                <p>
                    Betreiber dieser App:<br />
                    <strong>POKO – Pocket Office</strong><br />
                    E-Mail: arnoldgunter@uncropped.media
                </p>
            </section>

            <section>
                <h2>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
                <p>
                    Wir verarbeiten folgende Daten, wenn du unsere Dienste nutzt:
                </p>
                <ul>
                    <li><strong>Account-Daten:</strong> Name, E-Mail-Adresse, Passwort (verschlüsselt).</li>
                    <li><strong>Nutzungsdaten:</strong> Logins, hochgeladene Dokumente, Aktivitäten.</li>
                    <li><strong>Kommunikationsdaten:</strong> Bestätigungsmails, Passwort-Resets.</li>
                </ul>
            </section>

            <section>
                <h2>3. Zweck der Verarbeitung</h2>
                <p>
                    Deine Daten werden verarbeitet zur Bereitstellung der App, Kommunikation mit dir
                    und für Sicherheit (z. B. Missbrauchsvermeidung).
                </p>
            </section>

            <section>
                <h2>4. Rechtsgrundlage</h2>
                <p>
                    Die Verarbeitung erfolgt nach Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
                    und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren Betrieb).
                </p>
            </section>

            <section>
                <h2>5. Speicherung und Löschung</h2>
                <p>
                    Deine Daten werden so lange gespeichert, wie dein Account aktiv ist.
                    Bei Löschung des Accounts werden personenbezogene Daten und Dokumente
                    entfernt, sofern keine gesetzliche Aufbewahrungspflicht besteht.
                </p>
            </section>

            <section>
                <h2>6. Weitergabe von Daten</h2>
                <p>
                    Wir geben deine Daten nicht an Dritte weiter. Die technische Infrastruktur
                    läuft über <strong>Supabase</strong>.
                </p>
            </section>

            <section>
                <h2>7. Cookies und Tracking</h2>
                <p>
                    Diese App verwendet keine Cookies von Drittanbietern und kein Tracking.
                </p>
            </section>

            <section>
                <h2>8. Rechte der Nutzer:innen</h2>
                <p>Du hast folgende Rechte:</p>
                <ul>
                    <li>Auskunft (Art. 15 DSGVO)</li>
                    <li>Berichtigung (Art. 16 DSGVO)</li>
                    <li>Löschung (Art. 17 DSGVO)</li>
                    <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                    <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                    <li>Widerspruch (Art. 21 DSGVO)</li>
                </ul>
            </section>

            <section>
                <h2>9. Kontakt</h2>
                <p>
                    Bei Fragen kannst du uns jederzeit erreichen:<br />
                    E-Mail: arnoldgunter@uncropped.media
                </p>
            </section>
        </div>
    );
}
