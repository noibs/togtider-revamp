'use client';
import React, { useState, useEffect } from 'react';
import TrainCard from '@/components/TrainCard';
import styles from './page.module.scss';
import Loading from '../Loading';
import SkeletonLoader from '../SkeletonLoader';
import BtnContainer from '../BtnContainer';

let loadSkeleton = true;
let loading = true;

const roskildeId = '6555';
const ringstedId = '39761';
let originId = ringstedId;
let destId = roskildeId;

export const fetchTrips = async () => {
  loading = true;
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

    tripContainer.forEach((element) => element.classList.remove('loading'));
    loadSkeleton = false;
    loading = false;
    return { trip1, trip2, trip3 };
  } catch (error) {
    console.error('Failed to fetch trips:', error);
    tripContainer.forEach((element) => element.classList.remove('loading'));

    loadSkeleton = false;
    loading = false;
    return { trip1: null, trip2: null, trip3: null };
  }
};

const TripsContainer = () => {
  const [trips, setTrips] = useState({ trip1: null, trip2: null, trip3: null });

  const updateTrips = async () => {
    const newTrips = await fetchTrips();
    setTrips(newTrips);
  };

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
  }, []);

  return (
    <>
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
      {loading && <Loading />}
      <BtnContainer refreshBtn={updateTrips} swapBtn={swapTrips} />
    </>
  );
};

export default TripsContainer;
