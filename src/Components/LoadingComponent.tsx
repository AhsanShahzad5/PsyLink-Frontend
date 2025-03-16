import React from "react";

interface LoadingSpinnerProps {
  text?: string; // Custom loading text
}

const LoadingComponent: React.FC<LoadingSpinnerProps> = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-2 text-teal-600 font-medium">{text}</p>
    </div>
  );
};

export default LoadingComponent;
