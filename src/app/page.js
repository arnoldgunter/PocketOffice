import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";

export default function Home() {
  return (
    <div className={styles.landing}>
      <div className={styles.overlay}>
        <h1 className={styles.title}>Willkommen bei </h1>
        <Image src="/logo.png" alt="PocketOffice" width={300} height={80} />
        <p className={styles.subtitle}>
          Dein smarter Kundenmanager – einfach, schnell und sicher.
        </p>

        <div className={styles.buttons}>
          <Link href="/signup" className={styles.primaryBtn}>
            Kostenlos starten
          </Link>
          <Link href="/login" className={styles.secondaryBtn}>
            Log in
          </Link>
        </div>

        <Link href="/dashboard" className={styles.dashboardLink}>
          Zum Dashboard
        </Link>

        <Link href="/privacy" className={styles.privacyLink}>
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
