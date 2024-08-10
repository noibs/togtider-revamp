// This component contains the theme button, which when pressed changes between light and dark mode. (Not yet implemented)
'use client';
import React from 'react';
import { cubicBezier, motion, useAnimationControls } from 'framer-motion';

// This varaible is used to prevent the user from clicking the button multiple times
let isFetching = false;

const ThemeBtn = ({
  styles,
  click,
}: {
  styles: string;
  click?: () => void;
}) => {
  const controls = useAnimationControls();

  // This function is called when the user clicks the button, the click function is provided by the parent component
  const handleClick = () => {
    if (isFetching) return;
    if (click) click();
    isFetching = true;

    // Animation
    const easing = cubicBezier(0.25, 1, 0.5, 1);

    controls.start({
      rotate: 900,
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
        aria-label="Change Theme"
      >
        <i className="fa-solid fa-moon"></i>
      </button>
    </>
  );
};

export default ThemeBtn;
