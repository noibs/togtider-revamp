// This component contains the buttons that are displayed on the top right of the page. It contains the theme button and the settings button.
import React from 'react';
import styles from './page.module.scss';
import ThemeBtn from '../Buttons/ThemeBtn';
import SettingsBtn from '../Buttons/SettingsBtn';

const HeadBtnContainer = () => {
  return (
    <>
      <div className={styles.btnContainer}>
        <ThemeBtn styles={styles.btn} />
        <SettingsBtn styles={styles.btn} />
      </div>
    </>
  );
};

export default HeadBtnContainer;
