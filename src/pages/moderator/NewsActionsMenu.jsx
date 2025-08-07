import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NewsActionsMenu = ({
  news,
  onToggleNews,
  onToggleTrending,
  onToggleSponsored,
  onToggleBreaking,
  onToggleFeatured,
  onFactCheck,
  togglingIds,
  togglingIdsTrending,
  togglingIdsSponsored,
  togglingIdsBreaking,
  togglingIdsFeatured,
  factCheckingIds,
  factCheckResults
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAction = (action, shouldCloseMenu = true) => {
    action();
    if (shouldCloseMenu) {
      setIsMenuOpen(false);
    }
  };

  const getFactCheckDisplay = () => {
    const result = factCheckResults[news._id];
    if (!result) return null;

    const displayConfig = {
      'TRUE': { text: 'VERIFIED', color: 'text-green-600', bgColor: 'bg-green-100' },
      'FALSE': { text: 'FALSE INFO', color: 'text-red-600', bgColor: 'bg-red-100' },
      'UNCERTAIN': { text: 'UNCERTAIN', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    };

    const config = displayConfig[result] || displayConfig['UNCERTAIN'];
    
    return (
      <div className={`px-2 py-1 rounded-full text-xs font-bold ${config.color} ${config.bgColor}`}>
        {config.text}
      </div>
    );
  };

  return (
    <div className="relative" ref={menuRef} style={{ zIndex: 9999 }}>
      {/* Three Dots Button */}
      <button
        onClick={handleMenuToggle}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex items-center justify-center relative z-[10000]"
        aria-label="More actions"
        style={{ zIndex: 10000 }}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          className="text-gray-600"
        >
          <circle cx="12" cy="5" r="2" fill="currentColor"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
          <circle cx="12" cy="19" r="2" fill="currentColor"/>
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999]"
            style={{ 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              zIndex: 9999 
            }}
          >
            <div className="p-4 space-y-4" style={{ position: 'relative', zIndex: 10001 }}>
              {/* News Status Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">News Status</span>
                <div className="flex items-center space-x-2">
                  <div
                    onClick={() => handleAction(() => onToggleNews(news._id, news.isActive))}
                    className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-300 ${
                      news.isActive ? 'bg-green-500' : 'bg-red-500'
                    } ${togglingIds.has(news._id) ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300" 
                      style={{ transform: news.isActive ? 'translateX(24px)' : 'translateX(0px)' }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${news.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {togglingIds.has(news._id) ? (
                      <motion.span 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⭯
                      </motion.span>
                    ) : (
                      news.isActive ? 'ENABLED' : 'DISABLED'
                    )}
                  </span>
                </div>
              </div>

              {/* Trending Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Trending</span>
                <div className="flex items-center space-x-2">
                  <div
                    onClick={() => handleAction(() => onToggleTrending(news._id, news.trending))}
                    className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-300 ${
                      news.trending ? 'bg-green-500' : 'bg-red-500'
                    } ${togglingIdsTrending.has(news._id) ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300" 
                      style={{ transform: news.trending ? 'translateX(24px)' : 'translateX(0px)' }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${news.trending ? 'text-green-600' : 'text-red-600'}`}>
                    {togglingIdsTrending.has(news._id) ? (
                      <motion.span 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⭯
                      </motion.span>
                    ) : (
                      news.trending ? 'TRENDING' : 'REGULAR'
                    )}
                  </span>
                </div>
              </div>

              {/* Sponsored Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Sponsored</span>
                <div className="flex items-center space-x-2">
                  <div
                    onClick={() => handleAction(() => onToggleSponsored(news._id, news.isSponsored))}
                    className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-300 ${
                      news.isSponsored ? 'bg-green-500' : 'bg-red-500'
                    } ${togglingIdsSponsored.has(news._id) ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300" 
                      style={{ transform: news.isSponsored ? 'translateX(24px)' : 'translateX(0px)' }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${news.isSponsored ? 'text-green-600' : 'text-red-600'}`}>
                    {togglingIdsSponsored.has(news._id) ? (
                      <motion.span 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⭯
                      </motion.span>
                    ) : (
                      news.isSponsored ? 'SPONSORED' : 'ORGANIC'
                    )}
                  </span>
                </div>
              </div>

              {/* Breaking Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Breaking</span>
                <div className="flex items-center space-x-2">
                  <div
                    onClick={() => handleAction(() => onToggleBreaking(news._id, news.isBreaking))}
                    className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-300 ${
                      news.isBreaking ? 'bg-green-500' : 'bg-red-500'
                    } ${togglingIdsBreaking.has(news._id) ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300" 
                      style={{ transform: news.isBreaking ? 'translateX(24px)' : 'translateX(0px)' }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${news.isBreaking ? 'text-green-600' : 'text-red-600'}`}>
                    {togglingIdsBreaking.has(news._id) ? (
                      <motion.span 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⭯
                      </motion.span>
                    ) : (
                      news.isBreaking ? 'BREAKING' : 'NORMAL'
                    )}
                  </span>
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Featured</span>
                <div className="flex items-center space-x-2">
                  <div
                    onClick={() => handleAction(() => onToggleFeatured(news._id, news.featured))}
                    className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-300 ${
                      news.featured ? 'bg-green-500' : 'bg-red-500'
                    } ${togglingIdsFeatured.has(news._id) ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300" 
                      style={{ transform: news.featured ? 'translateX(24px)' : 'translateX(0px)' }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${news.featured ? 'text-green-600' : 'text-red-600'}`}>
                    {togglingIdsFeatured.has(news._id) ? (
                      <motion.span 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⭯
                      </motion.span>
                    ) : (
                      news.featured ? 'FEATURED' : 'REGULAR'
                    )}
                  </span>
                </div>
              </div>

              {/* Fact Check Section */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Fact Check</span>
                  <div className="flex items-center space-x-2">
                    {factCheckResults[news._id] ? (
                      getFactCheckDisplay()
                    ) : (
                      <button
                        onClick={() => handleAction(() => onFactCheck(news._id), false)}
                        disabled={factCheckingIds.has(news._id)}
                        className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors duration-200 ${
                          factCheckingIds.has(news._id)
                            ? 'bg-gray-300 cursor-not-allowed opacity-60 text-gray-500'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {factCheckingIds.has(news._id) ? (
                          <div className="flex items-center space-x-1">
                            <motion.span 
                              animate={{ rotate: 360 }} 
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              ⭯
                            </motion.span>
                            <span>Checking...</span>
                          </div>
                        ) : (
                          'Verify Facts'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsActionsMenu;