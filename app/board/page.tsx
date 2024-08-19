import React from 'react';
import styles from './page.module.scss';
import Afgangstavle from '@/components/Afgangstavle';
import HeadBtnContainer from '@/components/HeadBtnContainer';
import SettingsPanel from '@/components/SettingsPanel';
import { SearchPanel } from '@/components/SearchPanel';

export default function Page() {
  return (
    <>
      <main className={styles.main}>
        <HeadBtnContainer />
        <SettingsPanel />
        <Afgangstavle />
        <SearchPanel singleSearch />
      </main>
    </>
  );
}
