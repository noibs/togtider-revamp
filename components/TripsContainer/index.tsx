'use client';
import React, { useState, useEffect } from 'react';
import TrainCard from '@/components/TrainCard';
import styles from './page.module.scss';

export const fetchTrips = async () => {
  const roskildeId = '6555';
  const borupId = '5426';
  let originId = borupId;
  let destId = roskildeId;

  const res = await fetch(
    `https://rejseplanen.dk/bin/rest.exe/trip?originId=${originId}&destId=${destId}&useBus=0&format=json`,
    {
      cache: 'no-store',
    }
  );

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

  console.log(trip1);

  return { trip1, trip2, trip3 };
};

const TripsContainer = () => {
  const [trips, setTrips] = useState({ trip1: null, trip2: null, trip3: null });

  const updateTrips = async () => {
    const newTrips = await fetchTrips();
    setTrips(newTrips);
  };

  useEffect(() => {
    updateTrips();
  }, []);

  return (
    <div className={styles.tripContainer}>
      {trips.trip1 && <TrainCard trip={trips.trip1} />}
      {trips.trip2 && <TrainCard trip={trips.trip2} />}
      {trips.trip3 && <TrainCard trip={trips.trip3} />}
      {!trips.trip1 && !trips.trip2 && trips.trip3 && (
        <h2>No trips were found.</h2>
      )}
    </div>
  );
};

export default TripsContainer;
