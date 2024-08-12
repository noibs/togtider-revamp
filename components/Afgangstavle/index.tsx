'use client';
import React, { useEffect, useState } from 'react';
import styles from './page.module.scss';
import Afgangselement from './Afgangselement';

const Afgangstavle = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://rejseplanen.dk/bin/rest.exe/departureBoard?id=6555&useBus=0&format=json`,
        {
          cache: 'no-store',
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data.DepartureBoard.Departure);
      setData(data.DepartureBoard.Departure);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      console.log('Data fetched', data);
    }
  }, [data]);

  return (
    <div className={styles.tripContainer}>
      <Afgangselement />
    </div>
  );
};

export default Afgangstavle;
