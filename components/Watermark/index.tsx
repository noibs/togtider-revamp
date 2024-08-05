import React from "react";
import styles from "./page.module.scss";

const Watermark = () => {
  return (
    <div className={styles.logoContainer}>
      <a target="_blank" href="https://ellioott.me" className={styles.logo}>
        <h1>
          Elliott<span className={styles.dot}>.</span>
        </h1>
      </a>
    </div>
  );
};

export default Watermark;
