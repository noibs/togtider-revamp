// This component is a container for the three main buttons displayed below the cards.
import React from 'react';
import RefreshBtn from '@/components/Buttons/RefreshBtn';
import SwapBtn from '@/components/Buttons/SwapBtn';
import styles from './page.module.scss';
import SearchBtn from '../Buttons/SearchBtn';

const BtnContainer = ({
  refreshBtn,
  swapBtn,
}: {
  refreshBtn: () => void;
  swapBtn: () => void;
}) => {
  return (
    <div className={styles.btnContainer}>
      <SearchBtn styles={`${styles.btn} ${styles.secondaryBtn}`} />
      <RefreshBtn
        styles={`${styles.btn} ${styles.primaryBtn}`}
        click={refreshBtn}
      />
      <SwapBtn
        styles={`${styles.btn} ${styles.secondaryBtn}`}
        click={swapBtn}
      />
    </div>
  );
};

export default BtnContainer;
