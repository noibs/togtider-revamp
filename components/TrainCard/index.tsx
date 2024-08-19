// This component contains the train cards that display information about upcoming trips.
import React from 'react';
import styles from './page.module.scss';

// The custom interface for the trip object
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
  length: number;
}

const TrainCard = ({
  trip,
  multiStop,
}: {
  trip: Trip;
  multiStop?: boolean;
}) => {
  // Destructuring the trip object
  let startLoc = trip.Origin.name;
  let startTime = trip.Origin.time;
  let delayedStart = trip.Origin.rtTime;
  let startTrack = trip.Origin.rtTrack || trip.Origin.track;

  let endLoc = trip.Destination.name;
  let endTime = trip.Destination.time;
  let delayedEnd = trip.Destination.rtTime;
  let endTrack = trip.Destination.rtTrack || trip.Destination.track;

  let legs = trip.length;

  return (
    <div className={styles.container} id="trip">
      <div className={styles.infoContainer} id="location">
        <span className={styles.span}>
          <h2 className={styles.stationName}>{startLoc}</h2>
          <h2 className={styles.time}>{delayedStart || startTime}</h2>
        </span>

        <span className={styles.span}>
          <p className={styles.track}>Spor: {startTrack}</p>
          {delayedStart ? (
            <h2 className={styles.delayed}>{startTime}</h2>
          ) : (
            <h2 id="placeholder" className={styles.delayed}>
              10:00
            </h2>
          )}
        </span>
      </div>

      <div className={styles.center}>
        <i className="fa-solid fa-chevrons-down"></i>
        {multiStop && (
          <div>
            <i className="fa-regular fa-circle-info"></i>
            <p>Denne rute indeholder flere stop.</p>
          </div>
        )}
      </div>

      <div className={styles.infoContainer} id="destination">
        <span className={styles.span}>
          <h2 className={styles.stationName}>{endLoc}</h2>
          <h2 className={styles.time}>{delayedEnd || endTime}</h2>
        </span>
        <span className={styles.span}>
          <p className={styles.track}>Spor: {endTrack}</p>
          {delayedEnd ? (
            <h2 className={styles.delayed}>{endTime}</h2>
          ) : (
            <h2 id="placeholder" className={styles.delayed}>
              10:00
            </h2>
          )}
        </span>
      </div>
    </div>
  );
};

export default TrainCard;
