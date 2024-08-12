/* This component contains the settings panel that is displayed 
when the settings button is clicked. It contains two settings that the user can change. */
'use client';
import React, { useEffect, useState } from 'react';
import styles from './page.module.scss';

const SettingsPanel = () => {
  const [useLocation, setUseLocation] = useState(false);
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

  const enableLocation = () => {
    const useLocation = localStorage.getItem('useLocation');

    if (useLocation === 'true') {
      // If the user has already enabled location services, we disable it
      localStorage.setItem('useLocation', 'false');
      setUseLocation(false);
    } else {
      // If the user has not enabled location services, we enable it
      localStorage.setItem('useLocation', 'true');
      setUseLocation(true);
      // Prompt the user for location access
      navigator.geolocation.getCurrentPosition(
        (position) => {
          window.location.reload();
        },
        () => {
          // If the user denies location access, we disable location services
          localStorage.setItem('useLocation', 'false');
          setUseLocation(false);
          alert(
            'Du har afvist adgang til din lokation. Du kan slå lokalitetstjenester til igen i indstillinger.'
          );
        }
      );
    }
  };

  const resetCache = () => {
    // We clear the cache by setting the localStorage to an empty object
    localStorage.clear();
    // We reload the page to fetch the data again
    window.location.reload();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const locStatus = localStorage.getItem('useLocation') === 'true';
      setUseLocation(locStatus);
    }
  }, []);

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
            <button
              onClick={enableLocation}
              aria-label="Turn localization on/off"
            >
              {useLocation ? 'Slå fra' : 'Slå til'}
            </button>
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
