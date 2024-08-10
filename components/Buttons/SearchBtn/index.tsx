// This component contains the search button, which when pressed diplsays the search panel (@/components/SearchPanel/index.tsx).
'use client';
import React from 'react';
import { cubicBezier, motion, useAnimationControls } from 'framer-motion';

// This varaible is used to prevent the user from clicking the button multiple times
let isFetching = false;

const SearchBtn = ({
  styles,
  click,
}: {
  styles: string;
  click?: () => void;
}) => {
  const controls = useAnimationControls();

  const openSearchPanel = () => {
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
        {/* <motion.svg
          animate={controls}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          {/* Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.}
          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
        </motion.svg> */}
        <motion.i
          animate={controls}
          className="fa-solid fa-magnifying-glass"
        ></motion.i>
      </button>
    </>
  );
};

export default SearchBtn;
