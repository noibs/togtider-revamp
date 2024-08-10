'use client';
import React, { useState, useEffect, useCallback } from 'react';
import TrainCard from '@/components/TrainCard';
import styles from './page.module.scss';
import Loading from '../Loading';
import SkeletonLoader from '../SkeletonLoader';
import BtnContainer from '../BtnContainer';

let loadSkeleton = true;
let loading = true;
let originId: string, destId: string;

const roskildeId = '6555';
const ringstedId = '39761';

const TripsContainer = () => {
  const [trips, setTrips] = useState({ trip1: null, trip2: null, trip3: null });
  const [loading, setLoading] = useState(true);

  const fetchTrips = useCallback(async () => {
    originId = localStorage?.getItem('originId') || ringstedId;
    destId = localStorage?.getItem('destId') || roskildeId;

    setLoading(true);
    const tripContainer = document.querySelectorAll('#trip');
    tripContainer.forEach((element) => element.classList.add('loading'));

    try {
      const res = await fetch(
        `https://rejseplanen.dk/bin/rest.exe/trip?originId=${originId}&destId=${destId}&useBus=0&format=json`,
        {
          cache: 'no-store',
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

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
        tripContainer.forEach((element) => element.classList.remove('loading'));
      }, 50);

      loadSkeleton = false;

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
  }, []);

  const updateTrips = useCallback(async () => {
    const newTrips = await fetchTrips();
    setTrips(newTrips);
  }, [fetchTrips]);

  const swapTrips = async () => {
    let tempOrigin = originId;
    let tempDest = destId;
    originId = tempDest;
    destId = tempOrigin;
    const newTrips = await fetchTrips();
    setTrips(newTrips);
  };

  useEffect(() => {
    updateTrips();
  }, [updateTrips]);

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
      {loading && <Loading styles={styles.loadContainer} />}
    </>
  );
};

export default TripsContainer;
