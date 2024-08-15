// This component contains the search panel and all it's function. It's used to search for routes between two stations.
'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';

// This interface is used to define the structure of the station object
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

// !! Fix problem where destId and originId can become the same during singleSearch. !!

export const SearchPanel = ({ singleSearch }: { singleSearch?: boolean }) => {
  // These two states are used to store the id of the origin and destination station
  const [originId, setOriginId] = useState<string | null>(null);
  const [destId, setDestId] = useState<string | null>(null);

  // This state is used to store all available the stations
  const [stations, setStations] = useState<Station[]>([]);

  // This state is used to store the search results
  const [searchResults, setSearchResults] = useState<Station[]>([]);

  // This state is used to determine if the search results are visible or not
  const [isResultsVisible, setIsResultsVisible] = useState(false);

  // This state is used to determine which input is active
  const [activeInput, setActiveInput] = useState<
    'origin' | 'destination' | null
  >(null);

  // This function is used to display an error message to the left of the search button
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

  // This useEffect hook is used to fetch the stations from the server on component mount
  useEffect(() => {
    fetch('./data/stations.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch stations');
        }
        return res.json();
      })
      .then((data: Station[]) => {
        // Sort the stations alphabetically
        const sortedStations = data.sort((a, b) =>
          a.stationName.localeCompare(b.stationName)
        );
        // Save the sorted stations to the state
        setStations(sortedStations);
      })
      .catch((err) => {
        console.error('There was an error fetching the stations', err);
      });
  }, []);

  // This useEffect hook is used to show the search results when the state changes
  useEffect(() => {
    if (isResultsVisible) {
      // This timer is used to prevent the results from being displayed before the component is rendered
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

  // This useEffect hook is used to close the search results when the user clicks outside of the search panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Gets all elements that are allowed to be clicked
      const resultsContainer = document.getElementById('resultsContainer');
      const originInput = document.getElementById('origin-input');
      const destinationInput = document.getElementById('destination-input');

      // Closes the search results if the user clicks outside of the search panel
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

    // Event listeners:
    if (isResultsVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isResultsVisible]);

  // This function is used to search for stations based on the query
  const searchStation = (query: string) => {
    return (
      stations
        .filter((station) =>
          // Makes the search case insensitive for better matching
          station.stationName.toLowerCase().includes(query.toLowerCase())
        )
        // Limits the search results to 5
        .slice(0, 5)
    );
  };

  // This function is used to handle the input change event
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    // This parameter is used to determine which input is active
    inputType: 'origin' | 'destination'
  ) => {
    const query = event.target.value;
    const results = searchStation(query);
    setSearchResults(results);
    setIsResultsVisible(true);
    setActiveInput(inputType);
  };

  // This function is used to handle the selection of a search result
  const handleResultClick = (
    station: Station,
    // This parameter is used to determine which input is active
    inputType: 'origin' | 'destination'
  ) => {
    const inputElement = document.getElementById(
      `${inputType}-input`
    ) as HTMLInputElement;
    inputElement.value = station.stationName;

    // Sets the originId or destId based on the inputType
    if (inputType === 'origin') {
      setOriginId(station.data.stationId.toString());
    } else if (inputType === 'destination') {
      setDestId(station.data.stationId.toString());
    }

    setIsResultsVisible(false);
    setActiveInput(null);
  };

  // This function is used to handle key events such as escape and enter.
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    inputType: 'origin' | 'destination'
  ) => {
    // Closes the search results if the user presses the escape key
    if (event.key === 'Escape') {
      setIsResultsVisible(false);
      setActiveInput(null);
      // Unfocuses the input field
      (event.target as HTMLInputElement).blur();

      // If enter is pressed and there are search results, the first result is selected
    } else if (event.key === 'Enter' && searchResults.length > 0) {
      handleResultClick(searchResults[0], inputType);
      (event.target as HTMLInputElement).blur();

      // If the user presses escape while in the top input, the bottom input is focused
      if (inputType === 'origin' && !singleSearch) {
        const destinationInput = document.querySelector(
          '#destination-input'
        ) as HTMLInputElement;
        if (destinationInput) {
          destinationInput.focus();
        }
      }

      // If the user presses enter while in the bottom input, the search button is activated
      if (
        inputType === 'destination' ||
        (singleSearch && inputType === 'origin')
      ) {
        const submitBtn = document.querySelector(
          '#submitBtn'
        ) as HTMLButtonElement;
        if (submitBtn) {
          submitBtn.focus();
        }
      }
    }
  };

  // This function is used to handle the search button click
  const handleSearchClick = () => {
    // Gets the input fields
    const originInput = document.getElementById(
      'origin-input'
    ) as HTMLInputElement;
    const destinationInput = document?.getElementById(
      'destination-input'
    ) as HTMLInputElement;

    // Checks if the originId and dest are set, if not, an error message is displayed
    if (!originId || (!singleSearch && !destId)) {
      showErrorMessage(
        singleSearch ? 'Vælg en station.' : 'Vælg start- og endestation.'
      );

      // Resets the input fields
      originInput.value = '';
      if (destinationInput) destinationInput.value = '';
      return;
    }

    // Checks if the originId and destId are the same, if so, an error message is displayed
    if (originId === destId) {
      if (singleSearch) return;

      showErrorMessage('Start- og endestation kan ikke være det samme.');

      // Resets the input fields
      originInput.value = '';
      if (destinationInput) destinationInput.value = '';
      return;
    }

    // If no errors are presesnt, the originId and destId are saved to the local storage
    localStorage.setItem('originId', originId);
    if (destId && destinationInput) localStorage.setItem('destId', destId);

    // Closes the panel
    closePanel();

    /* Dispatches a custom event to notify the app that a search has been made, 
    when received by the TripsContainer, a refresh will take place. */
    localStorage.setItem('searched', 'true');
    const event = new CustomEvent('searchedChange', {
      detail: {
        originId,
        destId,
      },
    });
    window.dispatchEvent(event);

    setTimeout(() => {
      // Resets the input fields
      originInput.value = '';
      if (destinationInput) destinationInput.value = '';
    }, 50);
  };

  // This function is used to close the search panel
  const closePanel = () => {
    const container = document.querySelector('#searchContainer') as HTMLElement;

    // Fades out the search panel
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
          <h2 className={styles.title}>
            {singleSearch ? 'Find afgangstavle' : 'Find rute'}
          </h2>
          <button className={styles.x} onClick={closePanel}>
            <i className="fa-regular fa-xmark" />
          </button>
        </span>
        <p className={styles.description}>
          {singleSearch
            ? 'Vælg station.'
            : 'Vælg start og destination for søge efter en rute.'}
        </p>
        <div className={styles.inputContainer}>
          <span className={styles.input}>
            {singleSearch ? 'Station:' : 'Start:'}
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
          {!singleSearch && (
            <>
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
                  <div
                    id="resultsContainer"
                    className={styles.resultsContainer}
                  >
                    {searchResults.length === 0 ? (
                      <p id="no_results" className={styles.noResults}>
                        Ingen resultater. Tjek listen over understøttede
                        stationer{' '}
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
                          onClick={() =>
                            handleResultClick(station, 'destination')
                          }
                        >
                          {station.stationName}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
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
