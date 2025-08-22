'use client';
import styles from "../../css/login.module.css";
import AuthForm from '@/components/AuthForm';
import Image from 'next/image';

export default function Login() {
    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBackground}>
                <Image
                    src="/logo.png"
                    alt="PocketOffice Logo"
                    width={200}
                    height={50}
                    className={styles.logo}
                />
                <h1 className={styles.title}>Willkommen zurück!</h1>
                <p className={styles.subtitle}>Melde dich an, um fortzufahren.</p>
            </div>
            <div className={styles.formsContainer}>
                <AuthForm type="login" />
            </div>
        </div>
    );
}
