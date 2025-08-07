import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Eye, 
  CheckCircle,
  XCircle,
  FileText, 
  TrendingUp,
  Users,
  Globe,
  Lock,
  Award,
  Clock,
  Zap,
  Star,
  Brain,
  Edit3,
  AlertCircle,
  Target,
  PieChart,
  Gauge,
  ShieldCheck,
  Lightbulb,
  Cpu,
  BarChart,
  Timer,
  BookOpen
} from 'lucide-react';
import Loader from '../common/Loader';
import axios from 'axios';

const EditorDashboard = () => {
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
      scale: 1,
      y: 0,
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

  // Fetch editor stats
  useEffect(() => {
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`${url}stats/editor`, {
        params: { timeframe: 30 },
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setStats(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);

  // Helper functions
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'from-green-400 to-green-600';
    if (percentage >= 60) return 'from-red-400 to-red-600';
    if (percentage >= 40) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getTokenUsageColor = (percentage) => {
    if (percentage >= 80) return 'text-red-600 bg-red-100 border-red-200';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-red-50 flex items-center justify-center">
        {/* <motion.div 
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
            <Edit3 className="w-8 h-8 text-white" />
          </div>
          <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-ping opacity-20"></div>
        </motion.div> */}
        <Loader />
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
              <Edit3 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-red-800 bg-clip-text text-transparent mb-3">
              Editor Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive overview of your editorial work and AI-assisted content management
            </p>
            <div className="flex items-center justify-center mt-4">
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
                {stats?.summary?.timeframe || 'Last 30 days'}
              </div>
            </div>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Articles Approved</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.summary?.articlesApproved || 0}</p>
                  <p className="text-sm text-green-600 font-medium">
                    {stats?.summary?.approvalRate || 0}% approval rate
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
                    <XCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Articles Rejected</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.summary?.articlesRejected || 0}</p>
                  <p className="text-sm text-red-600 font-medium">
                    Quality control maintained
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={statCardVariants}
              whileHover="hover"
              className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-red-500/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pending Review</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.summary?.pendingArticles || 0}</p>
                  <p className="text-sm text-red-600 font-medium">
                    Awaiting your review
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
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Views Generated</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.performance?.totalViewsGenerated?.toLocaleString() || 0}</p>
                  <p className="text-sm text-red-600 font-medium">
                    Avg: {stats?.performance?.avgViewsOnApproved?.toFixed(1) || 0} per article
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Usage Overview */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-red-600 to-red-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">AI Assistant Usage</h2>
                    <p className="text-red-100">Smart content enhancement tools</p>
                  </div>
                </div>
                <div className="text-white/80">
                  <span className="text-sm font-medium">
                    {stats?.aiUsage?.tokenUsage?.percentage || 0}% used
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-50 rounded-2xl border border-red-100">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-red-600 mb-1">{stats?.aiUsage?.aiEnhancedArticles || 0}</p>
                  <p className="text-sm text-red-700 font-medium">AI Enhanced</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-green-600 mb-1">{stats?.aiUsage?.titleSuggestionsUsed || 0}</p>
                  <p className="text-sm text-green-700 font-medium">Title Suggestions</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl border border-red-100">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-red-600 mb-1">{stats?.aiUsage?.descriptionSuggestionsUsed || 0}</p>
                  <p className="text-sm text-red-700 font-medium">Description Helps</p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Cpu className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-orange-600 mb-1">{stats?.aiUsage?.tokenUsage?.used || 0}</p>
                  <p className="text-sm text-orange-700 font-medium">Tokens Used</p>
                </div>
              </div>

              {/* Token Usage Progress */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Token Usage</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getTokenUsageColor(stats?.aiUsage?.tokenUsage?.percentage || 0)}`}>
                    {stats?.aiUsage?.tokenUsage?.used || 0} / {stats?.aiUsage?.tokenUsage?.limit || 5000}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
                  <motion.div 
                    className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(stats?.aiUsage?.tokenUsage?.percentage || 0)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stats?.aiUsage?.tokenUsage?.percentage || 0}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0</span>
                  <span>{stats?.aiUsage?.tokenUsage?.remaining || 5000} remaining</span>
                  <span>{stats?.aiUsage?.tokenUsage?.limit || 5000}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Work Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rejection Types */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center mb-6">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Rejection Analysis</h2>
              </div>
              
              {stats?.workBreakdown?.byRejectionType?.length > 0 ? (
                <div className="space-y-3">
                  {stats.workBreakdown.byRejectionType.map((item, index) => (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                    >
                      <span className="font-medium text-red-800">{item._id}</span>
                      <span className="text-lg font-bold text-red-600">{item.count}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-green-600 font-medium">No rejections recorded</p>
                  <p className="text-sm text-gray-500">Excellent quality control!</p>
                </div>
              )}
            </motion.div>

            {/* Edit Fields */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center mb-6">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <Edit3 className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Edit Focus Areas</h2>
              </div>
              
              {stats?.workBreakdown?.byEditField?.length > 0 ? (
                <div className="space-y-3">
                  {stats.workBreakdown.byEditField.map((item, index) => (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                    >
                      <span className="font-medium text-red-800 capitalize">{item._id}</span>
                      <span className="text-lg font-bold text-red-600">{item.count}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Edit3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No edit data available</p>
                  <p className="text-sm text-gray-400">Start editing to see insights</p>
                </div>
              )}
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center mb-6">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <PieChart className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Category Distribution</h2>
              </div>
              
              {stats?.workBreakdown?.byCategory?.length > 0 ? (
                <div className="space-y-3">
                  {stats.workBreakdown.byCategory.map((item, index) => (
                    <motion.div
                      key={item._id}
                      variants={itemVariants}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                    >
                      <span className="font-medium text-red-800">{item.categoryName || 'Uncategorized'}</span>
                      <span className="text-lg font-bold text-red-600">{item.count}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <PieChart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No category data</p>
                  <p className="text-sm text-gray-400">Categories will appear here</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Productivity Trends */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <BarChart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Productivity Trends</h2>
                  <p className="text-green-100">Your editorial activity over time</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {stats?.productivity?.dailyTrends?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
                  {stats.productivity.dailyTrends.map((trend, index) => (
                    <motion.div
                      key={`${trend._id.year}-${trend._id.month}-${trend._id.day}`}
                      variants={itemVariants}
                      className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-100"
                    >
                      <div className="text-2xl font-bold text-green-600 mb-1">{trend.count}</div>
                      <div className="text-xs text-green-700 font-medium">
                        {new Date(trend.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Activity Data</h3>
                  <p className="text-gray-500">Start reviewing articles to see your productivity trends</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Performance Summary */}
          <motion.div
            variants={cardVariants}
            className="bg-gradient-to-r from-red-600 via-red-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="relative p-8">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mr-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Editorial Performance</h2>
                    <p className="text-white/80">Your comprehensive editorial summary</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-3">
                      <p className="text-3xl font-bold text-white">{stats?.summary?.totalProcessed || 0}</p>
                    </div>
                    <p className="text-sm text-white/80 font-semibold">Total Processed</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-3">
                      <p className="text-3xl font-bold text-white">{stats?.summary?.approvalRate || 0}%</p>
                    </div>
                    <p className="text-sm text-white/80 font-semibold">Approval Rate</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-3">
                      <p className="text-3xl font-bold text-white">{stats?.aiUsage?.aiEnhancedArticles || 0}</p>
                    </div>
                    <p className="text-sm text-white/80 font-semibold">AI Enhanced</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-3">
                      <p className="text-3xl font-bold text-white">{stats?.performance?.totalViewsGenerated?.toLocaleString() || 0}</p>
                    </div>
                    <p className="text-sm text-white/80 font-semibold">Views Generated</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditorDashboard;
