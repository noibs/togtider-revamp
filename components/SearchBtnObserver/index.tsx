import React, { useEffect } from 'react';

const SearchBtnObserver = () => {
  useEffect(() => {
    const observeSearchBtn = () => {
      const searchBtn = document.querySelector('#searchBtn');

      if (!searchBtn) {
        console.error('Search button not found.');
        return;
      }

      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'data-searched' &&
            searchBtn.hasAttribute('data-searched')
          ) {
            console.log('The "data-searched" attribute was added.');
            // Add your logic here to handle the attribute being added
          }
        }
      });

      observer.observe(searchBtn, {
        attributes: true, // Observe attribute changes
        attributeFilter: ['data-searched'], // Only observe the "data-searched" attribute
      });

      // Cleanup observer on component unmount
      return () => {
        observer.disconnect();
        console.log('SearchBtnObserver disconnected.');
      };
    };

    const retryInterval = 100; // Interval in milliseconds
    const maxRetries = 50; // Maximum number of retries
    let retries = 0;

    const checkSearchBtn = () => {
      const searchBtn = document.querySelector('#searchBtn');
      if (searchBtn) {
        observeSearchBtn();
      } else if (retries < maxRetries) {
        retries++;
        setTimeout(checkSearchBtn, retryInterval);
      } else {
        console.error('Search button not found after maximum retries.');
      }
    };

    checkSearchBtn();

    // Cleanup timeout on component unmount
    return () => {
      retries = maxRetries; // Stop further retries
    };
  }, []);

  return null;
};

export default SearchBtnObserver;
