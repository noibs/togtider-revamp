'use client';
import React, { useEffect } from 'react';
import styles from './page.module.scss';

const SearchPanel = () => {
  let container: HTMLElement | null;

  useEffect(() => {
    container = document.querySelector('#settingsContainer');
  }, []);

  const closePanel = () => {
    if (container) {
      container.style.opacity = '0';
      setTimeout(() => {
        container?.removeAttribute('data-enabled');
        container?.removeAttribute('style');
      }, 200);
    }
  };

  return (
    <div className={styles.container} id="searchContainer">
      <div className={styles.card}>
        <span className={styles.head}>
          <h2 className={styles.title}>Find rute</h2>
          <button className={styles.x} onClick={closePanel}>
            <i className="fa-regular fa-xmark" />
          </button>
        </span>
        <p className={styles.description}>
          Vælg start og destination for søge efter en rute.
        </p>
        <div className={styles.inputContainer}>
          <span className={styles.input}>
            Start:
            <input type="text" placeholder="Søg efter en station..." />
          </span>

          <span className={styles.input}>
            Destination:
            <input type="text" placeholder="Søg efter en station..." />
          </span>
        </div>

        <div className={styles.btnContainer}>
          <button className={styles.searchBtn}>Søg</button>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
