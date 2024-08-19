// This component contains the swap button, which when pressed swaps origin and destination stations.
'use client';
import React from 'react';
import { cubicBezier, motion, useAnimationControls } from 'framer-motion';

// This varaible is used to prevent the user from clicking the button multiple times
let isFetching = false;

const SwapBtn = ({ styles, click }: { styles: string; click: () => void }) => {
  const controls = useAnimationControls();

  // This function is called when the user clicks the button, the click function is provided by the parent component
  const handleClick = () => {
    if (isFetching) return;
    click();
    isFetching = true;

    // 180 rotating animation
    const easing = cubicBezier(0.25, 1, 0.5, 1);

    controls.start({
      rotate: 180,
      transition: { duration: 0.5, ease: easing },
    });

    setTimeout(() => {
      isFetching = false;
      controls.set({ rotate: 0 });
    }, 2000);
  };

  return (
    <>
      <button className={styles} onClick={handleClick} aria-label="swap">
        <motion.i
          animate={controls}
          className="fa-solid fa-arrow-up-arrow-down"
        ></motion.i>
      </button>
    </>
  );
};

export default SwapBtn;
