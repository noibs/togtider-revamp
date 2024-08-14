'use client';
import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';
import Loading from '../Loading';
import Link from 'next/link';
import SearchBtn, { openSearchPanel } from '../Buttons/SearchBtn';
import Mapbox from '../Mapbox';

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

const isMobile = () => {
  const userAgent = navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  )
    ? true
    : false;
};

const Afgangselement = ({ data }: { data?: Departure }) => {
  if (!data) return null;

  let color = '#50ae30';

  if (data?.type === 'TOG') {
    color = '#0065aa';
  }

  if (data?.type === 'M') {
    color = '#009ac0';
  }

  if (data?.type === 'S') {
    color = '#b8211c';
  }

  if (data?.name.includes('Lokalbane')) {
    data.name = data.name.replace('Lokalbane', 'LB');
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

const Afgangstavle = ({ sId }: { sId?: string }) => {
  const [data, setData] = useState<DataProps | undefined>(undefined);
  const [dataState, setDataState] = useState(false);

  const fetchData = async ({ id }: { id?: string }) => {
    const stationId = localStorage.getItem('originId') || '6555';
    try {
      const res = await fetch(
        `https://rejseplanen.dk/bin/rest.exe/departureBoard?id=${stationId}&useBus=0&format=json`,
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
    fetchData({});
    //const interval = setInterval(() => fetchData({}), 5000);

    //return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data) {
      setDataState(true);
    }
  }, [data]);

  // We add an event listener for the custom event 'searchedChange' that is triggered when the user searches
  useEffect(() => {
    const handleCustomEvent = () => {
      if (localStorage.getItem('searched') === 'true') {
        fetchData({});
        localStorage.removeItem('searched');
      }
    };

    window.addEventListener('searchedChange', handleCustomEvent);

    return () => {
      window.removeEventListener('searchedChange', handleCustomEvent);
    };
  }, [fetchData]);

  return (
    <>
      {dataState ? (
        isMobile() ? (
          <>
            <span className={styles.title}>
              <button className={styles.h1Btn} onClick={openSearchPanel}>
                <h1>{data?.Departure[0].stop.split('(')[0]}</h1>
              </button>
              <SearchBtn styles={`${styles.btn} ${styles.secondaryBtn}`} />
            </span>
            <div className={styles.tripContainer}>
              {data?.Departure.slice(0, 13).map((departure, index) => (
                <Afgangselement key={index} data={departure} />
              ))}
            </div>
          </>
        ) : (
          <div className={styles.content}>
            <div>
              <span className={styles.title}>
                <h1>{data?.Departure[0].stop.split('(')[0]}</h1>
                <SearchBtn styles={`${styles.btn} ${styles.secondaryBtn}`} />
              </span>
              <div className={styles.tripContainer}>
                {data?.Departure.slice(0, 13).map((departure, index) => (
                  <Afgangselement key={index} data={departure} />
                ))}
              </div>
            </div>
            <Mapbox />
          </div>
        )
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Afgangstavle;
