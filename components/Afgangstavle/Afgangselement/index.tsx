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
  if (!data) return null;

  let color = '#50ae30';

  if (data?.type === 'TOG') {
    color = '#0065aa';
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

export default Afgangselement;
