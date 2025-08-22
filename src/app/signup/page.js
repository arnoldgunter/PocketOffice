'use client';
import AuthForm from '@/components/AuthForm';
import styles from "../../css/login.module.css";
import Image from 'next/image';

export default function Signup() {
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
                <h1 className={styles.title}>Erstelle dein Konto!</h1>
                <p className={styles.subtitle}>Registriere dich, um loszulegen.</p>
            </div>
            <div className={styles.formsContainer}>
                <AuthForm type="signup" />
            </div>
        </div>
    );
}