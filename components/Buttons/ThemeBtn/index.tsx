'use client';
import React from 'react';
import { cubicBezier, motion, useAnimationControls } from 'framer-motion';

let isFetching = false;

const ThemeBtn = ({
  styles,
  click,
}: {
  styles: string;
  click?: () => void;
}) => {
  const controls = useAnimationControls();

  const handleClick = () => {
    if (isFetching) return;
    if (click) click();
    isFetching = true;

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
