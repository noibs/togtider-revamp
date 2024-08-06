import React, { useEffect } from 'react';
import styles from './page.module.scss';

interface Trip {
  Origin: {
    name: string;
    time: string;
    rtTime?: string;
    rtTrack?: string;
    track: string;
  };
  Destination: {
    name: string;
    time: string;
    rtTime?: string;
    rtTrack?: string;
    track: string;
  };
}

const TrainCard = ({ trip }: { trip: Trip }) => {
  let startLoc = trip.Origin.name;
  let startTime = trip.Origin.time;
  let delayedStart = trip.Origin.rtTime;
  let startTrack = trip.Origin.rtTrack || trip.Origin.track;

  let endLoc = trip.Destination.name;
  let endTime = trip.Destination.time;
  let delayedEnd = trip.Destination.rtTime;
  let endTrack = trip.Destination.rtTrack || trip.Destination.track;

  return (
    <div className={styles.container} id="trip">
      <div className={styles.infoContainer} id="location">
        <span className={styles.span}>
          <h2 className={styles.stationName}>{startLoc}</h2>
          <h2 className={styles.time}>{delayedStart || startTime}</h2>
        </span>

        <span className={styles.span}>
          <p className={styles.track}>Spor: {startTrack}</p>
          {delayedStart && <h2 className={styles.delayed}>{startTime}</h2>}
        </span>
      </div>

      <div className={styles.arrow}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          {/*Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.*/}
          <path d="M246.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 402.7 361.4 265.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-160 160zm160-352l-160 160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 210.7 361.4 73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3z" />
        </svg>
      </div>

      <div className={styles.infoContainer} id="destination">
        <span className={styles.span}>
          <h2 className={styles.stationName}>{endLoc}</h2>
          <h2 className={styles.time}>{delayedEnd || endTime}</h2>
        </span>
        <span className={styles.span}>
          <p className={styles.track}>Spor: {endTrack}</p>
          {delayedEnd && <h2 className={styles.delayed}>{endTime}</h2>}
        </span>
      </div>
    </div>
  );
};

export default TrainCard;
