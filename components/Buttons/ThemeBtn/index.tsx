'use client';
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { cubicBezier, motion, useAnimationControls } from 'framer-motion';

// This variable is used to prevent the user from clicking the button multiple times
let isFetching = false;

const ThemeBtn = ({ styles }: { styles: string }) => {
  const { theme, setTheme } = useTheme();
  const controls = useAnimationControls();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // This function changes the theme of the page
  const changeTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      const event = new CustomEvent('themeChanged', { detail: 'dark' });
      window.dispatchEvent(event);
    } else {
      setTheme('light');
      const event = new CustomEvent('themeChanged', { detail: 'light' });
      window.dispatchEvent(event);
    }
  };

  // This function is called when the user clicks the button
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

    setTimeout(() => {
      isFetching = false;
      controls.set({ rotate: 0 });
    }, 2000);
  };

  return (
    <button className={styles} onClick={handleClick} aria-label="Change Theme">
      <motion.i
        className={`fa-solid ${
          theme === 'light' ? 'fa-moon' : 'fa-sun-bright'
        }`}
        animate={controls}
      ></motion.i>
    </button>
  );
};

export default ThemeBtn;
