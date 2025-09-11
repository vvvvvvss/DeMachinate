import React from 'react';

interface ProgressBarProps {
  progress: number;
  status: string;
  isComplete?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status, isComplete }) => {
  return (
    <div className="w-full bg-gray-200 rounded-lg shadow-inner">
      <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-2 leading-none rounded-lg transition-all duration-300 ease-out"
           style={{ width: `${Math.max(5, progress)}%` }}>
        {progress.toFixed(0)}%
      </div>
      <div className="mt-2 text-sm text-gray-600 text-center">
        {status}
        {isComplete && " ✓"}
      </div>
    </div>
  );
};