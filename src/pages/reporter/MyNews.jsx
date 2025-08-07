import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Heart, 
  Share2, 
  FileText, 
  MapPin, 
  Globe, 
  Calendar,
  Star,
  TrendingUp,
  Tag,
  ExternalLink,
  Clock,
  BarChart3,
  Plus,
  Filter,
  Search,
  RefreshCw,
  Edit3,
  AlertCircle
} from 'lucide-react';

const MyNews = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const token = localStorage.getItem('token');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      scale: 1.02,
      y: -4,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
      transition: { duration: 0.3 }
    }
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, delay: 0.2 }
    }
  };

  const url = import.meta.env.VITE_BASE_URL

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${url}news/my-posts`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        setPosts(response.data.data.news);
        setPagination(response.data.data.pagination);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [token]);

  const getStatusBadge = (status) => {
    const configs = {
      published: {
        bg: 'bg-gradient-to-r from-green-100 to-emerald-100',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: '✅'
      },
      draft: {
        bg: 'bg-gradient-to-r from-gray-100 to-slate-100',
        text: 'text-gray-700',
        border: 'border-gray-200',
        icon: '📝'
      },
      pending: {
        bg: 'bg-gradient-to-r from-yellow-100 to-amber-100',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: '⏳'
      },
      rejected: {
        bg: 'bg-gradient-to-r from-red-100 to-pink-100',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: '❌'
      },
      default: {
        bg: 'bg-gradient-to-r from-red-100 to-indigo-100',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: '📄'
      }
    };

    const config = configs[status] || configs.default;
    
    return (
      <span className={`
        inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide
        ${config.bg} ${config.text} border ${config.border} shadow-sm
      `}>
        <span className="mr-1">{config.icon}</span>
        {status}
      </span>
    );
  };

  const truncateHtml = (html, maxLength = 200) => {
    if (!html) return '';
    
    const plainText = html.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) {
      return html;
    }
    
    const div = document.createElement('div');
    div.innerHTML = html;
    
    let truncated = '';
    let textLength = 0;
    
    const walkNodes = (node) => {
      if (textLength >= maxLength) return false;
      
      if (node.nodeType === 3) {
        const remainingLength = maxLength - textLength;
        if (node.textContent.length <= remainingLength) {
          truncated += node.textContent;
          textLength += node.textContent.length;
        } else {
          truncated += node.textContent.substring(0, remainingLength) + '...';
          textLength = maxLength;
          return false;
        }
      } else if (node.nodeType === 1) {
        truncated += `<${node.tagName.toLowerCase()}`;
        
        if (node.attributes) {
          for (let attr of node.attributes) {
            truncated += ` ${attr.name}="${attr.value}"`;
          }
        }
        truncated += '>';
        
        for (let child of node.childNodes) {
          if (!walkNodes(child)) break;
        }
        
        truncated += `</${node.tagName.toLowerCase()}>`;
      }
      return true;
    };
    
    for (let child of div.childNodes) {
      if (!walkNodes(child)) break;
    }
    
    return truncated;
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getEngagementScore = (views, likes, shares) => {
    return Math.min(100, Math.round(((likes * 2 + shares * 3 + views) / Math.max(views, 1)) * 10));
  };

  const getTotalStats = () => {
    return posts.reduce((acc, post) => ({
      likes: acc.likes + post.likes,
      shares: acc.shares + post.shares
    }), { likes: 0, shares: 0 });
  };

  const totalStats = getTotalStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-red-50 flex items-center justify-center">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-ping opacity-20"></div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-red-200 rounded-2xl p-8 max-w-md shadow-2xl"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-red-800 font-bold text-xl mb-2">Error Loading Articles</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .html-content {
          line-height: 1.6;
        }
        
        .html-content p {
          margin-bottom: 0.75rem;
        }
        
        .html-content strong {
          font-weight: 600;
        }
        
        .html-content em {
          font-style: italic;
        }
        
        .html-content u {
          text-decoration: underline;
        }
        
        .html-content a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .html-content a:hover {
          color: #1d4ed8;
        }
        
        .html-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .html-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .html-content li {
          margin-bottom: 0.25rem;
        }
        
        .html-content h1, .html-content h2, .html-content h3, 
        .html-content h4, .html-content h5, .html-content h6 {
          font-weight: 600;
          margin-bottom: 0.5rem;
          margin-top: 1rem;
        }
        
        .html-content h1 { font-size: 1.5rem; }
        .html-content h2 { font-size: 1.375rem; }
        .html-content h3 { font-size: 1.25rem; }
        .html-content h4 { font-size: 1.125rem; }
        .html-content h5 { font-size: 1rem; }
        .html-content h6 { font-size: 0.875rem; }
        
        .truncated-content {
          position: relative;
          max-height: 120px;
          overflow: hidden;
        }
        
        .truncated-content::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 30px;
          background: linear-gradient(transparent, white);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-red-50">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative max-w-7xl mx-auto p-6 space-y-8"
          >
            {/* Header */}
            <motion.div variants={cardVariants} className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-600 to-red-600 rounded-2xl mb-6 shadow-lg">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-red-800 bg-clip-text text-transparent mb-3">
                My News Articles
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Manage and track your published content and article performance
              </p>
            </motion.div>

          

            {/* Search and Filter Bar */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search articles by title or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>
                {/* <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none bg-white min-w-[150px]"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div> */}
                <Link to="/submit-news">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Plus className="w-5 h-5" />
                    <span>New Article</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Articles Grid */}
            <div className="space-y-6">
              <AnimatePresence>
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20 }}
                    whileHover="hover"
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    {/* Status and Engagement Header */}
                  

                    <div className="p-6">
                      {/* Article Title */}
                      <Link to={`/news/${post.slug}`}>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-red-600 transition-colors cursor-pointer line-clamp-2 group">
                          {post.title}
                          <ExternalLink className="inline-block w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h2>
                      </Link>
                      
                      {/* HTML Description */}
                      <div 
                        className="text-gray-700 mb-4 html-content truncated-content"
                        dangerouslySetInnerHTML={{ 
                          __html: truncateHtml(post.description, 300) 
                        }}
                      />

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="inline-flex items-center bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold border border-red-200">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Meta Information */}
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          {post.geotag && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{post.geotag.city}, {post.geotag.state}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Globe className="w-4 h-4" />
                            <span>{post.language}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            post.accessType === 'free' 
                              ? 'bg-green-100 text-green-700 border border-green-200' 
                              : 'bg-orange-100 text-orange-700 border border-orange-200'
                          }`}>
                            {post.accessType}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.publishingDate).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>

                      {/* Special Badges */}
                      {(post.featured || post.trending) && (
                        <div className="flex gap-2 mt-4">
                          {post.featured && (
                            <span className="inline-flex items-center bg-gradient-to-r from-red-100 to-pink-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </span>
                          )}
                          {post.trending && (
                            <span className="inline-flex items-center bg-gradient-to-r from-red-100 to-orange-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Trending
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredPosts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100"
                >
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Articles Found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter !== 'all' 
                      ? "Try adjusting your search or filter criteria" 
                      : "Start creating content to see your articles here"
                    }
                  </p>
                  {!searchTerm && statusFilter === 'all' && (
                    <Link to="/submit-news">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Create Your First Article</span>
                      </motion.button>
                    </Link>
                  )}
                </motion.div>
              )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <motion.div
                variants={cardVariants}
                className="flex items-center justify-center mt-8"
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-6 py-4">
                  <span className="text-gray-600 font-medium">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MyNews;
