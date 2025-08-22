'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Sidebar from '@/components/Sidebar';
import styles from '@/css/dashboard.module.css';

export default function CustomersLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndCustomers = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('customers')
        .select('id, name')
        .eq('user_id', user.id);

      if (error) {
        console.error('Fehler beim Laden der Kunden:', error.message);
        return;
      }

      setCustomers(data || []);
      setLoading(false);
    };

    fetchUserAndCustomers();
  }, [router]);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Sidebar customers={customers} />
      <div className={styles.defaultLayout}>{children}</div>
    </div>
  );
}
