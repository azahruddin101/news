import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../common/Loader';
import AddAdvertisementForm from './AddAdvertisementForm';
import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BASE_URL;

const EditAdPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAd = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BASE_API_URL}advertisements/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json'
          }
        });
        if (res.data.success && res.data.data) {
          setAd(res.data.data.advertisement || res.data.data); // adjust based on your API
        } else {
          setError("Advertisement not found.");
        }
      } catch (err) {
        setError("Failed to load advertisement.");
      }
      setLoading(false);
    };
    fetchAd();
  }, [id, token]);

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!ad) return null;

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <AddAdvertisementForm
        advertisement={ad}
        isEdit={true}
        onSuccess={() => navigate('/my-ads')}
        onClose={() => navigate('/my-ads')}
      />
    </div>
  );
};

export default EditAdPage;
