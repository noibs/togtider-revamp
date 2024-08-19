// This component contains the setting button, which when pressed diplsays the settings panel (@/components/SettingsPanel/index.tsx).
'use client';
import React from 'react';
import { cubicBezier, motion, useAnimationControls } from 'framer-motion';

// This varaible is used to prevent the user from clicking the button multiple times
let isFetching = false;

const SettingsBtn = ({
  styles,
  click,
}: {
  styles: string;
  click?: () => void;
}) => {
  // This function is called when the user clicks the button, is uses querySelector to get the settings container and display it
  const openSettings = () => {
    const container = document.querySelector(
      '#settingsContainer'
    ) as HTMLElement;
    if (container) {
      container.setAttribute('data-enabled', '');
      // Sets a small timeout to animate the settings panel
      setTimeout(() => {
        container.style.opacity = '1';
      }, 10);
    }
  };

  const controls = useAnimationControls();

  // This handles the click, which calls openSettings()
  const handleClick = () => {
    if (isFetching) return;
    openSettings();
    isFetching = true;

    // Rotating animation
    const easing = cubicBezier(0.25, 1, 0.5, 1);

    controls.start({
      rotate: 360,
      transition: { duration: 1, ease: easing },
    });

    setTimeout(() => {
      isFetching = false;
      controls.set({ rotate: 0 });
    }, 2000);
  };

  return (
    <>
      <button
        className={styles}
        onClick={handleClick}
        aria-label="Open Settings"
      >
        <motion.i animate={controls} className="fa-solid fa-gear"></motion.i>
      </button>
    </>
  );
};

export default SettingsBtn;
