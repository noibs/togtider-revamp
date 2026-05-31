import styles from './page.module.scss';
import TripsContainer from '@/components/TripsContainer';
import HeadBtnContainer from '@/components/HeadBtnContainer';
import SettingsPanel from '@/components/SettingsPanel';
import { SearchPanel } from '@/components/SearchPanel';
import Watermark from '@/components/Watermark';
import { TrainFront } from 'lucide-react';

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <SettingsPanel />
        <SearchPanel />
        <HeadBtnContainer />
        <div className={styles.header}>
          <TrainFront />
          <h1>Togtider</h1>
        </div>
        <TripsContainer />
      </main>
      <Watermark />
    </>
  );
}
