import React, { useState } from 'react';
import axios from 'axios';
import FactCheckForm from './FactCheckForm';
import FactCheckResultModal from './FactCheckResultModal';

const FactCheck = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const authToken = localStorage.getItem('token');

  const handleFactCheck = async ({ text, language }) => {
    setLoading(true);
    setShowModal(true);
    setResult(null);

    try {
      const response = await axios.post(`${baseUrl}fact-check/verify`, { text, language }, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      setResult(response.data);
    } catch (error) {
      setResult({
        error:
          error.response?.data?.message || 'Failed to fetch fact check result.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <FactCheckForm onSubmit={handleFactCheck} />
      {showModal && (
        <FactCheckResultModal
          result={result}
          loading={loading}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default FactCheck;
