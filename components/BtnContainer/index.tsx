import React from 'react';
import RefreshBtn from '@/components/RefreshBtn';
import SwapBtn from '@/components/SwapBtn';
import styles from './page.module.scss';

const BtnContainer = ({
  refreshBtn,
  swapBtn,
}: {
  refreshBtn: () => void;
  swapBtn: () => void;
}) => {
  return (
    <div className={styles.btnContainer}>
      <RefreshBtn click={refreshBtn} />
      <SwapBtn click={swapBtn} />
    </div>
  );
};

export default BtnContainer;
