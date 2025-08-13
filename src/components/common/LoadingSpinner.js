import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = '', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div 
          className={`
            ${sizeClasses[size]} 
            border-2 border-gray-200 rounded-full animate-spin
          `}
        >
          <div 
            className={`
              ${sizeClasses[size]} 
              border-2 ${colorClasses[color]} rounded-full border-t-transparent animate-spin
            `}
          />
        </div>
      </div>
      {text && (
        <p className="mt-3 text-sm text-secondary-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

// Overlay spinner for full-screen loading
export const LoadingOverlay = ({ isVisible, text = 'Loading...' }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <LoadingSpinner size="large" text={text} />
      </div>
    </div>
  );
};

// Inline spinner for buttons
export const ButtonSpinner = ({ className = '' }) => {
  return (
    <div className={`inline-block ${className}`}>
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

// Page loading component
export const PageLoader = ({ text = 'Loading page...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center">
        <LoadingSpinner size="xlarge" color="primary" />
        <h2 className="mt-4 text-xl font-semibold text-secondary-900">
          {text}
        </h2>
        <p className="mt-2 text-secondary-600">
          Please wait while we load your content...
        </p>
      </div>
    </div>
  );
};

// Card loading skeleton
export const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className="h-48 bg-secondary-200 rounded-t-lg" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-secondary-200 rounded w-3/4" />
            <div className="h-4 bg-secondary-200 rounded w-1/2" />
            <div className="h-6 bg-secondary-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </>
  );
};

// Table loading skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="animate-pulse">
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-secondary-300">
          <thead className="bg-secondary-50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-3">
                  <div className="h-4 bg-secondary-200 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 bg-secondary-200 rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoadingSpinner;