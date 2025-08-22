import Link from 'next/link';
import styles from '@/css/customerIndexPage.module.css';

export default function DashboardHome() {
    return (
        <div className={styles.container}>
            <h1>Willkommen bei Poko</h1>
            <p>Wähle links einen Kunden aus oder erstelle einen neuen.</p>
            <Link className={styles.addButton} href="/dashboard/new">
                + Kunde hinzufügen
            </Link>
        </div>
    );
}
