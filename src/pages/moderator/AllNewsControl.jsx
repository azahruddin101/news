import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import NewsActionsMenu from './NewsActionsMenu';
import Loader from '../common/Loader';

function AllNewsControl() {
  const [newsData, setNewsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalNews: 0,
    hasNext: false,
    hasPrev: false,
    limit: 10
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingIds, setTogglingIds] = useState(new Set());
  const [togglingIdsTrending, setTogglingIdsTrending] = useState(new Set());
  const [togglingIdsSponsored, setTogglingIdsSponsored] = useState(new Set());
  const [togglingIdsBreaking, setTogglingIdsBreaking] = useState(new Set());
  const [togglingIdsFeatured, setTogglingIdsFeatured] = useState(new Set());
  const [factCheckingIds, setFactCheckingIds] = useState(new Set());
  const [factCheckResults, setFactCheckResults] = useState({});

  const url = import.meta.env.VITE_BASE_URL;
  const imgUrl = import.meta.env.VITE_IMG_URL;
  const authToken = localStorage.getItem('token');


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${url}categories?page=1&limit=20&sortBy=displayOrder&sortOrder=asc`,
          { headers: { 'accept': 'application/json' } }
        );
        if (response.data.success) {
          setCategories(response.data.data.docs);
        } else {
          setCategories([]);
        }
      } catch (error) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, [url]);

  // Fetch news whenever page, category, or active search changes
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        let apiUrl;
        let params = {
          page: pagination.currentPage,
          limit: pagination.limit,
        };

        // Use different endpoint for search
        if (activeSearchTerm) {
          apiUrl = `${url}news/search`;
          params.q = activeSearchTerm;
          if (selectedCategory) params.category = selectedCategory;
        } else {
          apiUrl = `${url}news`;
          if (selectedCategory) params.category = selectedCategory;
        }

        console.log('API URL:', apiUrl);
        console.log('Params:', params);

        const response = await axios.get(apiUrl, {
          params,
          headers: {
            'accept': 'application/json',
            ...(authToken && { 'Authorization': `Bearer ${authToken}` })
          },
        });

        console.log('API Response:', response.data);

        if (response.data.success) {
          const { news, pagination: paginationData } = response.data.data;
          setNewsData(news);
          setPagination(prev => ({
            ...prev,
            ...paginationData
          }));
        } else {
          setError(response.data.message || 'Failed to fetch news.');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.message || err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    // eslint-disable-next-line
  }, [pagination.currentPage, selectedCategory, activeSearchTerm]);

  // UI Handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm.trim());
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 }));    // Reset to first page on category change
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setActiveSearchTerm('');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleToggleNews = async (newsId, currentStatus) => {
    try {
      setTogglingIds(prev => new Set([...prev, newsId]));

      const response = await axios.post(
        `${url}news/${newsId}/toggle`,
        {
          "isActive": currentStatus ? false : true
        },
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setNewsData(prevNews =>
          prevNews.map(news =>
            news._id === newsId
              ? { ...news, isActive: !currentStatus }
              : news
          )
        );
      } else {
        throw new Error(response.data.message || `Failed to toggle news`);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update news status');
    } finally {
      setTogglingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(newsId);
        return newSet;
      });
    }
  };

  const handleToggleTrending = async (newsId, currentStatus) => {
    try {
      setTogglingIdsTrending(prev => new Set([...prev, newsId]));

      const response = await axios.post(
        `${url}news/${newsId}/trending`,
        {
          "trending": currentStatus ? false : true
        },
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setNewsData(prevNews =>
          prevNews.map(news =>
            news._id === newsId
              ? { ...news, trending: !currentStatus }
              : news
          )
        );
      } else {
        throw new Error(response.data.message || `Failed to toggle trending news`);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update news status');
    } finally {
      setTogglingIdsTrending(prev => {
        const newSet = new Set(prev);
        newSet.delete(newsId);
        return newSet;
      });
    }
  };

  const handleToggleSponsored = async (newsId, currentStatus) => {
    try {
      setTogglingIdsSponsored(prev => new Set([...prev, newsId]));

      const response = await axios.post(
        `${url}news/${newsId}/sponsored`,
        {
          "isSponsored": currentStatus ? false : true
        },
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setNewsData(prevNews =>
          prevNews.map(news =>
            news._id === newsId
              ? { ...news, isSponsored: !currentStatus }
              : news
          )
        );
      } else {
        throw new Error(response.data.message || `Failed to toggle sponsored news`);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update sponsored status');
    } finally {
      setTogglingIdsSponsored(prev => {
        const newSet = new Set(prev);
        newSet.delete(newsId);
        return newSet;
      });
    }
  };

  const handleToggleBreaking = async (newsId, currentStatus) => {
    try {
      setTogglingIdsBreaking(prev => new Set([...prev, newsId]));

      const response = await axios.post(
        `${url}news/${newsId}/breaking`,
        {
          "isBreaking": currentStatus ? false : true
        },
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setNewsData(prevNews =>
          prevNews.map(news =>
            news._id === newsId
              ? { ...news, isBreaking: !currentStatus }
              : news
          )
        );
      } else {
        throw new Error(response.data.message || `Failed to toggle breaking news`);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update breaking status');
    } finally {
      setTogglingIdsBreaking(prev => {
        const newSet = new Set(prev);
        newSet.delete(newsId);
        return newSet;
      });
    }
  };

  const handleToggleFeatured = async (newsId, currentStatus) => {
    try {
      setTogglingIdsFeatured(prev => new Set([...prev, newsId]));

      const response = await axios.post(
        `${url}news/${newsId}/featured`,
        {
          "featured": currentStatus ? false : true
        },
        {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setNewsData(prevNews =>
          prevNews.map(news =>
            news._id === newsId
              ? { ...news, featured: !currentStatus }
              : news
          )
        );
      } else {
        throw new Error(response.data.message || `Failed to toggle featured news`);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update featured status');
    } finally {
      setTogglingIdsFeatured(prev => {
        const newSet = new Set(prev);
        newSet.delete(newsId);
        return newSet;
      });
    }
  };

  const handleFactCheck = async (newsId) => {
    setFactCheckingIds(prev => new Set(prev).add(newsId));

    try {

      const newsItem = newsData.find(news => news._id === newsId);

      if (!newsItem) {
        throw new Error('News item not found');
      }

      const combinedText = `${newsItem.title}. ${stripHtmlTags(newsItem.description)}`;

      const getLanguageCode = (language) => {
        if (!language) return 'en';

        const languageMap = {
          'English': 'en',
          'Hindi': 'hi',
          'english': 'en',
          'hindi': 'hi'
        };

        return languageMap[language] || 'en';
      };

      const payload = {
        newsId: newsId,
        text: combinedText.trim(),
        language: getLanguageCode(newsItem.language)
      };



      const response = await axios.post(
        `${url}fact-check/verify`,
        payload,
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      if (response.data.success) {
        setNewsData(prevNews =>
          prevNews.map(news =>
            news._id === response.data.data.newsId
              ? { ...news, isVerified: response.data.data.status === 'verified' }
              : news
          )
        );


        setFactCheckResults(prev => ({
          ...prev,
          [newsId]: response.data.data.verificationResult || 'UNCERTAIN'
        }));
      } else {
        throw new Error(response.data.message || 'Fact check failed');
      }

    } catch (error) {
      console.error('Fact check failed:', error);

      setFactCheckResults(prev => ({
        ...prev,
        [newsId]: 'UNCERTAIN'
      }));

      alert(error.response?.message || error.message || 'Fact check service temporarily unavailable');

    } finally {
      setFactCheckingIds(prev => {
        const updated = new Set(prev);
        updated.delete(newsId);
        return updated;
      });
    }
  };

  //   const handleFactCheck = async (newsId) => {
  //   setFactCheckingIds(prev => new Set(prev).add(newsId));

  //   try {
  //     // ... your existing code to prepare payload and call the API ...
  //     const newsItem = newsData.find(news => news._id === newsId);

  //       if (!newsItem) {
  //         throw new Error('News item not found');
  //       }

  //       const combinedText = `${newsItem.title}. ${stripHtmlTags(newsItem.description)}`;

  //       const getLanguageCode = (language) => {
  //         if (!language) return 'en';

  //         const languageMap = {
  //           'English': 'en',
  //           'Hindi': 'hi',
  //           'english': 'en',
  //           'hindi': 'hi'
  //         };

  //         return languageMap[language] || 'en';
  //       };

  //       const payload = {
  //         newsId: newsId,
  //         text: combinedText.trim(),
  //         language: getLanguageCode(newsItem.language)
  //       };

  //     const response = await axios.post(
  //       `${url}fact-check/verify`,
  //       payload,
  //       {
  //         headers: {
  //           'accept': 'application/json',
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${authToken}`
  //         }
  //       }
  //     );

  //     if (response.data.success) {
  //       const { newsId: returnedNewsId, verificationResult } = response.data.data;
  //       setNewsData(prevNews =>
  //         prevNews.map(news =>
  //           news._id === returnedNewsId
  //             ? { ...news, isVerified: verificationResult === 'VERIFIED' } // or similar logic
  //             : news
  //         )
  //       );
  //       setFactCheckResults(prev => ({
  //         ...prev,
  //         [newsId]: verificationResult || 'UNCERTAIN'
  //       }));
  //     } else {
  //       throw new Error(response.data.message || 'Fact check failed');
  //     }
  //   } catch (error) {
  //     console.error('Fact check failed:', error);
  //     setFactCheckResults(prev => ({
  //       ...prev,
  //       [newsId]: 'UNCERTAIN'
  //     }));
  //   } finally {
  //     setFactCheckingIds(prev => {
  //       const updated = new Set(prev);
  //       updated.delete(newsId);
  //       return updated;
  //     });
  //   }
  // };


  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };
  const handlePrev = () => pagination.hasPrev && handlePageChange(pagination.currentPage - 1);
  const handleNext = () => pagination.hasNext && handlePageChange(pagination.currentPage + 1);

  // -- Other functions (truncation, toggles -- same as your code) --
  const stripHtmlTags = (html) => new DOMParser().parseFromString(html, 'text/html').body.textContent || "";
  const truncateText = (text, maxLength = 150) => text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;

  // ------------------- Rendering -------------------

  if (error) {
    return (
      <div className="m-2 sm:m-5 p-3 sm:p-5 bg-red-100 border border-red-200 text-red-600 rounded-md">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex justify-center items-center mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-red-600">All News</h2>
      </div>

      {/* Search and Filter Section */}
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6'>
        <div className="flex w-full sm:max-w-lg">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 sm:p-3 border-2 border-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm sm:text-base"
          />
          <button
            onClick={handleSearch}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors duration-200 text-sm sm:text-base font-medium"
          >
            Search
          </button>
          {activeSearchTerm && (
            <button
              onClick={handleClearSearch}
              className="px-3 sm:px-4 py-2 sm:py-3 bg-black text-white rounded-r-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200 text-sm sm:text-base font-medium"
            >
              Clear
            </button>
          )}
          {!activeSearchTerm && (
            <div className="w-0 border-r-2 border-gray-200 rounded-r-md"></div>
          )}
        </div>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full sm:w-auto sm:ml-3 border-2 border-gray-300 rounded px-2 py-2 text-gray-800 text-sm sm:text-base"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option value={cat._id} key={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* News List */}



      <div className="flex flex-col gap-3 sm:gap-4">
        {newsData.length === 0 ? (
          <div>
            {loading ? (
              <>
                <div className="flex items-center justify-center h-screen bg-gray-100">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
                    <div className="w-full h-full border-4 border-t-transparent border-red-600 rounded-full animate-spin"></div>
                  </div>
                </div>
              </>
            ) : (
              activeSearchTerm || selectedCategory
                ? `No news found matching your search "${activeSearchTerm}" ${selectedCategory ? 'in selected category' : ''}.`
                : "No news available."
            )}
          </div>
        ) : (
          newsData.map(news => (
            <motion.div
              key={news._id}
              layout

              className={`flex flex-col sm:flex-row border-2 rounded-xl p-3 sm:p-4 lg:p-5 shadow-sm transition-opacity ${news.isActive ? 'bg-white border-green-500 opacity-100' : 'bg-gray-100 border-red-500 opacity-70'
                }`}
            >
              {/* Image Section */}
              {news.media?.length > 0 && (
                <div className="w-full sm:w-36 mb-3 sm:mb-0 sm:mr-4 lg:mr-5 flex-shrink-0">
                  <img
                    src={`${imgUrl}${news.media[0]}`}
                    alt="news thumbnail"
                    className="w-full sm:w-36 h-32 sm:h-24 object-cover rounded-lg"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                </div>
              )}

              {/* Content Section */}
              <div className="flex-1 min-w-0">
                <Link to={`/news/${news.slug}`} className="no-underline">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-800 hover:text-blue-600 mb-2 line-clamp-2">
                    {news.title}
                  </h3>
                </Link>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 sm:line-clamp-3">
                  {truncateText(stripHtmlTags(news.description))}
                </p>

                {/* Meta Information */}
                <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-500 mt-2 sm:mt-3 gap-2 sm:gap-0">
                  <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
                    <span>📅 {new Date(news.createdAt).toLocaleDateString()}</span>
                    <span>👁️ {news.views} views</span>
                    <span>❤️ {news.likes} likes</span>
                    {news.language && <span>🌐 {news.language}</span>}
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {news.featured && (
                      <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        FEATURED
                      </span>
                    )}
                    {news.trending && (
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        TRENDING
                      </span>
                    )}
                    {news.isSponsored && (
                      <span className="bg-purple-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        SPONSORED
                      </span>
                    )}
                    {news.isBreaking && (
                      <span className="bg-yellow-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        BREAKING
                      </span>
                    )}

                    {news.isVerified && (
                      <span className="bg-yellow-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        AI VERIFIED
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Menu */}
              <div className="flex items-start mt-3 sm:mt-0 sm:ml-4 justify-end sm:justify-start" style={{ position: 'relative', zIndex: 1000 }}>
                <NewsActionsMenu
                  news={news}
                  onToggleNews={handleToggleNews}
                  onToggleTrending={handleToggleTrending}
                  onToggleSponsored={handleToggleSponsored}
                  onToggleBreaking={handleToggleBreaking}
                  onToggleFeatured={handleToggleFeatured}
                  onFactCheck={handleFactCheck}
                  togglingIds={togglingIds}
                  togglingIdsTrending={togglingIdsTrending}
                  togglingIdsSponsored={togglingIdsSponsored}
                  togglingIdsBreaking={togglingIdsBreaking}
                  togglingIdsFeatured={togglingIdsFeatured}
                  factCheckingIds={factCheckingIds}
                  factCheckResults={factCheckResults}
                />
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center border-t border-gray-200 pt-3 sm:pt-4 gap-3 sm:gap-0">
        <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
          Showing page {pagination.currentPage} of {pagination.totalPages}
          {pagination.totalNews > 0 && (
            <span className="block sm:inline"> • {pagination.totalNews} total articles</span>
          )}
        </div>

        <div className="flex gap-2 items-center justify-center sm:justify-end">
          <button
            onClick={handlePrev}
            disabled={!pagination.hasPrev}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-md ${pagination.hasPrev
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
          >
            <span className="hidden sm:inline">← Previous</span>
            <span className="sm:hidden">←</span>
          </button>

          <span className="px-3 sm:px-4 py-2 bg-gray-100 rounded-md text-xs sm:text-sm font-bold text-gray-800">
            {pagination.currentPage}
          </span>

          <button
            onClick={handleNext}
            disabled={!pagination.hasNext}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-md ${pagination.hasNext
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
          >
            <span className="hidden sm:inline">Next →</span>
            <span className="sm:hidden">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AllNewsControl;