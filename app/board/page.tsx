import React from 'react';
import styles from './page.module.scss';
import Afgangstavle from '@/components/Afgangstavle';

export default function page() {
  return (
    <main className={styles.main}>
      <h1>Afgangstavle</h1>
      <Afgangstavle />
    </main>
  );
}
