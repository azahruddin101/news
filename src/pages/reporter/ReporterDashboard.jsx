import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Eye, 
  Heart, 
  Share2, 
  FileText, 
  TrendingUp,
  Users,
  Globe,
  Lock,
  CheckCircle,
  XCircle,
  Award,
  Clock,
  Calendar,
  Languages,
  MapPin,
  Activity,
  ArrowUpRight,
  ExternalLink,
  Zap,
  Star
} from 'lucide-react';

const ReporterDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }
    },
    hover: {
      scale: 1.03,
      y: -4,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const statCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    hover: {
      scale: 1.05,
      y: -8,
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  const url = import.meta.env.VITE_BASE_URL
  // Fetch reporter stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(
          `${url}stats/reporter?timeframe=30`,
          {
            method: 'GET',
            headers: {
              'accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();
        setStats(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  // Get color for category
  const getCategoryColor = (index) => {
    const colors = [
      'from-red-500 to-red-600', 'from-green-500 to-green-600', 
      'from-red-500 to-red-600', 'from-orange-500 to-orange-600',
      'from-red-500 to-red-600', 'from-teal-500 to-teal-600',
      'from-indigo-500 to-indigo-600', 'from-pink-500 to-pink-600'
    ];
    return colors[index % colors.length];
  };

  const getEngagementScore = (views, likes, shares) => {
    return Math.min(100, Math.round(((likes * 2 + shares * 3 + views) / Math.max(views, 1)) * 10));
  };

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
            <Activity className="w-8 h-8 text-white" />
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
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-red-800 font-bold text-xl mb-2">Dashboard Error</h3>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-red-50">
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative max-w-7xl mx-auto p-6 space-y-8"
        >
          {/* Enhanced Header */}
          <motion.div variants={cardVariants} className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-600 to-red-600 rounded-2xl mb-6 shadow-lg">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-red-800 bg-clip-text text-transparent mb-3">
              Reporter Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive overview of your news articles and performance metrics
            </p>
            <div className="flex items-center justify-center mt-4">
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
                {stats?.summary?.timeframe || 'Last 30 days'}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <motion.div
              variants={statCardVariants}
              whileHover="hover"
              className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-red-500/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Articles</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.summary?.totalArticles || 0}</p>
                  <p className="text-sm text-green-600 font-medium">
                    {stats?.summary?.publishedArticles || 0} published
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={statCardVariants}
              whileHover="hover"
              className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Approval Rate</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.summary?.approvalRate || 0}%</p>
                  <p className="text-sm text-red-500 font-medium">
                    {stats?.summary?.rejectionRate || 0}% rejected
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={statCardVariants}
              whileHover="hover"
              className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Rejected Articles</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.summary?.totalArticles - stats?.summary?.publishedArticles}</p>
                  <p className="text-sm text-red-600 font-medium">
                    {stats?.summary?.totalArticles || 0} Total Articles
                  </p>
                </div>
              </div>
            </motion.div>

            {/* <motion.div
              variants={statCardVariants}
              whileHover="hover"
              className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Engagement</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {(stats?.performance?.totalLikes + stats?.performance?.totalShares) || 0}
                  </p>
                  <p className="text-sm text-orange-600 font-medium">
                    {stats?.performance?.totalLikes || 0} likes • {stats?.performance?.totalShares || 0} shares
                  </p>
                </div>
              </div>
            </motion.div> */}
          </div>

          {/* Enhanced Recent Articles Section */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-red-600 to-red-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Recent Articles</h2>
                    <p className="text-red-100">Your latest published content</p>
                  </div>
                </div>
                <div className="text-white/80">
                  <span className="text-sm font-medium">
                    {stats?.recentArticles?.length || 0} articles
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8">
              {stats?.recentArticles?.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentArticles.map((article, index) => (
                    <motion.div
                      key={article._id}
                      variants={itemVariants}
                      whileHover={{ 
                        scale: 1.02, 
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" 
                      }}
                      className="group relative bg-gradient-to-r from-gray-50 to-red-50/30 rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-6">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="p-2 bg-gradient-to-r from-red-500 to-red-500 rounded-lg">
                              <FileText className="h-4 w-4 text-white" />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                              article.status === 'published' 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                            }`}>
                              {article.status}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              {formatRelativeTime(article.publishingDate || article.createdAt)}
                            </span>
                          </div>
                          
                          <h3 className="font-bold text-lg text-gray-900 mb-3 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          
                          
                        </div>
                        
                        
                      </div>
                      
                      {/* Progress bar for engagement */}
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <motion.div 
                            className={`h-2 rounded-full ${
                              getEngagementScore(article.views, article.likes, article.shares) >= 70 
                                ? 'bg-gradient-to-r from-green-400 to-green-600' 
                                : getEngagementScore(article.views, article.likes, article.shares) >= 40
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                                : 'bg-gradient-to-r from-red-400 to-red-600'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${getEngagementScore(article.views, article.likes, article.shares)}%` 
                            }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Recent Articles</h3>
                  <p className="text-gray-500">Start creating content to see your articles here</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Rest of the existing sections with enhanced styling... */}
          {/* (Performance Overview, Status Breakdown, Category Performance, etc.) */}
          {/* I'll include the key sections here for brevity */}

          {/* Enhanced All Time Stats */}
          {/* <motion.div
            variants={cardVariants}
            className="bg-gradient-to-r from-indigo-600 via-red-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="relative p-8">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mr-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">All Time Achievements</h2>
                    <p className="text-white/80">Your complete performance summary</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-3">
                      <p className="text-3xl font-bold text-white">{stats?.allTimeStats?.totalArticles || 0}</p>
                    </div>
                    <p className="text-sm text-white/80 font-semibold">Total Articles</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-3">
                      <p className="text-3xl font-bold text-white">{stats?.allTimeStats?.publishedCount || 0}</p>
                    </div>
                    <p className="text-sm text-white/80 font-semibold">Published</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-3">
                      <p className="text-3xl font-bold text-white">{stats?.allTimeStats?.totalViews?.toLocaleString() || 0}</p>
                    </div>
                    <p className="text-sm text-white/80 font-semibold">Total Views</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-3">
                      <p className="text-3xl font-bold text-white">{stats?.allTimeStats?.totalLikes || 0}</p>
                    </div>
                    <p className="text-sm text-white/80 font-semibold">Total Likes</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-3">
                      <p className="text-3xl font-bold text-white">{stats?.allTimeStats?.totalShares || 0}</p>
                    </div>
                    <p className="text-sm text-white/80 font-semibold">Total Shares</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div> */}
        </motion.div>
      </div>
    </div>
  );
};

export default ReporterDashboard;
