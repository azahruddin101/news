import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserFactChecks = () => {
  const [factChecks, setFactChecks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const limit = 10;
  const baseUrl = `http://157.245.109.206:5001/api/fact-check/my-checks?page=${page}&limit=${limit}`;
  const yourToken = localStorage.getItem('token');

  useEffect(() => {
    const fetchFactChecks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(baseUrl, {
          headers: {
            Authorization: `Bearer ${yourToken}`
          },
        });

        setFactChecks(response.data.data.factChecks);
        setPagination(response.data.data.pagination);
        setError('');
      } catch (err) {
        setError('Failed to fetch your fact-checks.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFactChecks();
  }, [page]);

  const handleNext = () => {
    if (pagination.hasNext) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (pagination.hasPrev && page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Top bar */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#c10106]">
          My Fact Checks
        </h2>
        <button
          onClick={() => navigate('/user-dashboard/fact-check')}
          className="bg-[#c10106] hover:bg-[#a80105] text-white px-5 py-2 rounded-md text-sm font-medium transition"
        >
          New Fact Check
        </button>
      </div>

      {/* Content */}
      <div className="w-full max-w-5xl">
        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : factChecks.length === 0 ? (
          <div className="text-center text-gray-500">No fact checks found.</div>
        ) : (
          <div className="space-y-6">
            {factChecks.map((check) => (
              <div
                key={check.id}
                className="bg-white p-5 rounded-lg shadow-md w-full"
              >
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  {check.text}
                </p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Status:</strong> {check.status}</p>
                  <p>
                    <strong>Result:</strong>{' '}
                    <span
                      className={
                        check.verificationResult === 'TRUE'
                          ? 'text-green-600 font-semibold'
                          : check.verificationResult === 'FALSE'
                          ? 'text-red-600 font-semibold'
                          : 'text-yellow-600 font-semibold'
                      }
                    >
                      {check.verificationSummary}
                    </span>
                  </p>
             
                  <p><strong>Reliability:</strong> {check.reliability}</p>
                  

             
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                disabled={!pagination.hasPrev}
                className={`px-4 py-2 rounded bg-gray-300 text-sm font-medium ${
                  !pagination.hasPrev
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-400'
                }`}
              >
                Previous
              </button>

              <span className="text-sm font-semibold text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={handleNext}
                disabled={!pagination.hasNext}
                className={`px-4 py-2 rounded bg-gray-300 text-sm font-medium ${
                  !pagination.hasNext
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-400'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFactChecks;
