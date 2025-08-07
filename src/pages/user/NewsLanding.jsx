import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Share2,
  User,
  Calendar,
  ArrowRight,
  TrendingUp,
  Zap,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import staticNewsImage from '../../assets/image.png';
import Loader from '../common/Loader';

// Constants
const SLIDE_INTERVAL = 5000;
const MAX_SLIDES = 5;
const NEWS_LIMIT = 10;
const TRENDING_LIMIT = 4;

// Custom hooks for better separation of concerns
const useNewsData = () => {
  const [newsData, setNewsData] = useState([]);
  const [trendingData, setTrendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const url = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('token');

  const apiClient = useMemo(() => {
    return axios.create({
      baseURL: url,
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
  }, [url, token]);

  const fetchNews = useCallback(async (category = '', page = 1, limit = NEWS_LIMIT) => {
    try {
      const params = { page, limit };
      if (category) params.category = category;

      const response = await apiClient.get('news', { params });
      
      if (response.data.success) {
        return response.data.data.news;
      }
      throw new Error('Failed to fetch news');
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }, [apiClient]);

  const fetchTrendingNews = useCallback(async () => {
    try {
      const response = await apiClient.get('news', { 
        params: { trending: true, limit: TRENDING_LIMIT } 
      });
      
      if (response.data.success) {
        return response.data.data.news;
      }
      throw new Error('Failed to fetch trending news');
    } catch (error) {
      console.error('Error fetching trending news:', error);
      throw error;
    }
  }, [apiClient]);

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [newsResponse, trendingResponse] = await Promise.allSettled([
        fetchNews(),
        fetchTrendingNews()
      ]);

      if (newsResponse.status === 'fulfilled') {
        setNewsData(newsResponse.value);
      } else {
        console.error('News fetch failed:', newsResponse.reason);
      }

      if (trendingResponse.status === 'fulfilled') {
        setTrendingData(trendingResponse.value);
      } else {
        console.error('Trending fetch failed:', trendingResponse.reason);
      }

      // Set error only if both requests failed
      if (newsResponse.status === 'rejected' && trendingResponse.status === 'rejected') {
        setError('Failed to load content. Please try again.');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [fetchNews, fetchTrendingNews]);

  return {
    newsData,
    trendingData,
    loading,
    error,
    loadAllData,
    refetchNews: fetchNews
  };
};

const useSlideshow = (slides) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(slides.length, MAX_SLIDES));
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % Math.min(slides.length, MAX_SLIDES));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    const total = Math.min(slides.length, MAX_SLIDES);
    setCurrentSlide((prev) => (prev - 1 + total) % total);
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  return {
    currentSlide,
    nextSlide,
    prevSlide,
    goToSlide
  };
};

// Utility functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

const extractText = (html, maxLength = 150) => {
  if (!html) return '';
  
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Component definitions


const ErrorDisplay = ({ error, onRetry }) => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="text-center p-8">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
      <p className="text-slate-600 mb-4">{error}</p>
      <button 
        onClick={onRetry}
        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

const HeroSlide = ({ news, isStatic, imgUrl }) => (
  <motion.div
    key={news._id}
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.5 }}
    className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-auto lg:h-[400px] overflow-hidden"
  >
    <div className="text-white space-y-6">
      <motion.div 
        className="flex items-center flex-wrap gap-3" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
      >
        <span className="bg-gradient-to-r from-red-600 to-red-600 px-3 py-1 rounded-full text-sm font-medium">
          {isStatic ? 'Featured' : 'Breaking News'}
        </span>
        <span className="flex gap-2 border border-red-600 px-3 py-1 rounded-full text-sm font-medium">
          AI Verified
        </span>
        <div className="flex items-center space-x-2 text-sm text-slate-300">
          <Clock className="w-4 h-4" />
          <span>{formatTimeAgo(news.createdAt)}</span>
        </div>
      </motion.div>
      
      <motion.h1 
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight line-clamp-2" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
      >
        {news.title}
      </motion.h1>
      
      <motion.p 
        className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed line-clamp-2" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.4 }}
      >
        {extractText(news.description, 200)}
      </motion.p>
      
      {!isStatic && (
        <motion.div 
          className="flex flex-wrap items-center gap-4" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5 }}
        >
          <Link 
            to={`/news/${news.slug}`} 
            className="bg-gradient-to-r from-red-600 to-red-600 text-white px-6 py-2 rounded-lg font-medium hover:from-red-700 hover:to-red-700 transition-all inline-flex items-center space-x-2 group"
          >
            <span>Read Full Story</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
        </motion.div>
      )}
    </div>
    
    <motion.div 
      className="relative" 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ delay: 0.3 }}
    >
      {news.media && news.media.length > 0 ? (
        <img
          src={isStatic ? news.media[0] : `${imgUrl}${news.media[0]}`}
          alt={news.title}
          className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover rounded-xl shadow-2xl"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-56 sm:h-64 md:h-72 lg:h-80 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-2xl flex items-center justify-center">
          <span className="text-slate-400 text-lg">No Image Available</span>
        </div>
      )}
    </motion.div>
  </motion.div>
);

