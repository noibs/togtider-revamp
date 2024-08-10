/* This component contains the settings panel that is displayed 
when the settings button is clicked. It contains two settings that the user can change. */
'use client';
import React from 'react';
import styles from './page.module.scss';

const SettingsPanel = () => {
  let container: HTMLElement | null;

  // The function that closes the settings panel
  const closePanel = () => {
    container = document.querySelector('#settingsContainer');
    if (container) {
      // Fades out the settings panel and removes it from the DOM
      container.style.opacity = '0';
      setTimeout(() => {
        container?.removeAttribute('data-enabled');
        container?.removeAttribute('style');
      }, 200);
    }
  };

  const resetCache = () => {
    // We clear the cache by setting the localStorage to an empty object
    localStorage.clear();
    // We reload the page to fetch the data again
    window.location.reload();
  };

  return (
    <div className={styles.container} id="settingsContainer">
      <div className={styles.card}>
        <span className={styles.head}>
          <h2>Indstillinger</h2>
          <button className={styles.x} onClick={closePanel}>
            <i className="fa-regular fa-xmark" />
          </button>
        </span>

        <div className={styles.settings}>
          <div className={styles.setting}>
            <h3>Brug lokalitetstjenester</h3>
            <p>
              Togtider kan bruge lokalitetstjenester til automatisk at finde ud
              af hvilken station du er tættest på.
            </p>
            <button aria-label="Turn localization on">Slå til</button>
          </div>

          <div className={styles.setting}>
            <h3>Sprogskifte</h3>
            <p>Togtider er også tilgængelig på engelsk. Skift forneden:</p>
            <button aria-label="Change language">Skift sprog</button>
          </div>

          <div className={styles.setting}>
            <h3>Slet cache</h3>
            <p>
              Nogle gange kan der opstå problemer med at få hentet det rigtige
              data. At slette cachen kan fikse disse problemer.
            </p>
            <button id="primary" onClick={resetCache} aria-label="Wipe cache">
              Nulstil
            </button>
          </div>
        </div>

        <div className={styles.footer}>
          <span>
            Lavet med <span id="invert">❤️</span> af Elliott, tjek siden på{' '}
            <a
              aria-label="Go to project github"
              className="link"
              href="https://github.com/noibs/togtider-revamp"
            >
              Github
            </a>
            .
          </span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
