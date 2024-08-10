'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';

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
  const [stations, setStations] = useState<Station[]>([]);
  const [searchResults, setSearchResults] = useState<Station[]>([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [activeInput, setActiveInput] = useState<
    'origin' | 'destination' | null
  >(null);

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
      }, 100);
      return () => clearTimeout(timer);
    } else {
      const resultsContainer = document.getElementById('resultsContainer');
      if (resultsContainer) {
        resultsContainer.classList.remove(styles.visible);
      }
    }
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
      if (
        localStorage.getItem('destId') === station.data.stationId.toString()
      ) {
        console.error('Origin and destination stations cannot be the same');
        setIsResultsVisible(false);
        return;
      }

      localStorage.setItem('originId', station.data.stationId.toString());
      localStorage.setItem('originName', station.stationName);
      localStorage.setItem('oLat', station.data.coords.lat.toString());
      localStorage.setItem('oLon', station.data.coords.lon.toString());
    } else if (inputType === 'destination') {
      if (
        localStorage.getItem('originId') === station.data.stationId.toString()
      ) {
        console.error('Origin and destination stations cannot be the same');
        setIsResultsVisible(false);
        return;
      }

      localStorage.setItem('destId', station.data.stationId.toString());
      localStorage.setItem('destName', station.stationName);
      localStorage.setItem('dLat', station.data.coords.lat.toString());
      localStorage.setItem('dLon', station.data.coords.lon.toString());
    }

    setIsResultsVisible(false);
    setActiveInput(null);
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
          <button className={styles.searchBtn}>Søg</button>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
