// components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-solid border-primary-500 border-t-transparent rounded-full"></div>
    </div>
  );
};

export default LoadingSpinner;
