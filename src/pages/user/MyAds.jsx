import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../common/Loader';
import { Loader2 } from 'lucide-react';

const BASE_API_URL = import.meta.env.VITE_BASE_URL;
const BASE_IMAGE_URL = import.meta.env.VITE_IMG_URL;

const MyAds = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchAdvertisements = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${BASE_API_URL}advertisements?page=1&limit=10`;
      const headers = {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });

      if (response.data.success && response.data.data?.advertisements) {
        const draftAds = response.data.data.advertisements;
        setAdvertisements(draftAds);
      } else {
        setError("Data structure invalid or advertisements not found.");
      }
    } catch (err) {
      setError(`Failed to fetch advertisements: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAd = async (adId) => {
    try {
      const url = `${BASE_API_URL}advertisements/${adId}/submit`;
      const headers = {
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post(url, {}, { headers });

      if (response.data.success) {
        toast.success(`Advertisement ${adId} submitted successfully!`);
        fetchAdvertisements();
      } else {
        toast.error(`Failed to submit ad ${adId}.`);
      }
    } catch (err) {
      toast.error(`Error submitting ad ${adId}: ${err.message}`);
    }
  };

  useEffect(() => {
    if (token) fetchAdvertisements();
  }, [token]);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 font-inter">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl sm:text-4xl font-bold text-center text-red-800 mb-8">
        Draft Advertisements
      </h1>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <Loader2 />
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 mb-6">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && advertisements.length === 0 && (
        <p className="text-center text-red-600">No draft advertisements to display.</p>
      )}

      <div className="max-w-4xl mx-auto divide-y divide-red-600 border border-gray-200 rounded-xl shadow">
        {advertisements.map((ad) => (
          <div
            key={ad.id}
            className="flex items-center justify-between  p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center space-x-4 w-full">
              <img
                src={
                  ad.primaryImage?.url
                    ? `${BASE_IMAGE_URL}${ad.primaryImage.url}`
                    : 'https://placehold.co/80x80/e0e0e0/555555?text=No+Image'
                }
                alt={ad.primaryImage?.alt || ad.title}
                className="w-16 h-16 object-cover rounded-md border"
              />
              <div className="flex-1">
                <Link
                  to={`/user-dashboard/ad-performance/${ad.id}`}
                  className="text-lg font-semibold text-indigo-600 hover:underline"
                >
                  {ad.title}
                </Link>
                <p className="text-sm text-gray-500 line-clamp-1">{ad.description}</p>
                <div className="text-sm text-gray-400 mt-1">
                  {ad.businessInfo?.businessName && (
                    <span className="mr-4">
                      <strong>Business:</strong> {ad.businessInfo.businessName}
                    </span>
                  )}
                  {ad.contactInfo?.city && (
                    <span>
                      <strong>Location:</strong> {ad.contactInfo.city}, {ad.contactInfo.state}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {
              ad.status === 'draft' ? (
                <button
                  onClick={() => handleSubmitAd(ad.id)}
                  className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
                >
                  Submit
                </button>
              ) : (
                <>
                  {
                    <>
                      <span className="text-sm text-white bg-red-600 p-2 rounded">{(ad.status).charAt(0).toUpperCase() + ad.status.slice(1)}</span>
                    </>
                  }

                </>
              )
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAds;
