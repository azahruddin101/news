// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Loader from '../common/Loader';
// import Failed from '../common/Failed';
// import { motion } from 'framer-motion';
// import { Edit3, Users, CheckCircle, Clock, XCircle } from 'lucide-react';

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       duration: 0.6,
//       staggerChildren: 0.08,
//     },
//   },
// };

// const cardVariants = {
//   hidden: { opacity: 0, y: 20, scale: 0.95 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
//   },
//   hover: {
//     scale: 1.03,
//     y: -4,
//     boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
//     transition: { duration: 0.3, ease: 'easeOut' },
//   },
// };

// const statCardVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
//   hover: {
//     scale: 1.05,
//     y: -8,
//     boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
//     transition: { duration: 0.3 },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, x: -20 },
//   visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
// };

// const StatCard = ({ title, value, color = 'text-red-700', icon: Icon = Users }) => (
//   <motion.div
//     variants={statCardVariants}
//     whileHover="hover"
//     className="group relative bg-white rounded-2xl shadow-lg border-l-8 border-red-600 p-5"
//   >
//     <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-gradient-to-r from-red-400 to-red-600 blur-xl transition-opacity" />
//     <div className="relative z-10">
//       <div className="flex items-center mb-3">
//         <div className="p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-sm mr-3">
//           <Icon className="h-5 w-5 text-white" />
//         </div>
//         <div>
//           <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
//           <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
//         </div>
//       </div>
//     </div>
//   </motion.div>
// );

// const UserTypeCard = ({ title, value, color = 'text-red-700' }) => (
//   <motion.div
//     variants={itemVariants}
//     className="p-4 bg-white rounded-xl border-l-2 border-red-600 flex items-center justify-between space-x-4 shadow-sm"
//   >
//     <span className="font-medium text-gray-800 capitalize">{title}</span>
//     <span className={`text-xl font-bold ${color}`}>{value}</span>
//   </motion.div>
// );

// const AdminDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const url = import.meta.env.VITE_BASE_URL;

//   useEffect(() => {
//     const fetchStats = async () => {
//       setLoading(true);
//       setError(null);
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Authentication token not found');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(`${url}stats/admin?timeframe=30`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: 'application/json',
//           },
//         });

//         const data = response.data.data;
//         const roleMap = {};
//         data.users.roleDistribution.forEach((role) => {
//           roleMap[role._id] = role.count;
//         });

//         const statusMap = {
//           active: 0,
//           pending: 0,
//           disabled: 0,
//         };
//         data.users.statusDistribution.forEach((status) => {
//           statusMap[status._id] = status.count;
//         });

//         const totalUsers = Object.values(roleMap).reduce((sum, count) => sum + count, 0);

//         setStats({
//           totalUsers,
//           activeUsers: statusMap.active || 0,
//           pendingUsers: statusMap.pending || 0,
//           disabledUsers: statusMap.disabled || 0,
//           usersByRole: roleMap,
//         });
//         toast.success('Dashboard data loaded successfully!');
//       } catch (err) {
//         setError(err.message);
//         toast.error('Error fetching dashboard stats.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, [url]);

  

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9, y: 20 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="bg-white rounded-3xl shadow-xl border border-red-200 p-8 max-w-md"
//         >
//           <div className="text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <XCircle className="w-8 h-8 text-red-600" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard Error</h3>
//             <p className="text-red-600 mb-4">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-white">
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="max-w-7xl mx-auto p-6 space-y-8"
//       >
//         {/* Header */}
//         <motion.div
//           variants={cardVariants}
//           className="text-center space-y-4 mb-12"
//         >
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-600 to-pink-700 rounded-2xl mb-6 shadow-xl">
//             <Edit3 className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-red-700 to-red-600 bg-clip-text text-transparent mb-3 tracking-tight">
//             Admin Dashboard
//           </h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Comprehensive overview of your users and platform
//           </p>
//           <div className="inline-flex bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold">
//             Last 30 days
//           </div>
//         </motion.div>


//         {loading?(
//           <div className="h-screen w-full bg-gradient-to-br from-white via-red-50 to-white flex items-center justify-center">
//             <Loader />
//           </div>):(<>
//         {/* User Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//           <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="text-red-700" />
//           <StatCard title="Active Users" value={stats.activeUsers} icon={CheckCircle} color="text-green-600" />
//           <StatCard title="Pending Users" value={stats.pendingUsers} icon={Clock} color="text-yellow-500" />
//           <StatCard title="Disabled Users" value={stats.disabledUsers} icon={XCircle} color="text-red-600" />
//         </div>

