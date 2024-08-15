'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Map, { ViewStateChangeEvent } from 'react-map-gl';
import styles from './page.module.scss';

export const fetchData = async (
  setViewState: React.Dispatch<React.SetStateAction<any>>
) => {
  const currentId = localStorage.getItem('originId') || '6555';

  fetch('./data/stations.json')
    .then((response) => response.json())
    .then((data) => {
      const station = data.find(
        (station: any) => station.data.stationId === currentId
      );
      setViewState({
        longitude: station.data.coords.lon,
        latitude: station.data.coords.lat,
        zoom: station.data.coords.zoom || 17,
        pitch: station.data.coords.pitch || 60,
        bearing: station.data.coords.bearing || -45,
      });
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
};

const Mapbox = ({ testing }: { testing?: boolean }) => {
  const [viewState, setViewState] = useState({
    longitude: 11.9778,
    latitude: 55.4959,
    zoom: 17,
    pitch: 60,
    bearing: -45,
  });

  const handleMove = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  };

  useEffect(() => {
    fetchData(setViewState);
  }, []);

  const handleCustomEvent = useCallback(() => {
    if (localStorage.getItem('searched') === 'true') {
      fetchData(setViewState);
    }
  }, [fetchData]);

  useEffect(() => {
    window.addEventListener('searchedChange', handleCustomEvent);

    return () => {
      window.removeEventListener('searchedChange', handleCustomEvent);
    };
  }, [handleCustomEvent]);

  return (
    <div className={styles.container}>
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        {...viewState}
        onMove={handleMove}
        style={{ width: 800, height: 600 }}
        mapStyle="mapbox://styles/elli0364/clzu15opn00hm01qodfimfpnj"
      />
      {testing && (
        <div>
          <p>Longitude: {viewState.longitude.toFixed(4)}</p>
          <p>Latitude: {viewState.latitude.toFixed(4)}</p>
          <p>Zoom: {viewState.zoom.toFixed(2)}</p>
          <p>Pitch: {viewState.pitch.toFixed(2)}</p>
          <p>Bearing: {viewState.bearing.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default Mapbox;
