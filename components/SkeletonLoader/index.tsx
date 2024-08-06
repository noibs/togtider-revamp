import React from 'react';

const SkeletonLoader = ({
  height,
  width,
}: {
  height: string;
  width: string;
}) => {
  return <div style={{ height: height, width: width }}></div>;
};

export default SkeletonLoader;
