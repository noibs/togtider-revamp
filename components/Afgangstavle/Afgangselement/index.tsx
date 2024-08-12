import React from 'react';
import styles from '../page.module.scss';

interface DataProps {
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

const Afgangselement = ({ data }: { data?: DataProps }) => {
  /*const {
    name,
    type,
    stop,
    time,
    id,
    line,
    messages,
    track,
    rtTrack,
    finalStop,
  } = data;*/

  return (
    <div className={styles.elementContainer}>
      <p className={styles.time}>20:09</p>
      <div className={styles.mid}>
        <p className={styles.trainName}>Re 1575</p>
        <i className="fa-solid fa-arrow-right"></i>
        <p className={styles.destination}>Hillerød</p>
        <p className={styles.track}>Spor 2</p>
      </div>
    </div>
  );
};

export default Afgangselement;
