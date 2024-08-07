'use client';
import React from 'react';
import styles from './page.module.scss';
import { cubicBezier, motion, useAnimationControls } from 'framer-motion';

let isFetching = false;

const SwapBtn = ({ click }: { click: () => void }) => {
  const controls = useAnimationControls();

  const handleClick = () => {
    if (isFetching) return;
    click();
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
        className={styles.swapBtn}
        onClick={handleClick}
        aria-label="swap"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
        >
          <g className="nc-icon-wrapper">
            <path d="M32 34.02V20h-4v14.02h-6L30 42l8-7.98h-6zM18 6l-8 7.98h6V28h4V13.98h6L18 6z"></path>
          </g>
        </svg>
      </button>
    </>
  );
};

export default SwapBtn;
