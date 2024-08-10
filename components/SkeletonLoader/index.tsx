// This component contains the skeleton loader, which is displayed while the page is loading to prevent layout shift.
import React from 'react';

const SkeletonLoader = ({
  height,
  width,
}: {
  height: string;
  width: string;
}) => {
  // Height and width is provided by the parent component
  return <div style={{ height: height, width: width }}></div>;
};

export default SkeletonLoader;
