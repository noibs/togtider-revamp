// This component contains the search button, which when pressed diplsays the search panel (@/components/SearchPanel/index.tsx).
'use client';
import React from 'react';
import { cubicBezier, motion, useAnimationControls } from 'framer-motion';

// This varaible is used to prevent the user from clicking the button multiple times
let isFetching = false;

export const openSearchPanel = () => {
  const searchContainer = document.querySelector(
    '#searchContainer'
  ) as HTMLElement;
  if (searchContainer) {
    // Adds the data-enabled attribute to the container to display the search panel
    searchContainer.setAttribute('data-enabled', '');
    // Sets a small timeout to animate the search panel
    setTimeout(() => {
      searchContainer.style.opacity = '1';
    }, 10);
  }
};

const SearchBtn = ({
  styles,
  click,
}: {
  styles: string;
  click?: () => void;
}) => {
  const controls = useAnimationControls();

  // This function is called when the user clicks the button, which calls the openSearchPanel function
  const handleClick = () => {
    if (isFetching) return;
    openSearchPanel();
    isFetching = true;

    // Wiggle animation
    const easing = cubicBezier(0.22, 1, 0.36, 1);

    controls.start({
      rotate: [0, 20, 0, 20, 0],
      transition: {
        duration: 1,
        ease: easing,
      },
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
        id="searchBtn"
        onClick={handleClick}
        aria-label="search"
      >
        <motion.i
          animate={controls}
          className="fa-solid fa-magnifying-glass"
        ></motion.i>
      </button>
    </>
  );
};

export default SearchBtn;
