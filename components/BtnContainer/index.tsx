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
  const openSearchPanel = () => {
    const searchContainer = document.querySelector(
      '#searchContainer'
    ) as HTMLElement;
    if (searchContainer) {
      searchContainer.setAttribute('data-enabled', '');
      setTimeout(() => {
        searchContainer.style.opacity = '1';
      }, 10);
    }
  };

  return (
    <div className={styles.btnContainer}>
      <SearchBtn
        click={openSearchPanel}
        styles={`${styles.btn} ${styles.secondaryBtn}`}
      />
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
