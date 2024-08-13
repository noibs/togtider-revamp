'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';
import Loading from '../Loading';

interface Departure {
  name: string;
  type: string;
  stop: string;
  time: string;
  id: string;
  line: string;
  messages: string;
  track: string;
  rtTrack: string;
  finalStop: string;
}

interface DataProps {
  Departure: Departure[];
  DepartureBoard?: any;
}

const Afgangselement = ({ data }: { data?: Departure }) => {
  if (!data) return null;

  let color = '#50ae30';

  if (data?.type === 'TOG') {
    color = '#0065aa';
  }

  if (data?.name.includes('Lokalbane')) {
  }

  return (
    <div className={styles.elementContainer}>
      <p className={styles.time}>{data?.time}</p>
      <div className={styles.mid}>
        <p className={styles.trainName} style={{ backgroundColor: color }}>
          {data?.name}
        </p>
        <i className="fa-solid fa-arrow-right"></i>
        <p className={styles.destination}>{data?.finalStop}</p>
        <p className={styles.track}>
          {`Spor: ${data?.rtTrack || data?.track}`}
        </p>
      </div>
    </div>
  );
};

const Afgangstavle = () => {
  const [data, setData] = useState<DataProps | undefined>(undefined);
  const [dataState, setDataState] = useState(false);

  const fetchData = async ({ id }: { id?: string }) => {
    try {
      const res = await fetch(
        `https://rejseplanen.dk/bin/rest.exe/departureBoard?id=${
          id || '6555'
        }&useBus=0&format=json`,
        {
          cache: 'no-store',
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: DataProps = await res.json();
      setData(data.DepartureBoard);
      setDataState(true);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    }
  };

  useEffect(() => {
    const stationId = localStorage.getItem('originId') || '6555';

    fetchData({ id: stationId });
    // const interval = setInterval(() => fetchData({ id: stationId }), 5000);

    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data) {
      setDataState(true);
    }
  }, [data]);

  return (
    <>
      <h1>{data?.Departure[0].stop}</h1>
      {dataState && (
        <div className={styles.tripContainer}>
          {data?.Departure.map((departure, index) => (
            <Afgangselement key={index} data={departure} />
          ))}
        </div>
      )}
      {!dataState && <Loading />}
    </>
  );
};

export default Afgangstavle;
