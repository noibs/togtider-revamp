'use client';
import React, { useEffect } from 'react';
import styles from './page.module.scss';

const SettingsPanel = () => {
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
    <div className={styles.container} id="settingsContainer">
      <div className={styles.card}>
        <span className={styles.head}>
          <h2>Indstillinger</h2>
          <button className={styles.x} onClick={closePanel}>
            <i className="fa-solid fa-xmark" />
          </button>
        </span>

        <div className={styles.settings}>
          <div className={styles.setting}>
            <h3>Brug lokalitetstjenester</h3>
            <p>
              Togtider kan bruge lokalitetstjenester til automatisk at finde ud
              af hvilken station du er tættest på.
            </p>
            <button>Slå til</button>
          </div>

          <div className={styles.setting}>
            <h3>Skift sprog</h3>
            <p>Togtider er også tilgængelig på engelsk. Skift forneden:</p>
            <button>Sprogskifte</button>
          </div>
        </div>

        <div className={styles.footer}>
          <span>
            Lavet med ❤️ af Elliott, tjek siden på{' '}
            <a href="https://github.com/noibs/togtider-revamp">Github</a>.
          </span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
