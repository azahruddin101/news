import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Error429 from '../common/Error429';

const Category = ({ category, themeColor = '#FF6B6B' }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const url = import.meta.env.VITE_BASE_URL;
  const img_url = import.meta.env.VITE_IMG_URL;

  const isValidImageExtension = (filePath) => {
    if (!filePath) return false;
    const extension = filePath.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.bmp', '.ico', '.tiff', '.tif', '.avif', '.heic', '.heif'];
    return validExtensions.some(ext => extension.endsWith(ext));
  };

  const getImageUrl = useCallback(
    (mediaPath, articleId) => {
      if (imageErrors[articleId])
        return `https://via.placeholder.com/440x220/${themeColor.replace('#', '')}/fff?text=Image+Error`;
      if (!mediaPath || !mediaPath[0])
        return 'https://via.placeholder.com/440x220/f3f4f6/64748b?text=No+Image';
      if (!isValidImageExtension(mediaPath[0]))
        return `https://via.placeholder.com/440x220/f59e0b/fff?text=Invalid+Format`;
      const imagePath = mediaPath[0].startsWith('/') ? mediaPath[0] : `/${mediaPath[0]}`;
      return `${img_url}${imagePath}`;
    },
    [imageErrors, img_url, themeColor]
  );

  const handleImageError = useCallback((articleId) => {
    setImageErrors(prev => ({ ...prev, [articleId]: true }));
  }, []);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${url}news`, {
        params: { page: 1, limit: 5, category },
        timeout: 8000,
      });
      if (response.data.success) {
        setNews(response.data.data.news);
        setImageErrors({});
      } else {
        throw new Error(response.data.message || 'Failed to fetch news');
      }
    } catch (err) {
      if (err.response && err.response.status === 429) setError('429');
      else if (err.code === 'ECONNABORTED') setError('Request timeout. Please try again.');
      else if (err.response) setError(`Server Error: ${err.response.status}`);
      else setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [category, url]);

  useEffect(() => {
    if (category) fetchNews();
  }, [category, fetchNews]);

  const handleNewsClick = useCallback((slug) => {
    navigate(`/news/${slug}`);
  }, [navigate]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.42, ease: 'easeOut' },
    },
  };

  const getContrastColor = (hex) => {
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000' : '#fff';
  };

  const textColor = getContrastColor(themeColor);

  if (loading)
    return (
      <div className="bg-gray-50 min-h-[220px] rounded-xl p-6 flex items-center justify-center">
        <motion.div
          className="w-10 h-10 border-4 border-t-transparent rounded-full"
          style={{ borderColor: themeColor }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <span className="ml-4 text-gray-600 text-lg">
          Loading {category} news...
        </span>
      </div>
    );

  if (error === '429') return <Error429 />;

  // if (error)
  //   return (
  //     <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center">
  //       <p className="font-medium mb-2" style={{ color: themeColor }}>Error: {error}</p>
  //       <button
  //         onClick={fetchNews}
  //         className="text-white px-5 py-2 rounded-lg font-medium transition-colors duration-200"
  //         style={{ backgroundColor: themeColor }}
  //       >
  //         Retry
  //       </button>
  //     </div>
  //   );

  if (!news.length) return null;

  return (
    <div className="bg-gray-50 w-full rounded-2xl shadow-sm mb-10">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-x-3">
            <div className="flex items-center justify-center w-9 h-9 rounded" style={{ backgroundColor: themeColor + '33' }}>
              <svg className="w-5 h-5" fill={themeColor} viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm8 8V9H4v4h12z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 capitalize">{category}</h2>
          </div>
          <Link to={`/news-for/${category}`}>
            <button
              className="flex items-center space-x-2 px-4 py-2 font-semibold rounded-lg transition group"
              style={{
                backgroundColor: themeColor + '20',
                color: themeColor,
              }}
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </Link>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {news.map((article, idx) => (
              <motion.div
                key={`${article._id}-${idx}`}
                variants={cardVariants}
                className="group cursor-pointer rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-xl overflow-hidden transition-all duration-300"
                style={{ borderColor: hoveredCard === article._id ? themeColor : '#e5e7eb' }}
                onMouseEnter={() => setHoveredCard(article._id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleNewsClick(article.slug)}
                tabIndex={0}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={getImageUrl(article.media, article._id)}
                    alt={article.title}
                    className={`w-full object-cover transition-transform duration-300 ${hoveredCard === article._id ? 'scale-105' : 'scale-100'} h-36 sm:h-40 md:h-48`}
                    loading="lazy"
                    onError={() => handleImageError(article._id)}
                  />
                  {article.readTime && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-black/70 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
                        {article.readTime} min
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-3 group-hover:text-red-600 transition-colors duration-200 mb-3">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2 gap-x-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.publishingDate)}
                    </span>
                  </div>
                  {article.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="flex items-center text-xs text-gray-600 mt-1">
                    <User className="w-3 h-3 mr-1" />
                    By {article.reporter?.name || 'Unknown'}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      <style>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default React.memo(Category);
