// Top-right buttons: theme + settings.
import React from 'react';
import styles from './page.module.scss';
import ThemeBtn from '../Buttons/ThemeBtn';
import SettingsBtn from '../Buttons/SettingsBtn';

const HeadBtnContainer = () => {
  return (
    <div className={styles.btnContainer}>
      <div className={styles.right}>
        <ThemeBtn styles={styles.btn} />
        <SettingsBtn styles={styles.btn} />
      </div>
    </div>
  );
};

export default HeadBtnContainer;
