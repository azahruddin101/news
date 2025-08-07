import React from 'react';
import { RefreshCw } from 'lucide-react';

const Failed = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-red-500 text-5xl mb-3">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{message}</h2>
      <p className="text-sm text-gray-500 mb-4">
        Please check your internet connection or try again later.
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
};

export default Failed;
