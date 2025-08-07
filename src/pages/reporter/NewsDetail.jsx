
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  Heart,
  Share2,
  MapPin,
  ChevronLeft,
  MessageCircle,
  Loader2,
  Clipboard,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdSection from '../common/AdSection';
import CommentsSection from '../common/CommentsSection';
import Navbar from '../user/Navbar';

// API Endpoints
const API_ENDPOINTS = {
  NEWS: (slug) => `news/${slug}`,
  NEWS_BY_ID: (id) => `news/${id}`,
  LIKE_STATUS: (id) => `news/${id}/like/status`,
  LIKES: (id) => `news/${id}/likes`,
  LIKE_TOGGLE: (id) => `news/${id}/like`,
  ADS: 'advertisements/public',
};

// Social Share URLs
const SHARE_PLATFORMS = {
  facebook: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  twitter: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  whatsapp: (url, title) => `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
  linkedin: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
};

// Custom Hook: Authentication
const useAuth = () => {
  const token = localStorage.getItem('token');
  const authHeader = useMemo(() => (token ? { Authorization: `Bearer ${token}` } : {}), [token]);
  return { token, authHeader, isAuthenticated: !!token };
};

// Custom Hook: Click Outside
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, callback]);
};

// Custom Hook: API
const useApi = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const imgURL = import.meta.env.VITE_IMG_URL;

  const apiCall = useCallback(
    async (endpoint, options = {}) => {
      try {
        const response = await axios({
          url: `${baseURL}${endpoint}`,
          method: 'GET',
          ...options,
        });
        return { data: response.data, error: null };
      } catch (error) {
        console.error(`API Error for ${endpoint}:`, error);
        return { data: null, error: error.response?.data || error.message };
      }
    },
    [baseURL]
  );

  return { apiCall, baseURL, imgURL };
};

// Loading Spinner Component
const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  return <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />;
};

// Share Dropdown Component
const ShareDropdown = ({ isOpen, onClose, onShare, newsTitle }) =>
  isOpen ? (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
      <div className="py-2">
        {[
          { key: 'facebook', icon: <FaFacebook />, label: 'Facebook', color: 'text-blue-600' },
          { key: 'twitter', icon: <FaTwitter />, label: 'Twitter', color: 'text-blue-400' },
          { key: 'linkedin', icon: <FaLinkedin />, label: 'LinkedIn', color: 'text-blue-700' },
          { key: 'whatsapp', icon: <FaWhatsapp />, label: 'WhatsApp', color: 'text-green-500' },
          { key: 'copy', icon: <Clipboard />, label: 'Copy Link', color: 'text-gray-500' },
        ].map(({ key, icon, label, color }) => (
          <button
            key={key}
            onClick={() => onShare(key)}
            className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
          >
            <span className={`w-5 h-5 mr-3 ${color}`}>{icon}</span>
            <span className="text-gray-700">{label}</span>
          </button>
        ))}
      </div>
    </div>
  ) : null;

// News Metadata Component
const NewsMetadata = ({ newsData }) => (
  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-6 pt-6 border-t border-gray-200">
    <span>Published: {new Date(newsData.publishingDate || newsData.createdAt).toLocaleDateString()}</span>
    <span>Updated: {new Date(newsData.updatedAt).toLocaleDateString()}</span>
    <span>Language: {newsData.language}</span>
    <span>Access: {newsData.accessType}</span>
  </div>
);

// Main NewsDetail Component
const NewsDetail = () => {
  const [state, setState] = useState({
    newsData: null,
    loading: true,
    liked: false,
    likesCount: 0,
    likeLoading: false,
    ads: [],
    adsLoading: true,
    shareDropdown: false,
  });

  const shareRef = useRef(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token, authHeader, isAuthenticated } = useAuth();
  const { apiCall, imgURL } = useApi();

    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useClickOutside(shareRef, () => setState(prev => ({ ...prev, shareDropdown: false })));

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Fetch news article
  const fetchNews = useCallback(async () => {
    updateState({ loading: true });
    const { data } = await apiCall(API_ENDPOINTS.NEWS(slug));
    if (data?.success) {
      updateState({ newsData: data.data.news, loading: false });
    } else {
      updateState({ newsData: null, loading: false });
    }
  }, [slug, apiCall, updateState]);

  // Fetch ads
  const fetchAds = useCallback(async () => {
    const { data } = await apiCall(API_ENDPOINTS.ADS);
    updateState({
      ads: data?.success ? data.data.advertisements : [],
      adsLoading: false,
    });
  }, [apiCall, updateState]);

  // Fetch initial like status and count
  const fetchNewsInteractions = useCallback(
    async (newsId) => {
      if (!newsId) return;
      try {
        if (isAuthenticated) {
          const { data: likeData } = await apiCall(API_ENDPOINTS.LIKE_STATUS(newsId), {
            headers: authHeader,
          });
          if (likeData) {
            const isLiked = likeData.liked ?? likeData.isLiked ?? likeData.data?.liked ?? false;
            updateState({ liked: isLiked });
          }
        }
        const { data: likesData } = await apiCall(API_ENDPOINTS.LIKES(newsId));
        if (likesData) {
          const count = likesData.likeCount ?? likesData.likesCount ?? likesData.data?.count ?? 0;
          updateState({ likesCount: count });
        }
      } catch (error) {
        console.error('Error fetching news interactions:', error);
      }
    },
    [apiCall, authHeader, isAuthenticated, updateState]
  );

  // Handler: Toggle Like (Optimistic UI, NO polling)
  const handleLikeToggle = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like this news');
      return;
    }
    if (!state.newsData?.id || state.likeLoading) return;
    updateState({ likeLoading: true });

    try {
      const { data, error } = await apiCall(API_ENDPOINTS.LIKE_TOGGLE(state.newsData.id), {
        method: 'POST',
        headers: authHeader,
      });

      if (!error && data?.success) {
        // Optimistic update; do NOT poll for status
        updateState({
          liked: !state.liked,
          likesCount: state.liked ? state.likesCount - 1 : state.likesCount + 1,
          likeLoading: false,
        });
      } else {
        toast.error('Failed to update like status');
        updateState({ likeLoading: false });
      }
    } catch (error) {
      toast.error('Failed to update like status');
      updateState({ likeLoading: false });
    }
  }, [state.newsData?.id, state.liked, state.likesCount, state.likeLoading, isAuthenticated, apiCall, authHeader, updateState]);

  // Handler: Social Share
  const handleShare = useCallback(
    async (platform) => {
      const currentUrl = window.location.href;
      const title = state.newsData?.title || '';
      if (platform === 'copy') {
        try {
          await navigator.clipboard.writeText(currentUrl);
          toast.success('Link copied to clipboard');
        } catch {
          toast.error('Failed to copy link');
        }
      } else {
        const shareUrl = SHARE_PLATFORMS[platform]?.(currentUrl, title);
        if (shareUrl) {
          window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
        }
      }
      updateState({ shareDropdown: false });
    },
    [state.newsData?.title, updateState]
  );

  // Handler: Copy article text with source URL
  const handleCopy = (e) => {
    e.preventDefault();
    const selection = window.getSelection();
    const selectedText = selection.toString();
    const url = window.location.href;
    const modifiedText = `${selectedText}\n\nRead more at: ${url}`;
    e.clipboardData.setData('text/plain', modifiedText);
  };

  // Fetch data on mount and when slug changes
  useEffect(() => {
    fetchNews();
    fetchAds();
  }, [fetchNews, fetchAds]);

  // Fetch like status when newsData.id changes
  useEffect(() => {
    if (state.newsData?.id) {
      fetchNewsInteractions(state.newsData.id);
    }
  }, [state.newsData?.id, fetchNewsInteractions]);

  // Loading state
  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading news...</p>
        </div>
      </div>
    );
  }

  // News not found
  if (!state.newsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">News Not Found</h2>
          <p className="text-gray-600 mb-4">The news article you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="shadow-sm border-b sticky top-0 z-40 backdrop-blur-md bg-white/95">
        <Navbar />
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Article Column */}
        <div className="lg:col-span-3">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Back Button */}
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              className="flex pt-6 pl-3 items-center text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </motion.button>

            <div className="p-6">
              {/* Tags */}
              {state.newsData.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {state.newsData.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1
                onCopy={handleCopy}
                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight"
              >
                {state.newsData.title}
              </h1>

              {/* Location */}
              {state.newsData.submissionLocation && (
                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>
                    {state.newsData.submissionLocation.city}, {state.newsData.submissionLocation.country}
                  </span>
                </div>
              )}

              {/* Engagement Bar */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
                <div className="flex items-center gap-6 text-gray-600">
                  <button
                    onClick={handleLikeToggle}
                    disabled={state.likeLoading}
                    className={`flex items-center transition-colors ${
                      state.liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                    }`}
                  >
                    {state.likeLoading ? (
                      <LoadingSpinner size="sm" className="mr-2" />
                    ) : (
                      <Heart
                        className={`w-5 h-5 mr-2 ${state.liked ? 'fill-current' : ''}`}
                      />
                    )}
                    <span>
                      {state.newsData.likes}
                    </span>
                  </button>
                  <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                  </div>
                </div>
                {/* Share Button */}
                <div className="relative" ref={shareRef}>
                  <button
                    onClick={() =>
                      updateState({ shareDropdown: !state.shareDropdown })
                    }
                    className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                  <ShareDropdown
                    isOpen={state.shareDropdown}
                    onClose={() => updateState({ shareDropdown: false })}
                    onShare={handleShare}
                    newsTitle={state.newsData.title}
                  />
                </div>
              </div>

              {/* Featured Image */}
              {state.newsData.media?.length > 0 && (
                <div className="relative mb-6">
                  <img
                    src={`${imgURL}${state.newsData.media[0]}`}
                    alt={state.newsData.title}
                    className="w-full h-80 object-cover rounded-lg"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                    AI Verified News
                  </div>
                </div>
              )}

              {/* Content */}
              <div
                className="prose prose-gray max-w-none mb-6 prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: state.newsData.description }}
              />

              {/* Reporter Info */}
              {state.newsData.reporter && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg mb-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                      {state.newsData.reporter.name[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {state.newsData.reporter.name}
                      </h3>
                      <p className="text-blue-600 font-medium mb-2">
                        {state.newsData.reporter.role}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        {state.newsData.reporter.bio}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Metadata */}
              <NewsMetadata newsData={state.newsData} />
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-200 p-6">
              <CommentsSection newsId={state.newsData.id} />
            </div>
          </motion.article>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <AdSection
              ads={state.ads}
              adsLoading={state.adsLoading}
              img_url={imgURL}
            />
            {console.log('Ads:', state.ads)}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewsDetail;
