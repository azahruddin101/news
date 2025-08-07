import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  XCircle,
  Clock,
  Languages,
  ArrowUpRight,
  Shield,
  UserCheck,
  UserX,
  PieChart,
  ShieldCheck,
  Crown,
} from 'lucide-react';

import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ModeratorDashboard = () => {
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
      scale: 1.01,
      y: 0,
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.1 }
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

  // Fetch moderator stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(
          `${url}stats/moderator?timeframe=30`,
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

  // Helper functions
  const getHealthColor = (score) => {
    if (score >= 90) return 'from-red-400 to-red-600';
    if (score >= 70) return 'from-yellow-400 to-yellow-600';
    if (score >= 50) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  const getHealthBadgeColor = (score) => {
    if (score >= 90) return 'text-red-700 bg-red-100 border-red-200';
    if (score >= 70) return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    if (score >= 50) return 'text-orange-700 bg-orange-100 border-orange-200';
    return 'text-red-700 bg-red-100 border-red-200';
  };

  const getRoleColor = (index) => {
    const colors = [
      'from-red-500 to-red-600', 'from-red-500 to-red-600', 
      'from-red-500 to-red-600', 'from-orange-500 to-orange-600',
      'from-red-500 to-red-600', 'from-red-500 to-red-600'
    ];
    return colors[index % colors.length];
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
            <Shield className="w-8 h-8 text-white" />
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
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-red-800 bg-clip-text text-transparent mb-3">
              Moderator Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive platform oversight and user management control center
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
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-red-500/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Users Approved</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.summary?.usersApproved || 0}</p>
                  <p className="text-sm text-red-600 font-medium">
                    Active moderation
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
                    <UserX className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Users Disabled</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.summary?.usersDisabled || 0}</p>
                  <p className="text-sm text-red-600 font-medium">
                    Security maintained
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={statCardVariants}
              whileHover="hover"
              className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pending Reviews</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {(stats?.summary?.pendingUsers || 0) + (stats?.summary?.pendingArticles || 0)}
                  </p>
                  <p className="text-sm text-orange-600 font-medium">
                    {stats?.summary?.pendingUsers || 0} users • {stats?.summary?.pendingArticles || 0} articles
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
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Platform Health</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.contentHealth?.platformHealthScore || 0}%</p>
                  <p className="text-sm text-red-600 font-medium">
                    Excellent condition
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Content Status Distribution */}
      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center mb-6">
          <div className="p-2 bg-red-100 rounded-lg mr-3">
            <PieChart className="h-5 w-5 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Content Status Distribution
          </h2>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer>
            <RePieChart>
              <Pie
                data={
                  stats?.contentHealth?.statusDistribution?.map((item) => ({
                    name: item._id,
                    value: item.count,
                  })) || []
                }
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {(stats?.contentHealth?.statusDistribution || []).map((_, index) => (
                  <Cell
                    key={`status-${index}`}
                    fill={["#EF4444", "#F59E0B", "#6B7280"][index % 3]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Language Distribution */}
      <motion.div
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center mb-6">
          <div className="p-2 bg-pink-100 rounded-lg mr-3">
            <Languages className="h-5 w-5 text-pink-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Language Distribution
          </h2>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer>
            <RePieChart>
              <Pie
                data={
                  stats?.contentHealth?.languageHealth?.map((lang) => ({
                    name: lang._id,
                    value: lang.count,
                  })) || []
                }
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {(stats?.contentHealth?.languageHealth || []).map((_, index) => (
                  <Cell
                    key={`lang-${index}`}
                    fill={["#EF4444", "#EC4899", "#F59E0B", "#10B981"][index % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
          <motion.div
            variants={cardVariants}
            className="bg-gradient-to-r from-red-600 via-red-600 to-red-600 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="relative p-8">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm mr-4">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Platform Overview</h2>
                    <p className="text-white/80">Complete system health and performance metrics</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-3">
                      <p className="text-3xl font-bold text-white">{stats?.platformOverview?.totalArticlesInPeriod || 0}</p>
                    </div>
                    <p className="text-sm text-white/80 font-semibold">Articles This Period</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-3">
                      <p className="text-3xl font-bold text-white">{stats?.platformOverview?.avgViewsPerArticle || 0}</p>
                    </div>
                    <p className="text-sm text-white/80 font-semibold">Avg Views</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm mb-3">
                      <p className="text-3xl font-bold text-white">{stats?.platformOverview?.featuredContent || 0}</p>
                    </div>
                    <p className="text-sm text-white/80 font-semibold">Featured Content</p>
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

export default ModeratorDashboard;
