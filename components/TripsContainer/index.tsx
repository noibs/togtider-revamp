/* This component contains the train cards that display information about upcoming trips. 
It hosts the fetch function that get's data from the Rejseplanen API 
as well as the swap and refresh functions.*/
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
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

// If the user has not searched for a trip, we default to these IDs.
// Rejseplanen v2 uses 7-digit extIds (the old v1 IDs like 6555 are rejected).
const roskildeId = '8600617';
const ringstedId = '8600611';

// v1 IDs were short (4–5 digits); v2 extIds are 7 digits starting with "86".
// Anything that doesn't match is stale localStorage from before the migration —
// fall back to the default so we don't immediately 400 the API.
const isValidStationId = (id: string | null | undefined): id is string =>
  !!id && /^86\d{5}$/.test(id);

const getPosition = () => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    try {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        // Coarse location is plenty for "are you closer to A or B"; we'd rather
        // hit the OS's cached fix and move on than wait for a fresh GPS lock.
        enableHighAccuracy: false,
        maximumAge: Infinity,
        timeout: 3000,
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
  // The state that if en error occured
  const [error, setError] = useState(false);
  // The state that determines if the trip has multiple stops
  const [multiStop, setMultiStop] = useState([false, false, false]);

  // The fetch function that gets the trips from the Rejseplanen API
  const fetchTrips = useCallback(async () => {
    // We get the origin and destination IDs from localStorage. Reject stale v1
    // IDs (anything not a 7-digit 86xxxxx extId) so they don't 400 the API.
    const storedOrigin = localStorage?.getItem('originId');
    const storedDest = localStorage?.getItem('destId');
    originId = isValidStationId(storedOrigin) ? storedOrigin : ringstedId;
    destId = isValidStationId(storedDest) ? storedDest : roskildeId;
    if (storedOrigin && !isValidStationId(storedOrigin)) {
      localStorage.setItem('originId', originId);
    }
    if (storedDest && !isValidStationId(storedDest)) {
      localStorage.setItem('destId', destId);
    }

    if (originId === destId) {
      originId = ringstedId;
      destId = roskildeId;
      localStorage.setItem('originId', originId);
      localStorage.setItem('destId', destId);
    }

    setLoading(true);
    setError(false);
    setMultiStop([false, false, false]);
    // We add the loading class to the tripContainer
    const tripContainer = document.querySelectorAll('#trip');
    tripContainer.forEach((element) => element.classList.add('loading'));

    const useLocation = localStorage.getItem('useLocation');

    if (useLocation === 'true' && !locationHasRun) {
      try {
        // Check if the browser supports geolocation
        if (navigator.geolocation) {
          // Attempt to get the user's current position
          const position = await getPosition();
          // Store long and lat in a variable:
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // Resolve coords for both stations via Rejseplanen v2 location.details
          // (one call, pipe-separated ids). products=0 keeps the response small.
          const detailRes = await fetch(
            `/api/rejseplanen/location.details?id=${encodeURIComponent(
              `${originId}|${destId}`
            )}&products=0&attributes=0&infotexts=0`
          );
          const detailData = await detailRes.json();
          const stops: any[] = (detailData.stopLocationOrCoordLocation ?? [])
            .map((entry: any) => entry.StopLocation)
            .filter(Boolean);

          const coordsByExtId = new Map<string, { lat: number; lon: number }>();
          for (const stop of stops) {
            if (stop?.extId && typeof stop.lat === 'number' && typeof stop.lon === 'number') {
              coordsByExtId.set(String(stop.extId), { lat: stop.lat, lon: stop.lon });
            }
          }
          const originCoords = coordsByExtId.get(originId);
          const destCoords = coordsByExtId.get(destId);

          if (originCoords && destCoords) {

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
            console.error(
              'Origin or Destination coords missing from location.details response'
            );
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

    // We fetch the trips from the Rejseplanen API (v2)
    // products=1311 = ICE+IC+Re+other-train+S-tog+Letbane+Metro (excludes bus/ferry)
    if (locationHasRun || useLocation === 'false') {
      try {
        const res = await fetch(
          `/api/rejseplanen/trip?originId=${originId}&destId=${destId}&products=1311&numF=3`,
          {
            cache: 'no-store',
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // v2 puts trips at data.Trip and legs at trip.LegList.Leg.
        // Times include seconds ("HH:MM:SS") — strip to "HH:MM" to match the
        // shape TrainCard renders.
        const stripSeconds = (t?: string) => t?.slice(0, 5);
        const normalizeStop = (stop: any) =>
          stop && {
            ...stop,
            time: stripSeconds(stop.time),
            rtTime: stripSeconds(stop.rtTime),
          };

        const trips = [0, 1, 2].map(index => {
          const legs = data.Trip?.[index]?.LegList?.Leg;
          if (!legs) return null;

          const legArray = Array.isArray(legs) ? legs : [legs];

          if (legArray.length > 1) {
            setMultiStop(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }

          const first = legArray[0];
          return {
            ...first,
            Origin: normalizeStop(first.Origin),
            Destination: normalizeStop(first.Destination),
          };
        });

        const [trip1, trip2, trip3] = trips;

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
        setError(true);

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

        {trips.trip1 && (
          <TrainCard trip={trips.trip1} multiStop={multiStop[0]} />
        )}
        {trips.trip2 && (
          <TrainCard trip={trips.trip2} multiStop={multiStop[1]} />
        )}
        {trips.trip3 && (
          <TrainCard trip={trips.trip3} multiStop={multiStop[2]} />
        )}
      </div>
      {error && (
        <div className={styles.errorContainer}>
          <AlertTriangle />
          <h2>Der opstod en fejl</h2>
          <p>
            Der opstod en fejl, du har muligvis ikke nogen forbindelse til
            internettet. Prøv at opdatere siden.
          </p>
        </div>
      )}
      {!loadSkeleton && (
        <BtnContainer refreshBtn={updateTrips} swapBtn={swapTrips} />
      )}
      {loading && <Loading />}
    </>
  );
};

export default TripsContainer;
