/* This component contains the train cards that display information about upcoming trips. 
It hosts the fetch function that get's data from the Rejseplanen API 
as well as the swap and refresh functions.*/
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import TrainCard from '@/components/TrainCard';
import styles from './page.module.scss';
import Loading from '../Loading';
import SkeletonLoader from '../SkeletonLoader';
import BtnContainer from '../BtnContainer';

// The boolean that determines if the skeleton loader should be displayed
let loadSkeleton = true;
// We initialize the origin and destination IDs
let originId: string, destId: string;

// Define variable that stops useLocation from running multiple times
let locationHasRun = false;

// If the user has not searched for a trip, we default to these IDs
const roskildeId = '6555';
const ringstedId = '39761';

const getPosition = () => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    try {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 5000,
      });
    } catch (error) {
      // Handle the timeout error here
      console.error('Timeout error:', error);
      locationHasRun = true;
    }
  });
};

const TripsContainer = () => {
  // The state that holds the trip objects
  const [trips, setTrips] = useState({ trip1: null, trip2: null, trip3: null });
  // The state that determines if the page is loading
  const [loading, setLoading] = useState(true);

  // The fetch function that gets the trips from the Rejseplanen API
  const fetchTrips = useCallback(async () => {
    // We get the origin and destination IDs from localStorage, if they are not set we default to the IDs above
    originId = localStorage?.getItem('originId') || ringstedId;
    destId = localStorage?.getItem('destId') || roskildeId;

    setLoading(true);
    // We add the loading class to the tripContainer
    const tripContainer = document.querySelectorAll('#trip');
    tripContainer.forEach((element) => element.classList.add('loading'));

    const useLocation = localStorage.getItem('useLocation');

    if (useLocation === 'true' && !locationHasRun) {
      interface stationData {
        stationName: string;
        data: {
          stationId: string;
          coords: {
            lat: number;
            lon: number;
          };
        };
      }

      try {
        // Check if the browser supports geolocation
        if (navigator.geolocation) {
          // Attempt to get the user's current position
          const position = await getPosition();
          // Store long and lat in a variable:
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Fetch the stations.json file
          const response = await fetch('/data/stations.json');
          const stations = await response.json();

          const origin = stations.find(
            (station: stationData) => station.data.stationId === originId
          );
          const destination = stations.find(
            (station: stationData) => station.data.stationId === destId
          );

          if (origin && destination) {
            const originCoords = {
              lat: origin.data.coords.lat,
              lon: origin.data.coords.lon,
            };
            const destCoords = {
              lat: destination.data.coords.lat,
              lon: destination.data.coords.lon,
            };

            // Check if the user is closest to the origin or destination
            const originDistance = Math.sqrt(
              Math.pow(lat - originCoords.lat, 2) +
                Math.pow(lon - originCoords.lon, 2)
            );

            const destDistance = Math.sqrt(
              Math.pow(lat - destCoords.lat, 2) +
                Math.pow(lon - destCoords.lon, 2)
            );

            if (originDistance > destDistance) {
              let tempOrigin = originId;
              let tempDest = destId;
              originId = tempDest;
              destId = tempOrigin;
              localStorage.setItem('originId', originId);
              localStorage.setItem('destId', destId);
              locationHasRun = true;
            } else {
              locationHasRun = true;
            }
          } else {
            console.error('Origin or Destination not found in stations.json');
            locationHasRun = true;
          }
        }
      } catch (error) {
        console.error('Error getting location:', error);
        locationHasRun = true;
        localStorage.setItem('useLocation', 'false');
      }
    } else {
      locationHasRun = true;
    }

    // We fetch the trips from the Rejseplanen API
    if (locationHasRun || useLocation === 'false') {
      try {
        const res = await fetch(
          `https://rejseplanen.dk/bin/rest.exe/trip?originId=${originId}&destId=${destId}&useBus=0&format=json`,
          {
            // We set the cache to no-store to prevent caching
            cache: 'no-store',
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // We get the first three trips from the response, we check if they trip has multiple legs (stops) or not. (This will be used later)
        const trip1 = data.TripList.Trip[0]?.Leg
          ? Array.isArray(data.TripList.Trip[0].Leg)
            ? data.TripList.Trip[0].Leg[0]
            : data.TripList.Trip[0].Leg
          : null;

        const trip2 = data.TripList.Trip[1]?.Leg
          ? Array.isArray(data.TripList.Trip[1].Leg)
            ? data.TripList.Trip[1].Leg[0]
            : data.TripList.Trip[1].Leg
          : null;

        const trip3 = data.TripList.Trip[2]?.Leg
          ? Array.isArray(data.TripList.Trip[2].Leg)
            ? data.TripList.Trip[2].Leg[0]
            : data.TripList.Trip[2].Leg
          : null;

        // 50 ms delay to ensure smooth loading transition.
        setTimeout(() => {
          tripContainer.forEach((element) =>
            element.classList.remove('loading')
          );
        }, 50);

        loadSkeleton = false;

        // This loader is used on the initial load to ensure a smooth page load.
        const loaderElement = document.querySelector('#loader');
        loaderElement?.classList.add('loading');
        setTimeout(() => {
          loaderElement?.classList.add('hide');
        }, 500);

        setLoading(false);
        return { trip1, trip2, trip3 };
      } catch (error) {
        console.error('Failed to fetch trips:', error);
        tripContainer.forEach((element) => element.classList.remove('loading'));

        loadSkeleton = false;
        setLoading(false);

        const loaderElement = document.querySelector('#loader');
        loaderElement?.classList.add('loading');

        return { trip1: null, trip2: null, trip3: null };
      }
    }
  }, []);

  // The function that updates the trips (this is used by the refresh button and swap button)
  const updateTrips = useCallback(async () => {
    const newTrips = await fetchTrips();
    if (newTrips) {
      setTrips(newTrips);
    } else {
      window.location.reload();
    }
  }, [fetchTrips]);

  // The function that swaps the origin and destination IDs, then calls updateTrips
  const swapTrips = async () => {
    let tempOrigin = originId;
    let tempDest = destId;
    localStorage.setItem('originId', tempDest);
    localStorage.setItem('destId', tempOrigin);

    const newTrips = await fetchTrips();
    if (newTrips) {
      setTrips(newTrips);
    } else {
      window.location.reload();
    }
  };

  // We call updateTrips on the initial load
  useEffect(() => {
    updateTrips();
  }, [updateTrips]);

  // We add an event listener for the custom event 'searchedChange' that is triggered when the user searches
  useEffect(() => {
    const handleCustomEvent = () => {
      if (localStorage.getItem('searched') === 'true') {
        updateTrips();
        localStorage.removeItem('searched');
      }
    };

    window.addEventListener('searchedChange', handleCustomEvent);

    return () => {
      window.removeEventListener('searchedChange', handleCustomEvent);
    };
  }, [updateTrips]);

  return (
    <>
      <div className={styles.loader} id="loader" />
      <div className={styles.tripContainer} id="tripContainer">
        {loadSkeleton && (
          <>
            <SkeletonLoader height="200px" width="300px" />
            <SkeletonLoader height="200px" width="300px" />
            <SkeletonLoader height="200px" width="300px" />
          </>
        )}

        {trips.trip1 && <TrainCard trip={trips.trip1} />}
        {trips.trip2 && <TrainCard trip={trips.trip2} />}
        {trips.trip3 && <TrainCard trip={trips.trip3} />}
        {!trips.trip1 && !trips.trip2 && trips.trip3 && (
          <h2>No trips were found.</h2>
        )}
      </div>
      {!loadSkeleton && (
        <BtnContainer refreshBtn={updateTrips} swapBtn={swapTrips} />
      )}
      {loading && <Loading />}
    </>
  );
};

export default TripsContainer;
