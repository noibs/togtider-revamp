import Image from 'next/image';
import styles from './page.module.scss';
import TrainCard from '@/components/TrainCard';
import Watermark from '@/components/Watermark';
import TripsContainer from '@/components/TripsContainer';
import ThemeBtn from '@/components/Buttons/ThemeBtn';
import HeadBtnContainer from '@/components/HeadBtnContainer';

export default function Home() {
  return (
    <>
      <HeadBtnContainer />
      <main className={styles.main}>
        <div className={styles.header}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            {/*Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.*/}
            <path d="M96 0C43 0 0 43 0 96L0 352c0 48 35.2 87.7 81.1 94.9l-46 46C28.1 499.9 33.1 512 43 512l39.7 0c8.5 0 16.6-3.4 22.6-9.4L160 448l128 0 54.6 54.6c6 6 14.1 9.4 22.6 9.4l39.7 0c10 0 15-12.1 7.9-19.1l-46-46c46-7.1 81.1-46.9 81.1-94.9l0-256c0-53-43-96-96-96L96 0zM64 128c0-17.7 14.3-32 32-32l80 0c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32l-80 0c-17.7 0-32-14.3-32-32l0-96zM272 96l80 0c17.7 0 32 14.3 32 32l0 96c0 17.7-14.3 32-32 32l-80 0c-17.7 0-32-14.3-32-32l0-96c0-17.7 14.3-32 32-32zM64 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm288-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
          </svg>
          <h1>Togtider</h1>
        </div>
        <TripsContainer />
      </main>
      <Watermark />
    </>
  );
}
