import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdSection = ({ ads, adsLoading, img_url }) => {
  const url = import.meta.env.VITE_BASE_URL;

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!ads || ads.length === 0) return;

    const timer = setTimeout(() => {
      ads.forEach(ad => {
        axios.post(
          `${url}advertisements/${ad.id}/impression`,
          {},
          {
            headers: {
              accept: '*/*',
              'Content-Type': 'application/json',
            },
          }
        )
        .then(res => console.log(''))
        .catch(err => console.error(''));
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [ads, url]);

  // Handle click event
  const handleAdClick = (adId) => {
    axios.post(
      `${url}advertisements/${adId}/click`,
      {},
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      }
    )
    .then(res => console.log(`Click recorded for ad ${adId}:`, res.data))
    .catch(err => console.error(`Click error for ad ${adId}:`, err));
  };

  if (adsLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 h-40 animate-pulse"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          />
        ))}
      </div>
    );
  }

  if (!ads || ads.length === 0) {
    return (
      // <div className="text-gray-500 text-sm">No advertisements available at the moment.</div>
      <div className="w-[300px] rounded-md border border-gray-200 shadow p-4 text-center space-y-4 bg-white">
      <h2 className="text-gray-500 text-sm">Advertisement</h2>
      <div className="border-4 border-gray-200 p-6">
        <div className="text-pink-600 font-bold text-5xl">Ad</div>
        <div className="text-black font-medium text-lg mt-2">300x250</div>
        {token ? (
          <Link to={'/user-dashboard/post-ads'}>
          <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow"
          >
          Contact Us
         </motion.button>
        </Link>
        ):(
          <Link to={'/login'}>
          <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow"
          >
          Contact Us
         </motion.button>
        </Link>
        )}
        
      </div>
    </div>
    );
  }

  return (
    <div className="space-y-6">
      {ads.map((ad, index) => (
        <motion.a
          key={ad.id}
          href={ad.contactInfo.website}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleAdClick(ad.id)}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 block no-underline text-inherit"
        >
          <div className="text-xs text-gray-500 mb-2">Advertisement</div>
          {ad.media && ad.media.length > 0 && ad.media[0].type === 'image' ? (
            <img
              src={`${img_url}${ad.media[0].url}`}
              alt={ad.media[0].alt || ad.title}
              className="w-full h-32 object-cover rounded-md mb-2"
            />
          ) : (
            <div className="bg-gray-200 h-32 rounded-md mb-2 flex items-center justify-center text-gray-400 text-sm">
              No Image Available
            </div>
          )}
          <h4 className="text-sm font-semibold mb-1">{ad.title}</h4>
          <p className="text-xs text-gray-600 line-clamp-3">{ad.description}</p>
        </motion.a>
      ))}
    </div>
  );
};

export default AdSection;
