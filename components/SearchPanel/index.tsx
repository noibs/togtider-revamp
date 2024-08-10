'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';
import { useRouter } from 'next/router';

interface Station {
  stationName: string;
  data: {
    stationId: number;
    coords: {
      lat: number;
      lon: number;
    };
  };
}

const SearchPanel = () => {
  let originName, oLat, oLon, destName, dLat, dLon;
  const [originId, setOriginId] = useState<string | null>(null);
  const [destId, setDestId] = useState<string | null>(null);

  const [stations, setStations] = useState<Station[]>([]);
  const [searchResults, setSearchResults] = useState<Station[]>([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [activeInput, setActiveInput] = useState<
    'origin' | 'destination' | null
  >(null);

  const showErrorMessage = (msg: string) => {
    const errorContainer = document.getElementById('error') as HTMLElement;
    const errorEl = document.getElementById('error-msg') as HTMLElement;
    errorEl.textContent = msg;
    errorContainer.setAttribute('data-enabled', 'true');
    setTimeout(() => {
      errorContainer.style.opacity = '1';

      setTimeout(() => {
        errorContainer.removeAttribute('style');

        setTimeout(() => {
          errorContainer.removeAttribute('data-enabled');
          errorContainer.removeAttribute('style');
        }, 200);
      }, 10000);
    }, 10);
  };

  useEffect(() => {
    fetch('./data/stations.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch stations');
        }
        return res.json();
      })
      .then((data: Station[]) => {
        const sortedStations = data.sort((a, b) =>
          a.stationName.localeCompare(b.stationName)
        );
        setStations(sortedStations);
      })
      .catch((err) => {
        console.error('There was an error fetching the stations', err);
      });
  }, []);

  useEffect(() => {
    if (isResultsVisible) {
      const timer = setTimeout(() => {
        const resultsContainer = document.getElementById('resultsContainer');
        if (resultsContainer) {
          resultsContainer.classList.add(styles.visible);
        }
      }, 10);
      return () => clearTimeout(timer);
    } else {
      const resultsContainer = document.getElementById('resultsContainer');
      if (resultsContainer) {
        resultsContainer.classList.remove(styles.visible);
      }
    }
  }, [isResultsVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const resultsContainer = document.getElementById('resultsContainer');
      const originInput = document.getElementById('origin-input');
      const destinationInput = document.getElementById('destination-input');
      if (
        resultsContainer &&
        !resultsContainer.contains(event.target as Node) &&
        originInput &&
        !originInput.contains(event.target as Node) &&
        destinationInput &&
        !destinationInput.contains(event.target as Node)
      ) {
        setIsResultsVisible(false);
        setActiveInput(null);
      }
    };

    if (isResultsVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isResultsVisible]);

  const searchStation = (query: string) => {
    return stations
      .filter((station) =>
        station.stationName.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    inputType: 'origin' | 'destination'
  ) => {
    const query = event.target.value;
    const results = searchStation(query);
    setSearchResults(results);
    setIsResultsVisible(true);
    setActiveInput(inputType);
  };

  const handleResultClick = (
    station: Station,
    inputType: 'origin' | 'destination'
  ) => {
    const inputElement = document.getElementById(
      `${inputType}-input`
    ) as HTMLInputElement;
    inputElement.value = station.stationName;

    if (inputType === 'origin') {
      originName = station.stationName;
      oLat = station.data.coords.lat.toString();
      oLon = station.data.coords.lon.toString();
      setOriginId(station.data.stationId.toString());
    } else if (inputType === 'destination') {
      destName = station.stationName;
      dLat = station.data.coords.lat.toString();
      dLon = station.data.coords.lon.toString();
      setDestId(station.data.stationId.toString());
    }

    setIsResultsVisible(false);
    setActiveInput(null);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    inputType: 'origin' | 'destination'
  ) => {
    if (event.key === 'Escape') {
      setIsResultsVisible(false);
      setActiveInput(null);
      (event.target as HTMLInputElement).blur();
    } else if (event.key === 'Enter' && searchResults.length > 0) {
      handleResultClick(searchResults[0], inputType);
      (event.target as HTMLInputElement).blur();

      if (inputType === 'origin') {
        const destinationInput = document.querySelector(
          '#destination-input'
        ) as HTMLInputElement;
        if (destinationInput) {
          destinationInput.focus();
        }
      }

      if (inputType === 'destination') {
        const submitBtn = document.querySelector(
          '#submitBtn'
        ) as HTMLButtonElement;
        if (submitBtn) {
          submitBtn.focus();
        }
      }
    }
  };

  const handleSearchClick = () => {
    const originInput = document.getElementById(
      'origin-input'
    ) as HTMLInputElement;
    const destinationInput = document.getElementById(
      'destination-input'
    ) as HTMLInputElement;

    if (!originId || !destId) {
      showErrorMessage('Vælg start- og endestation.');

      originInput.value = '';
      destinationInput.value = '';
      return;
    }

    if (originId === destId) {
      showErrorMessage('Start- og endestation kan ikke være det samme.');

      originInput.value = '';
      destinationInput.value = '';
      return;
    }
    localStorage.setItem('originId', originId);
    localStorage.setItem('destId', destId);

    closePanel();

    localStorage.setItem('searched', 'true');
    const event = new CustomEvent('searchedChange', {
      detail: {
        originId,
        destId,
      },
    });
    window.dispatchEvent(event);

    setTimeout(() => {
      originInput.value = '';
      destinationInput.value = '';
    }, 50);
  };

  const closePanel = () => {
    const container = document.querySelector('#searchContainer') as HTMLElement;
    if (container) {
      container.style.opacity = '0';
      setTimeout(() => {
        container.removeAttribute('data-enabled');
        container.removeAttribute('style');
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
            <input
              id="origin-input"
              type="text"
              placeholder="Søg efter en station..."
              onChange={(e) => handleInputChange(e, 'origin')}
              onKeyDown={(e) => handleKeyDown(e, 'origin')}
            />
          </span>
          {isResultsVisible && activeInput === 'origin' && (
            <div className={styles.searchGroup}>
              <div id="resultsContainer" className={styles.resultsContainer}>
                {searchResults.length === 0 ? (
                  <p id="no_results" className={styles.noResults}>
                    Ingen resultater. Tjek listen over understøttede stationer{' '}
                    <a target="_blank" href="/stationer">
                      her
                    </a>
                    .
                  </p>
                ) : (
                  searchResults.map((station) => (
                    <p
                      key={station.data.stationId}
                      id="result"
                      className={styles.result}
                      onClick={() => handleResultClick(station, 'origin')}
                    >
                      {station.stationName}
                    </p>
                  ))
                )}
              </div>
            </div>
          )}
          <span className={styles.input}>
            Destination:
            <input
              id="destination-input"
              type="text"
              placeholder="Søg efter en station..."
              onChange={(e) => handleInputChange(e, 'destination')}
              onKeyDown={(e) => handleKeyDown(e, 'destination')}
            />
          </span>
          {isResultsVisible && activeInput === 'destination' && (
            <div className={styles.searchGroup}>
              <div id="resultsContainer" className={styles.resultsContainer}>
                {searchResults.length === 0 ? (
                  <p id="no_results" className={styles.noResults}>
                    Ingen resultater. Tjek listen over understøttede stationer{' '}
                    <a target="_blank" href="/stationer">
                      her
                    </a>
                    .
                  </p>
                ) : (
                  searchResults.map((station) => (
                    <p
                      key={station.data.stationId}
                      id="result"
                      className={styles.result}
                      onClick={() => handleResultClick(station, 'destination')}
                    >
                      {station.stationName}
                    </p>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.btnContainer}>
          <div id="error" className={styles.error}>
            <i className="fa-regular fa-circle-info"></i>
            <p id="error-msg">Start- og endestation kan ikke være det samme.</p>
          </div>
          <button
            id="submitBtn"
            className={styles.searchBtn}
            onClick={handleSearchClick}
          >
            Søg
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
