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
      <dialog className={styles.dialog}>super cool modal</dialog>
    </>
  );
};

export default HeadBtnContainer;