const NewsCard = ({ news, imgUrl, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
  >
    <Link to={`/news/${news.slug}`}>
      <div className="relative overflow-hidden">
        {news.media && news.media.length > 0 ? (
          <img
            src={`${imgUrl}${news.media[0]}`}
            alt={news.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <span className="text-slate-500">No Image</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
            {news.category?.name || 'News'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>{news.reporter?.name || 'Reporter'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(news.publishingDate || news.createdAt)}</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
          {news.title}
        </h3>
        <p className="text-slate-600 mb-4 line-clamp-3">
          {extractText(news.description)}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{news.readTime || 5}m read</span>
            </div>
          </div>
          <span className="text-red-600 font-medium group-hover:underline">
            Read More →
          </span>
        </div>
      </div>
    </Link>
  </motion.article>
);

const TrendingItem = ({ news, index }) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="flex space-x-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow group"
  >
    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
      {index + 1}
    </div>
    <div className="flex-1">
      <Link to={`/news/${news.slug}`}>
        <h4 className="font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
          {news.title}
        </h4>
        <div className="flex items-center space-x-3 text-sm text-slate-500">
          <span>{formatTimeAgo(news.createdAt)}</span>
        </div>
      </Link>
    </div>
  </motion.div>
);

// Main Component
const LandingPage = () => {
  const [selectedLocation, setSelectedLocation] = useState('My District');
  const { newsData, trendingData, loading, error, loadAllData } = useNewsData();
  
  const imgUrl = import.meta.env.VITE_IMG_URL;

  // Static slide for hero section
  const staticSlide = useMemo(() => ({
    _id: 'static-slide',
    title: "India's First AI-Driven Hyperlocal News Engine.",
    description: '<p>Because every village has a story—and every story deserves to be heard.</p>',
    createdAt: new Date().toISOString(),
    // views: 'N/A',
    // shares: 'N/A',
    media: [staticNewsImage],
  }), []);

  // Prepare slides for hero section
  const slides = useMemo(() => [
    staticSlide, 
    ...newsData.slice(0, MAX_SLIDES - 1)
  ], [staticSlide, newsData]);

  const { currentSlide, nextSlide, prevSlide, goToSlide } = useSlideshow(slides);

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Error state
  if (error && !newsData.length && !trendingData.length) {
    return <ErrorDisplay error={error} onRetry={loadAllData} />;
  }

  // Loading state
  if (loading && !newsData.length && !trendingData.length) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <AnimatePresence mode="wait">
            {slides.map((news, index) => (
              index === currentSlide && (
                <HeroSlide
                  key={news._id}
                  news={news}
                  isStatic={news._id === 'static-slide'}
                  imgUrl={imgUrl}
                />
              )
            ))}
          </AnimatePresence>

          <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 sm:space-x-4">
            <button 
              onClick={prevSlide} 
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button 
                  key={index} 
                  onClick={() => goToSlide(index)} 
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white' : 'bg-white/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={nextSlide} 
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="flex items-center justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-gradient-to-b from-red-600 to-red-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-slate-900">Latest News</h2>
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              <span>Coverage: {selectedLocation}</span>
            </div>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsData.slice(MAX_SLIDES).map((news, index) => (
              <NewsCard
                key={news._id}
                news={news}
                imgUrl={imgUrl}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="flex items-center space-x-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <h2 className="text-3xl font-bold text-slate-900">Trending Now</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-orange-500 to-transparent"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {trendingData.map((news, index) => (
              <TrendingItem
                key={news._id}
                news={news}
                index={index}
              />
            ))}
          </div>
          
          {trendingData.length === 0 && !loading && (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">No trending news available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;