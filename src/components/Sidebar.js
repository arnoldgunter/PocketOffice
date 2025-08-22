'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from '@/css/sidebar.module.css';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const activeCustomerId = pathname.split('/')[3];
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [accountName, setAccountName] = useState('');
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const matcher = window.matchMedia("(prefers-color-scheme: dark)");

        setIsDark(matcher.matches);

        const listener = (e) => setIsDark(e.matches);
        matcher.addEventListener("change", listener);

        return () => matcher.removeEventListener("change", listener);
    }, []);

    useEffect(() => {
        const fetchCustomers = async () => {
            const { data, error } = await supabase
                .from('customers')
                .select('id, name')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Fehler beim Laden der Kunden:', error.message);
                return;
            }

            setCustomers(data);
        };

        const fetchAccount = async () => {
            const { data, error } = await supabase.auth.getUser();

            if (error) {
                console.error('Fehler beim Laden des Kontos:', error.message);
                return;
            }


            setAccountName(data.user.user_metadata.full_name || 'Unbekannt');
        };

        fetchAccount();
        fetchCustomers();
    }, [pathname]);

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAccountClick = () => {
        router.push('/account');
    }

    return (
        <aside className={styles.sidebar}>
            <Link href="/" className={styles.logoLink}>
                <Image
                    src="/logo.png"
                    alt="PocketOffice Logo"
                    className={styles.logo}
                    width={150}
                    height={40}
                />
            </Link>
            <h2>Kunden</h2>

            <input
                className={styles.searchInput}
                placeholder="Kunden suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Link className={styles.addButton} href="/dashboard/new">
                + Kunde hinzufügen
            </Link>

            <div className={styles.customerList}>
                {filteredCustomers.map((customer) => (
                    <Link
                        key={customer.id}
                        href={`/dashboard/customers/${customer.id}`}
                        className={
                            activeCustomerId === customer.id
                                ? `${styles.customerItem} ${styles.active}`
                                : styles.customerItem
                        }
                    >
                        {customer.name}
                    </Link>
                ))}
            </div>
            <div className={styles.footer} onClick={handleAccountClick}>
                <div className={styles.accountAvatar}>
                    <Image
                        src={isDark ? "/account-white.svg" : "/account-black.svg"}
                        alt="Account Avatar"
                        className={styles.avatarImage}
                        width={40}
                        height={40}
                    />
                </div>
                <div className={styles.accountName}>{accountName}</div>
            </div>
        </aside>
    );
}
