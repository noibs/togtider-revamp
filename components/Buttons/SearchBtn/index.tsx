'use client';
import React from 'react';
import { cubicBezier, motion, useAnimationControls } from 'framer-motion';

let isFetching = false;

const SearchBtn = ({
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
        id="secondaryBtn"
        onClick={handleClick}
        aria-label="search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          {/* Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. */}
          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
        </svg>
      </button>
    </>
  );
};

export default SearchBtn;
