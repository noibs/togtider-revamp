import React from 'react';
import styles from './page.module.scss';
import Afgangstavle from '@/components/Afgangstavle';

export default function page() {
  return (
    <main className={styles.main}>
      <Afgangstavle />
    </main>
  );
}