//         {/* Users by Role */}
//         <motion.div
//           variants={cardVariants}
//           className="bg-white rounded-3xl shadow-xl border border-red-100 overflow-hidden"
//         >
//           <div className="bg-gradient-to-r from-red-600 to-pink-800 px-8 py-6 -mb-1">
//             <div className="flex items-center">
//               <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm mr-4">
//                 <Users className="w-8 h-8 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-white tracking-tight">
//                 Users by Role
//               </h2>
//             </div>
//           </div>
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {Object.entries(stats.usersByRole).map(([role, count]) => (
//                 <UserTypeCard key={role} title={role} value={count} />
//               ))}
//             </div>
//           </div>
//         </motion.div>

      
//         </>)}
//       </motion.div>
//     </div>
//   );
// };

// export default AdminDashboard;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Loader from '../common/Loader';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { Edit3, Users, CheckCircle, Clock, XCircle } from 'lucide-react';

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       duration: 0.6,
//       staggerChildren: 0.08,
//     },
//   },
// };

// const cardVariants = {
//   hidden: { opacity: 0, y: 20, scale: 0.95 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
//   },
//   hover: {
//     scale: 1.03,
//     y: -4,
//     boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
//     transition: { duration: 0.3, ease: 'easeOut' },
//   },
// };

// const statCardVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
//   hover: {
//     scale: 1.05,
//     y: -8,
//     boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
//     transition: { duration: 0.3 },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, x: -20 },
//   visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
// };

// const StatCard = ({ title, value, color = 'text-red-700', icon: Icon = Users, onClick }) => (
//   <motion.div
//     variants={statCardVariants}
//     whileHover="hover"
//     onClick={onClick}
//     className="group relative bg-white rounded-2xl shadow-lg border-l-8 border-red-600 p-5 cursor-pointer"
//   >
//     <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-gradient-to-r from-red-400 to-red-600 blur-xl transition-opacity" />
//     <div className="relative z-10">
//       <div className="flex items-center mb-3">
//         <div className="p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-sm mr-3">
//           <Icon className="h-5 w-5 text-white" />
//         </div>
//         <div>
//           <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
//           <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
//         </div>
//       </div>
//     </div>
//   </motion.div>
// );

// const UserTypeCard = ({ title, value, color = 'text-red-700', onClick }) => (
//   <motion.div
//     variants={itemVariants}
//     onClick={onClick}
//     className="p-4 bg-white rounded-xl border-l-2 border-red-600 flex items-center justify-between space-x-4 shadow-sm"
//   >
//     <span className="font-medium text-gray-800 capitalize">{title}</span>
//     <span className={`text-xl font-bold ${color}`}>{value}</span>
//   </motion.div>
// );

// const AdminDashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const url = import.meta.env.VITE_BASE_URL;

//   const handleStatCardClick = (filterType) => {
//     navigate(`/all-users?filter=${filterType}`);
//   };

//   useEffect(() => {
//     const fetchStats = async () => {
//       setLoading(true);
//       setError(null);
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('Authentication token not found');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(`${url}stats/admin?timeframe=30`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             Accept: 'application/json',
//           },
//         });

//         const data = response.data.data;
//         const roleMap = {};
//         data.users.roleDistribution.forEach((role) => {
//           roleMap[role._id] = role.count;
//         });

//         const statusMap = {
//           active: 0,
//           pending: 0,
//           disabled: 0,
//         };
//         data.users.statusDistribution.forEach((status) => {
//           statusMap[status._id] = status.count;
//         });

//         const totalUsers = Object.values(roleMap).reduce((sum, count) => sum + count, 0);

//         setStats({
//           totalUsers,
//           activeUsers: statusMap.active || 0,
//           pendingUsers: statusMap.pending || 0,
//           disabledUsers: statusMap.disabled || 0,
//           usersByRole: roleMap,
//         });
//         toast.success('Dashboard data loaded successfully!');
//       } catch (err) {
//         setError(err.message);
//         toast.error('Error fetching dashboard stats.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, [url]);

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9, y: 20 }}
//           animate={{ opacity: 1, scale: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="bg-white rounded-3xl shadow-xl border border-red-200 p-8 max-w-md"
//         >
//           <div className="text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <XCircle className="w-8 h-8 text-red-600" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard Error</h3>
//             <p className="text-red-600 mb-4">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-white">
//       <motion.div
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="max-w-7xl mx-auto p-6 space-y-8"
//       >
//         {/* Header */}
//         <motion.div
//           variants={cardVariants}
//           className="text-center space-y-4 mb-12"
//         >
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-600 to-pink-700 rounded-2xl mb-6 shadow-xl">
//             <Edit3 className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-red-700 to-red-600 bg-clip-text text-transparent mb-3 tracking-tight">
//             Admin Dashboard
//           </h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Comprehensive overview of your users and platform
//           </p>
//           <div className="inline-flex bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold">
//             Last 30 days
//           </div>
//         </motion.div>

//         {loading ? (
//           <div className="h-screen w-full bg-gradient-to-br from-white via-red-50 to-white flex items-center justify-center">
//             <Loader />
//           </div>
//         ) : (
//           <>
//             {/* User Summary Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//               <StatCard
//                 title="Total Users"
//                 value={stats.totalUsers}
//                 icon={Users}
//                 color="text-red-700"
//                 onClick={() => handleStatCardClick('all')}
//               />
//               <StatCard
//                 title="Active Users"
//                 value={stats.activeUsers}
//                 icon={CheckCircle}
//                 color="text-green-600"
//                 onClick={() => handleStatCardClick('active')}
//               />
//               <StatCard
//                 title="Pending Users"
//                 value={stats.pendingUsers}
//                 icon={Clock}
//                 color="text-yellow-500"
//                 onClick={() => handleStatCardClick('pending')}
//               />
//               <StatCard
//                 title="Disabled Users"
//                 value={stats.disabledUsers}
//                 icon={XCircle}
//                 color="text-red-600"
//                 onClick={() => handleStatCardClick('disabled')}
//               />
//             </div>

//             {/* Users by Role */}
//             <motion.div
//               variants={cardVariants}
//               className="bg-white rounded-3xl shadow-xl border border-red-100 overflow-hidden"
//             >
//               <div className="bg-gradient-to-r from-red-600 to-pink-800 px-8 py-6 -mb-1">
//                 <div className="flex items-center">
//                   <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm mr-4">
//                     <Users className="w-8 h-8 text-white" />
//                   </div>
//                   <h2 className="text-2xl font-bold text-white tracking-tight">
//                     Users by Role
//                   </h2>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {Object.entries(stats.usersByRole).map(([role, count]) => (
//                     <UserTypeCard key={role} title={role} value={count} />
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default AdminDashboard;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';
import { motion } from 'framer-motion';
import { Edit3, Users, CheckCircle, Clock, XCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  hover: {
    scale: 1.03,
    y: -4,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

const statCardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  hover: {
    scale: 1.05,
    y: -8,
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

// === StatCard ===
const StatCard = ({ title, value, color, icon: Icon, onClick }) => (
  <motion.div
    variants={statCardVariants}
    whileHover="hover"
    onClick={onClick}
    className="group relative bg-white rounded-2xl shadow-lg border-l-8 border-red-600 p-5 cursor-pointer"
  >
    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-gradient-to-r from-red-400 to-red-600 blur-xl transition-opacity" />
    <div className="relative z-10">
      <div className="flex items-center mb-3">
        <div className="p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-sm mr-3">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

// === RoleCard ===
const UserTypeCard = ({ title, value, color = 'text-red-700', onClick }) => (
  <motion.div
    variants={itemVariants}
    onClick={onClick}
    className="p-4 bg-white rounded-xl border-l-2 border-red-600 flex items-center justify-between space-x-4 shadow-sm cursor-pointer"
  >
    <span className="font-medium text-gray-800 capitalize">{title}</span>
    <span className={`text-xl font-bold ${color}`}>{value}</span>
  </motion.div>
);

// === Main Component ===
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${url}stats/admin?timeframe=30`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        const data = response.data.data;
        const roleMap = {};
        data.users.roleDistribution.forEach((role) => {
          roleMap[role._id] = role.count;
        });

        const statusMap = { active: 0, pending: 0, disabled: 0 };
        data.users.statusDistribution.forEach((status) => {
          statusMap[status._id] = status.count;
        });

        const totalUsers = Object.values(roleMap).reduce((sum, count) => sum + count, 0);

        setStats({
          totalUsers,
          activeUsers: statusMap.active || 0,
          pendingUsers: statusMap.pending || 0,
          disabledUsers: statusMap.disabled || 0,
          usersByRole: roleMap,
        });

        toast.success('Dashboard data loaded successfully!');
      } catch (err) {
        setError(err.message);
        toast.error('Error fetching dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [url]);

  const handleFilterRedirect = (filterType, value) => {
    navigate(`/all-users?${filterType}=${value}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl border border-red-200 p-8 max-w-md"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard Error</h3>
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
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-white">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto p-6 space-y-8"
      >
        <motion.div variants={cardVariants} className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-600 to-pink-700 rounded-2xl mb-6 shadow-xl">
            <Edit3 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-red-700 to-red-600 bg-clip-text text-transparent mb-3 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive overview of your users and platform
          </p>
          <div className="inline-flex bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold">
            Last 30 days
          </div>
        </motion.div>

        {loading ? (
          <div>
            <Loader />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="text-red-700" onClick={() => handleFilterRedirect('status', 'all')} />
              <StatCard title="Active Users" value={stats.activeUsers} icon={CheckCircle} color="text-green-600" onClick={() => handleFilterRedirect('status', 'active')} />
              <StatCard title="Pending Users" value={stats.pendingUsers} icon={Clock} color="text-yellow-500" onClick={() => handleFilterRedirect('status', 'pending')} />
              <StatCard title="Disabled Users" value={stats.disabledUsers} icon={XCircle} color="text-red-600" onClick={() => handleFilterRedirect('status', 'disabled')} />
            </div>

            {/* Role Distribution Cards */}
            <motion.div variants={cardVariants} className="bg-white rounded-3xl shadow-xl border border-red-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-pink-800 px-8 py-6 -mb-1">
                <div className="flex items-center">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm mr-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Users by Role</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(stats.usersByRole).map(([role, count]) => (
                    <UserTypeCard
                      key={role}
                      title={role}
                      value={count}
                      onClick={() => handleFilterRedirect('role', role)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
