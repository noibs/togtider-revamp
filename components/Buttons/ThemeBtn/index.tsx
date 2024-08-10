// This component contains the theme button, which when pressed changes between light and dark mode. (Not yet implemented)
'use client';
import React, { useState, useEffect } from 'react';
import { cubicBezier, motion, useAnimationControls } from 'framer-motion';

// This varaible is used to prevent the user from clicking the button multiple times
let isFetching = false;

const ThemeBtn = ({ styles }: { styles: string }) => {
  const [isLightTheme, setIsLightTheme] = useState(true);
  const controls = useAnimationControls();

  // This function changes the theme of the page
  const changeTheme = () => {
    if (isLightTheme) {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  // This function is called when the user clicks the button, the click function is provided by the parent component
  const handleClick = () => {
    if (isFetching) return;
    changeTheme();
    isFetching = true;

    // Animation
    const easing = cubicBezier(0.25, 1, 0.5, 1);
    controls.start({
      rotate: 720,
      transition: { duration: 1, ease: easing },
    });

    setTimeout(
      () => {
        setIsLightTheme(!isLightTheme);
      },
      isLightTheme ? 100 : 200
    );

    setTimeout(() => {
      isFetching = false;
      controls.set({ rotate: 0 });
    }, 2000);
  };

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      setIsLightTheme(theme === 'light');
      document.body.setAttribute('data-theme', theme);
    } else {
      localStorage.setItem('theme', 'light');
      document.body.setAttribute('data-theme', 'light');
    }
  }, []);

  return (
    <button className={styles} onClick={handleClick} aria-label="Change Theme">
      <motion.i
        className={`fa-solid ${isLightTheme ? 'fa-moon' : 'fa-sun'}`}
        animate={controls}
      ></motion.i>
    </button>
  );
};

export default ThemeBtn;
