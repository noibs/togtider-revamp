// This component contains the refresh button, which is used to refresh the data displayed on the page.
'use client';
import React from 'react';
import { cubicBezier, motion, useAnimationControls } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

// This varaible is used to prevent the user from clicking the button multiple times
let isFetching = false;

const RefreshBtn = ({
  styles,
  click,
}: {
  styles: string;
  click: () => void;
}) => {
  const controls = useAnimationControls();

  // This function is called when the user clicks the button, the click function is provided by the parent component
  const handleClick = () => {
    if (isFetching) return;
    click();
    isFetching = true;

    // Rotating animation
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
      <button className={styles} onClick={handleClick} aria-label="refresh">
        <motion.span
          animate={controls}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            willChange: 'transform',
          }}
        >
          <RefreshCw />
        </motion.span>
      </button>
    </>
  );
};

export default RefreshBtn;
