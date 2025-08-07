import React from 'react';

const FactCheckResultModal = ({ result, loading, onClose }) => {
  return (
    <div className="fixed inset-0 z-50  bg-opacity-20 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] md:w-[600px] max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold text-[#c10106] mb-4">Fact Check Result</h2>

        {loading ? (
          <div className="flex flex-col items-center text-center text-gray-600 space-y-4">
            <svg
              className="animate-spin h-8 w-8 text-[#c10106]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            <p className="text-sm">AI is verifying your news...</p>
          </div>
        ) : result ? (
          result.error ? (
            <p className="text-black">{result.error}</p>
          ) : (
            <div className="space-y-4 text-gray-800 text-sm">
              <p>
                <strong>Status:</strong> {result.data.status}
              </p>
              <p>
                <strong>Verification Result:</strong>{' '}
                <span
                  className={`font-semibold ${
                    result.data.verificationResult === 'TRUE' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {result.data.verificationResult}
                </span>
              </p>
              <p>
                <strong>AI Analysis:</strong> {result.data.aiAnalysis}
              </p>
              <div>
                <strong>Sources:</strong>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  {result.data.sources.slice(0, 3).map((source, index) => (
                    <li key={index}>
                      <p className="font-medium">{source.name}</p>
                      <p className="text-gray-600 text-sm">{source.excerpt}</p>
                      <a
                        href={source.url}
                        className="text-blue-600 underline text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit Source
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default FactCheckResultModal;
