import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Eye, MapPin, Tag, X, ChevronDown, CheckCheck, Filter,
  Search, ToggleLeft, ToggleRight
} from 'lucide-react';
import errorImage from '../../assets/cnews.png';
import Loader from '../common/Loader';
import AdsDetails from './AdsDetails';

const rejectionReasons = [
  'inappropriate_content',
  'misleading_information',
  'copyright_violation',
  'prohibited_content',
  'poor_quality',
  'incomplete_information',
  'other',
];

const AdsDashboard = () => {
  const [ads, setAds] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ location: '', category: '', limit: 10 });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const token = localStorage.getItem('token');
  const url = import.meta.env.VITE_BASE_URL;
  const img_url = import.meta.env.VITE_IMG_URL;

  const buttonBase = "px-3 py-1.5 min-w-[100px] text-sm rounded-md transition-colors flex items-center gap-1";

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get(`${url}advertisements`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data?.data?.advertisements || [];
        setAds(data);
        setFiltered(data);
      } catch (err) {
        setError('Failed to fetch ads');
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [filters]);

  useEffect(() => {
    const results = ads.filter(ad =>
      ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(results);
  }, [searchTerm, ads]);

  const handleApprove = async (id) => {
    try {
      await axios.post(`${url}advertisements/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAds(prev => prev.map(ad => ad.id === id ? { ...ad, status: 'approved' } : ad));
    } catch (err) {
      console.error('Approve error', err);
    }
  };

  const handleReject = async () => {
    try {
      await axios.post(`${url}advertisements/${selectedAd.id}/reject`, {
        reason: rejectReason,
        details: "The advertisement contains inappropriate content."
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setAds(prev => prev.map(ad => ad.id === selectedAd.id ? { ...ad, status: 'rejected' } : ad));
      setRejectModal(false);
    } catch (err) {
      console.error('Reject error', err);
    }
  };

  const toggleAdStatus = async (id, isActive) => {
    const endpoint = `${url}advertisements/${id}/${isActive ? 'disable' : 'enable'}`;
    try {
      await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAds(prev =>
        prev.map(ad =>
          ad.id === id ? { ...ad, isActive: !isActive } : ad
        )
      );
    } catch (err) {
      console.error('Status toggle error', err);
    }
  };

  return (
    <div className="bg-white min-h-screen px-6 py-10 text-gray-800">


      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-red-700">Ads Management</h1>
        <p className="text-red-600">Track and review posted advertisements</p>
      </div>

      
    <>
    <AdsDetails/>
    </>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ads..."
            className="w-full pl-10 py-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500"
          />
        </div>
        
      </div>


      {loading ? (
        <>
                <div className="flex items-center justify-center h-screen bg-gray-100">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
                    <div className="w-full h-full border-4 border-t-transparent border-red-600 rounded-full animate-spin"></div>
                  </div>
                </div>
              </>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="flex flex-col gap-6">
          {filtered.map(ad => (
            <div key={ad.id} className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md flex overflow-hidden">
              <img
                src={ad.primaryImage?.url ? `${img_url}${ad.primaryImage.url}` : errorImage}
                alt="ad"
                className="w-48 h-48 object-cover"
              />
              <div className="flex-1 p-4">
                <h2 className="text-xl font-bold text-red-700 line-clamp-1">{ad.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">{ad.description}</p>
                <p className="text-sm text-gray-500 mt-2"><Tag className="inline w-4 h-4 mr-1" />{ad.category}</p>
                <p className="text-sm text-gray-500"><MapPin className="inline w-4 h-4 mr-1" />{ad.contactInfo?.address?.city}</p>
              </div>
              <div className="p-4 flex flex-col items-center justify-between gap-2">
                

                {ad.status !== 'approved' && (
                  <>
                    <button
                      onClick={() => handleApprove(ad.id)}
                      className={`${buttonBase} bg-green-500 text-white hover:bg-green-600`}
                    >
                      <CheckCheck className="w-4 h-4" /> Approve
                    </button>

                    <button
                      onClick={() => { setSelectedAd(ad); setRejectModal(true); }}
                      className={`${buttonBase} bg-yellow-500 text-white hover:bg-yellow-600`}
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </>
                )}

                <button
                  onClick={() => toggleAdStatus(ad.id, ad.isActive)}
                  className={`${buttonBase} ${ad.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                >
                  {ad.isActive ? (
                    <>
                      <ToggleLeft className="w-4 h-4" /> Disable
                    </>
                  ) : (
                    <>
                      <ToggleRight className="w-4 h-4" /> Enable
                    </>
                  )}
                </button>
                
              </div>
            </div>
          ))}
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2 text-red-700">Select Rejection Reason</h3>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border px-3 py-2 rounded-md border-gray-300 mb-4"
            >
              <option value="">Select reason...</option>
              {rejectionReasons.map(reason => (
                <option key={reason} value={reason}>{reason.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setRejectModal(false)} className="px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
              <button onClick={handleReject} className="px-4 py-2 bg-red-600 text-white rounded-md" disabled={!rejectReason}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsDashboard;
