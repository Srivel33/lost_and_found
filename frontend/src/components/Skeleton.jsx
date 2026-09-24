import React from 'react';

export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`shimmer rounded-xl ${className}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
};
