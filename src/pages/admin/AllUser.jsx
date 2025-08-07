// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Loader from '../common/Loader';

// // Constants for better maintainability
// const ROLES = {
//   ALL: '',
//   ADMIN: 'ADMIN',
//   USER: 'USER',
//   MODERATOR: 'MODERATOR',
//   EDITOR: 'EDITOR'
// };

// const STATUSES = {
//   ALL: '',
//   ACTIVE: 'active',
//   PENDING: 'pending',
//   DISABLED: 'disabled'
// };

// const ITEMS_PER_PAGE = [10, 20, 50];

// const ACTIONS = {
//   DELETE: 'delete',
//   ENABLE: 'enable',
//   DISABLE: 'disable'
// };

// const AllUser = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // State management with better organization
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [actionType, setActionType] = useState('');
  
//   // Filter states
//   const [filters, setFilters] = useState({
//     role: ROLES.ALL,
//     status: STATUSES.ALL,
//     search: '',
//     page: 1,
//     limit: 10
//   });

//   const [pagination, setPagination] = useState({
//     total: 0,
//     totalPages: 0,
//     hasNext: false,
//     hasPrev: false
//   });

//   // Environment variables
//   const token = localStorage.getItem('token');
//   const url = import.meta.env.VITE_BASE_URL;

//   // Parse URL parameters and sync with state
//   const parseUrlParams = useCallback(() => {
//     const queryParams = new URLSearchParams(location.search);
    
//     const urlFilters = {
//       role: queryParams.get('role') || ROLES.ALL,
//       status: queryParams.get('status') || queryParams.get('filter') || STATUSES.ALL,
//       search: queryParams.get('search') || '',
//       page: Math.max(1, parseInt(queryParams.get('page')) || 1),
//       limit: parseInt(queryParams.get('limit')) || 10
//     };

//     // Validate status values
//     if (urlFilters.status && !Object.values(STATUSES).includes(urlFilters.status)) {
//       urlFilters.status = STATUSES.ALL;
//     }

//     // Validate role values
//     if (urlFilters.role && !Object.values(ROLES).includes(urlFilters.role)) {
//       urlFilters.role = ROLES.ALL;
//     }

//     // Validate limit values
//     if (!ITEMS_PER_PAGE.includes(urlFilters.limit)) {
//       urlFilters.limit = 10;
//     }

//     return urlFilters;
//   }, [location.search]);

//   // Update URL when filters change
//   const updateUrl = useCallback((newFilters) => {
//     const queryParams = new URLSearchParams();
    
//     Object.entries(newFilters).forEach(([key, value]) => {
//       if (value && value !== '' && !(key === 'page' && value === 1)) {
//         queryParams.set(key, value.toString());
//       }
//     });

//     const newUrl = queryParams.toString() 
//       ? `${location.pathname}?${queryParams.toString()}`
//       : location.pathname;
    
//     navigate(newUrl, { replace: true });
//   }, [location.pathname, navigate]);

//   // Fetch users with error handling and loading states
//   const fetchUsers = useCallback(async (currentFilters = filters) => {
//     if (!token) {
//       toast.error('Authentication token not found');
//       return;
//     }

//     setLoading(true);
    
//     try {
//       // Build query string
//       const queryParams = new URLSearchParams({
//         page: currentFilters.page.toString(),
//         limit: currentFilters.limit.toString()
//       });

//       if (currentFilters.role) queryParams.append('role', currentFilters.role);
//       if (currentFilters.status) queryParams.append('status', currentFilters.status);
//       if (currentFilters.search.trim()) queryParams.append('search', currentFilters.search.trim());

//       const response = await axios.get(`${url}admin/users?${queryParams.toString()}`, {
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         timeout: 10000 // 10 second timeout
//       });

//       const { users: fetchedUsers, total, totalPages } = response.data.data;
      
//       setUsers(fetchedUsers || []);
//       setPagination({
//         total: total || 0,
//         totalPages: totalPages || 0,
//         hasNext: currentFilters.page < (totalPages || 0),
//         hasPrev: currentFilters.page > 1
//       });

//     } catch (error) {
//       console.error('Fetch users error:', error);
      
//       if (error.response?.status === 401) {
//         toast.error('Session expired. Please login again.');
//         // Handle logout logic here if needed
//       } else if (error.response?.status === 403) {
//         toast.error('You do not have permission to access this resource.');
//       } else if (error.code === 'ECONNABORTED') {
//         toast.error('Request timeout. Please try again.');
//       } else {
//         toast.error(error.response?.data?.message || 'Failed to fetch users. Please try again.');
//       }
      
//       setUsers([]);
//       setPagination({ total: 0, totalPages: 0, hasNext: false, hasPrev: false });
//     } finally {
//       setLoading(false);
//     }
//   }, [token, url, filters]);

//   // Filter users client-side for search functionality
//   const filteredUsers = useMemo(() => {
//     if (!filters.search.trim()) return users;
    
//     const searchTerm = filters.search.toLowerCase().trim();
//     return users.filter(user => 
//       user.name?.toLowerCase().includes(searchTerm) ||
//       user.email?.toLowerCase().includes(searchTerm)
//     );
//   }, [users, filters.search]);

//   // Update filters with URL sync
//   const updateFilters = useCallback((newFilters) => {
//     const updatedFilters = { ...filters, ...newFilters };
    
//     // Reset to page 1 when changing filters (except pagination)
//     if (!newFilters.hasOwnProperty('page')) {
//       updatedFilters.page = 1;
//     }
    
//     setFilters(updatedFilters);
//     updateUrl(updatedFilters);
//   }, [filters, updateUrl]);

//   // Handle user actions with improved error handling
//   const handleAction = useCallback((user, action) => {
//     if (!user || !action) return;
//     setSelectedUser(user);
//     setActionType(action);
//   }, []);

//   const confirmAction = useCallback(async () => {
//     if (!selectedUser || !actionType || !token) return;

//     try {
//       let endpoint = '';
//       let method = 'post';
//       let successMessage = '';

//       switch (actionType) {
//         case ACTIONS.DELETE:
//           endpoint = `${url}admin/users/${selectedUser.id}`;
//           method = 'delete';
//           successMessage = `${selectedUser.name} deleted successfully!`;
//           break;
//         case ACTIONS.ENABLE:
//         case ACTIONS.DISABLE:
//           endpoint = `${url}admin/users/${selectedUser.id}/${actionType}`;
//           successMessage = `${selectedUser.name} ${actionType === ACTIONS.ENABLE ? 'enabled' : 'disabled'} successfully!`;
//           break;
//         default:
//           throw new Error('Invalid action type');
//       }

//       const axiosConfig = {
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         timeout: 10000
//       };

//       if (method === 'delete') {
//         await axios.delete(endpoint, axiosConfig);
//       } else {
//         await axios.post(endpoint, {}, axiosConfig);
//       }

//       toast.success(successMessage);

//       // Optimistic UI update
//       if (actionType === ACTIONS.DELETE) {
//         setUsers(prev => prev.filter(u => u._id !== selectedUser._id));
//       } else {
//         const newStatus = actionType === ACTIONS.ENABLE;
//         setUsers(prev =>
//           prev.map(u => 
//             u._id === selectedUser._id 
//               ? { ...u, isActive: newStatus } 
//               : u
//           )
//         );
//       }

//       // Refresh data to ensure consistency
//       setTimeout(() => fetchUsers(), 500);

//     } catch (error) {
//       console.error('Action error:', error);
      
//       if (error.response?.status === 401) {
//         toast.error('Session expired. Please login again.');
//       } else if (error.response?.status === 403) {
//         toast.error('You do not have permission to perform this action.');
//       } else if (error.response?.status === 404) {
//         toast.error('User not found.');
//       } else {
//         toast.error(error.response?.data?.message || 'Action failed. Please try again.');
//       }
//     } finally {
//       setSelectedUser(null);
//       setActionType('');
//     }
//   }, [selectedUser, actionType, token, url, fetchUsers]);

//   // Initialize filters from URL on component mount
//   useEffect(() => {
//     const urlFilters = parseUrlParams();
//     setFilters(urlFilters);
//   }, [parseUrlParams]);

//   // Fetch users when filters change
//   useEffect(() => {
//     if (filters.role !== undefined) { // Only fetch after initial state is set
//       fetchUsers();
//     }
//   }, [filters.role, filters.status, filters.page, filters.limit, fetchUsers]);

//   // Handle pagination
//   const handlePageChange = useCallback((newPage) => {
//     updateFilters({ page: newPage });
//   }, [updateFilters]);

//   const handlePreviousPage = useCallback(() => {
//     if (pagination.hasPrev) {
//       handlePageChange(filters.page - 1);
//     }
//   }, [pagination.hasPrev, filters.page, handlePageChange]);

//   const handleNextPage = useCallback(() => {
//     if (pagination.hasNext) {
//       handlePageChange(filters.page + 1);
//     }
//   }, [pagination.hasNext, filters.page, handlePageChange]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 to-indigo-100 p-8">
//       <h1 className="text-5xl font-extrabold text-gray-900 mb-10 text-center drop-shadow-md">
//         <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-700">
//           User Dashboard
//         </span>
//       </h1>

//       {/* Filters & Search */}
//       <div className="max-w-6xl mx-auto mb-8 px-4">
//         <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
          
//           {/* Role Filter */}
//           <div className="flex flex-col">
//             <label className="text-sm font-medium text-gray-700 mb-1">Filter by Role</label>
//             <select
//               value={filters.role}
//               onChange={e => updateFilters({ role: e.target.value })}
//               className="px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value={ROLES.ALL}>All Roles</option>
//               <option value={ROLES.ADMIN}>Admin</option>
//               <option value={ROLES.USER}>User</option>
//               <option value={ROLES.MODERATOR}>Moderator</option>
//               <option value={ROLES.EDITOR}>Editor</option>
//             </select>
//           </div>

//           {/* Status Filter */}
//           <div className="flex flex-col">
//             <label className="text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
//             <select
//               value={filters.status}
//               onChange={e => updateFilters({ status: e.target.value })}
//               className="px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value={STATUSES.ALL}>All Status</option>
//               <option value={STATUSES.ACTIVE}>Active</option>
//               <option value={STATUSES.PENDING}>Pending</option>
//               <option value={STATUSES.DISABLED}>Disabled</option>
//             </select>
//           </div>

//           {/* Search Field */}
//           <div className="flex flex-col">
//             <label className="text-sm font-medium text-gray-700 mb-1">Search</label>
//             <input
//               type="text"
//               placeholder="Search name/email"
//               value={filters.search}
//               onChange={e => updateFilters({ search: e.target.value })}
//               className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-60"
//             />
//           </div>

//           {/* Limit Selector */}
//           <div className="flex flex-col">
//             <label className="text-sm font-medium text-gray-700 mb-1">Items per Page</label>
//             <select
//               value={filters.limit}
//               onChange={e => updateFilters({ limit: parseInt(e.target.value) })}
//               className="px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {ITEMS_PER_PAGE.map(size => (
//                 <option key={size} value={size}>{size} per page</option>
//               ))}
//             </select>
//           </div>

//         </div>
//       </div>

//       {loading ? (
//         <Loader />
//       ) : (
//         <>
//           <div className="bg-white shadow-2xl rounded-xl overflow-hidden max-w-6xl mx-auto ring-1 ring-gray-200">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Email
//                     </th>
//                     <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Role
//                     </th>
//                     <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-100">
//                   {filteredUsers.length > 0 ? (
//                     filteredUsers.map(user => (
//                       <tr key={user._id} className="hover:bg-red-50 transition duration-150 ease-in-out">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {user.name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           {user.email}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
//                           <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                             {user.role}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
//                           <label className="flex items-center justify-center cursor-pointer">
//                             <div className="relative">
//                               <input
//                                 type="checkbox"
//                                 className="sr-only"
//                                 checked={user.isActive}
//                                 onChange={() => handleAction(user, user.isActive ? ACTIONS.DISABLE : ACTIONS.ENABLE)}
//                               />
//                               <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${
//                                 user.isActive ? 'bg-green-500' : 'bg-red-500'
//                               }`}></div>
//                               <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${
//                                 user.isActive ? 'translate-x-6' : 'translate-x-0'
//                               }`}></div>
//                             </div>
//                             <span className={`ml-3 text-sm font-medium ${
//                               user.isActive ? 'text-green-700' : 'text-red-700'
//                             }`}>
//                               {user.isActive ? 'Active' : 'Inactive'}
//                             </span>
//                           </label>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
//                           <div className="flex justify-center">
//                             <button
//                               onClick={() => handleAction(user, ACTIONS.DELETE)}
//                               className="px-5 py-2 rounded-lg text-white font-medium bg-red-600 hover:bg-red-700 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="5" className="px-6 py-6 text-center text-gray-500 text-lg">
//                         No users found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Enhanced Pagination */}
//           <div className="flex justify-between items-center mt-6 max-w-6xl mx-auto px-4">
//             <div className="text-sm text-gray-700">
//               Showing {Math.min((filters.page - 1) * filters.limit + 1, pagination.total)} to{' '}
//               {Math.min(filters.page * filters.limit, pagination.total)} of {pagination.total} results
//             </div>
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={handlePreviousPage}
//                 disabled={!pagination.hasPrev}
//                 className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
//               >
//                 Previous
//               </button>
//               <span className="px-3 py-1 text-sm text-gray-600">
//                 Page {filters.page} of {pagination.totalPages || 1}
//               </span>
//               <button
//                 onClick={handleNextPage}
//                 disabled={!pagination.hasNext}
//                 className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Enhanced Confirmation Modal */}
//       {selectedUser && (
//         <div className="fixed inset-0 bg-gray-900/80 bg-opacity-70 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-8 rounded-2xl shadow-3xl w-full max-w-md border-t-4 border-red-500">
//             <div className="text-center mb-6">
//               <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
//                       d={actionType === ACTIONS.DELETE
//                         ? "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                         : "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"}
//                 />
//               </svg>
//             </div>
//             <h2 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
//               Confirm {actionType === ACTIONS.DELETE ? 'Deletion' : actionType === ACTIONS.ENABLE ? 'Activation' : 'Deactivation'}
//             </h2>
//             <p className="text-gray-700 text-center mb-8 text-lg">
//               You are about to <span className="font-bold text-red-700">
//                 {actionType === ACTIONS.DELETE ? 'permanently delete' : selectedUser.isActive ? 'deactivate' : 'activate'}
//               </span> the user <span className="font-extrabold text-red-900">{selectedUser.name}</span>.
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => { setSelectedUser(null); setActionType(''); }}
//                 className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmAction}
//                 className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-200 ${
//                   actionType === ACTIONS.DELETE
//                     ? 'bg-red-600 hover:bg-red-700'
//                     : selectedUser.isActive
//                       ? 'bg-yellow-600 hover:bg-yellow-700'
//                       : 'bg-green-600 hover:bg-green-700'
//                 }`}
//               >
//                 {actionType === ACTIONS.DELETE ? 'Confirm Delete' : `Yes, ${selectedUser.isActive ? 'Deactivate' : 'Activate'}`}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <ToastContainer 
//         position="bottom-right" 
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </div>
//   );
// };

// export default AllUser;


import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../common/Loader';

// Constants for better maintainability
const ROLES = {
  ALL: '',
  ADMIN: 'ADMIN',
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  EDITOR: 'EDITOR'
};

const STATUSES = {
  ALL: '',
  ACTIVE: 'active',
  PENDING: 'pending',
  DISABLED: 'disabled'
};

const ITEMS_PER_PAGE = [10, 20, 50];

const ACTIONS = {
  DELETE: 'delete',
  ENABLE: 'enable',
  DISABLE: 'disable'
};

const AllUser = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState('');
  
  // Filter states
  const [filters, setFilters] = useState({
    role: ROLES.ALL,
    status: STATUSES.ALL,
    search: '',
    page: 1,
    limit: 10
  });

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Environment variables
  const token = localStorage.getItem('token');
  const url = import.meta.env.VITE_BASE_URL;

  // Parse URL parameters and sync with state
  const parseUrlParams = useCallback(() => {
    const queryParams = new URLSearchParams(location.search);
    
    const urlFilters = {
      role: queryParams.get('role') || ROLES.ALL,
      status: queryParams.get('status') || queryParams.get('filter') || STATUSES.ALL,
      search: queryParams.get('search') || '',
      page: Math.max(1, parseInt(queryParams.get('page')) || 1),
      limit: parseInt(queryParams.get('limit')) || 10
    };

    // Validate status values
    if (urlFilters.status && !Object.values(STATUSES).includes(urlFilters.status)) {
      console.warn('Invalid status value from URL:', urlFilters.status);
      urlFilters.status = STATUSES.ALL;
    }

    // Validate role values
    if (urlFilters.role && !Object.values(ROLES).includes(urlFilters.role)) {
      console.warn('Invalid role value from URL:', urlFilters.role);
      urlFilters.role = ROLES.ALL;
    }

    // Validate limit values
    if (!ITEMS_PER_PAGE.includes(urlFilters.limit)) {
      urlFilters.limit = 10;
    }

    console.log('Parsed URL filters:', urlFilters);
    return urlFilters;
  }, [location.search]);

  // Update URL when filters change
  const updateUrl = useCallback((newFilters) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '' && !(key === 'page' && value === 1)) {
        queryParams.set(key, value.toString());
      }
    });

    const newUrl = queryParams.toString() 
      ? `${location.pathname}?${queryParams.toString()}`
      : location.pathname;
    
    navigate(newUrl, { replace: true });
  }, [location.pathname, navigate]);

  // Fetch users with error handling and loading states
  const fetchUsers = useCallback(async (currentFilters = filters) => {
    if (!token) {
      toast.error('Authentication token not found');
      return;
    }

    setLoading(true);
    
    try {
      // Build query string
      const queryParams = new URLSearchParams({
        page: currentFilters.page.toString(),
        limit: currentFilters.limit.toString()
      });

      if (currentFilters.role) queryParams.append('role', currentFilters.role);
      if (currentFilters.status) queryParams.append('status', currentFilters.status);
      if (currentFilters.search.trim()) queryParams.append('search', currentFilters.search.trim());

      const apiUrl = `${url}admin/users?${queryParams.toString()}`;
      console.log('API Call URL:', apiUrl);
      console.log('Filters being sent:', currentFilters);

      const response = await axios.get(apiUrl, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('API Response:', response.data);
      
      // Handle API response structure
      const responseData = response.data.data || response.data;
      const fetchedUsers = responseData.users || [];
      
      // Handle pagination
      const paginationData = responseData.pagination || {};
      const total = paginationData.totalUsers || paginationData.total || fetchedUsers.length;
      const totalPages = paginationData.totalPages || Math.ceil(total / currentFilters.limit);
      
      console.log('Fetched users count:', fetchedUsers.length);
      console.log('Total from API:', total);
      console.log('Pagination data:', paginationData);
      console.log('Sample user roles:', fetchedUsers.slice(0, 3).map(u => u.role));
      
      setUsers(fetchedUsers);
      setPagination({
        total: total,
        totalPages: totalPages,
        hasNext: paginationData.hasNext || currentFilters.page < totalPages,
        hasPrev: paginationData.hasPrev || currentFilters.page > 1
      });

    } catch (error) {
      console.error('Fetch users error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to access this resource.');
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch users. Please try again.');
      }
      
      setUsers([]);
      setPagination({ total: 0, totalPages: 0, hasNext: false, hasPrev: false });
    } finally {
      setLoading(false);
    }
  }, [token, url, filters]);

  // Filter users client-side for search functionality only
  const filteredUsers = useMemo(() => {
    let result = users;
    
    // Apply search filter only (backend handles role and status filtering)
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      result = result.filter(user => 
        user.name?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm)
      );
    }
    
    return result;
  }, [users, filters.search]);

  // Update filters with URL sync
  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    
    // Reset to page 1 when changing filters (except pagination)
    if (!newFilters.hasOwnProperty('page')) {
      updatedFilters.page = 1;
    }
    
    setFilters(updatedFilters);
    updateUrl(updatedFilters);
  }, [filters, updateUrl]);

  // Handle user actions
  const handleAction = useCallback((user, action) => {
    if (!user || !action) return;
    setSelectedUser(user);
    setActionType(action);
  }, []);

  const confirmAction = useCallback(async () => {
    if (!selectedUser || !actionType || !token) return;

    try {
      let endpoint = '';
      let method = 'post';
      let successMessage = '';

      switch (actionType) {
        case ACTIONS.DELETE:
          endpoint = `${url}admin/users/${selectedUser.id}`;
          method = 'delete';
          successMessage = `${selectedUser.name} deleted successfully!`;
          break;
        case ACTIONS.ENABLE:
        case ACTIONS.DISABLE:
          endpoint = `${url}admin/users/${selectedUser.id}/${actionType}`;
          successMessage = `${selectedUser.name} ${actionType === ACTIONS.ENABLE ? 'enabled' : 'disabled'} successfully!`;
          break;
        default:
          throw new Error('Invalid action type');
      }

      const axiosConfig = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      };

      if (method === 'delete') {
        await axios.delete(endpoint, axiosConfig);
      } else {
        await axios.post(endpoint, {}, axiosConfig);
      }

      toast.success(successMessage);

      // Optimistic UI update
      if (actionType === ACTIONS.DELETE) {
        setUsers(prev => prev.filter(u => u._id !== selectedUser._id));
      } else {
        const newStatus = actionType === ACTIONS.ENABLE;
        setUsers(prev =>
          prev.map(u => 
            u._id === selectedUser._id 
              ? { ...u, isActive: newStatus } 
              : u
          )
        );
      }

      // Refresh data to ensure consistency
      setTimeout(() => fetchUsers(), 500);

    } catch (error) {
      console.error('Action error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else if (error.response?.status === 404) {
        toast.error('User not found.');
      } else {
        toast.error(error.response?.data?.message || 'Action failed. Please try again.');
      }
    } finally {
      setSelectedUser(null);
      setActionType('');
    }
  }, [selectedUser, actionType, token, url, fetchUsers]);

  // Initialize filters from URL on component mount
  useEffect(() => {
    const urlFilters = parseUrlParams();
    console.log('Parsed URL filters:', urlFilters);
    setFilters(urlFilters);
  }, [parseUrlParams]);

  // Fetch users when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('Fetching with filters:', filters);
      fetchUsers(filters);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [filters.role, filters.status, filters.page, filters.limit]);

  // Separate effect to handle initial load from URL
  useEffect(() => {
    const urlFilters = parseUrlParams();
    if (urlFilters.role || urlFilters.status || urlFilters.search) {
      console.log('Initial fetch with URL params:', urlFilters);
      fetchUsers(urlFilters);
    } else {
      fetchUsers();
    }
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((newPage) => {
    updateFilters({ page: newPage });
  }, [updateFilters]);

  const handlePreviousPage = useCallback(() => {
    if (pagination.hasPrev) {
      handlePageChange(filters.page - 1);
    }
  }, [pagination.hasPrev, filters.page, handlePageChange]);

  const handleNextPage = useCallback(() => {
    if (pagination.hasNext) {
      handlePageChange(filters.page + 1);
    }
  }, [pagination.hasNext, filters.page, handlePageChange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-indigo-100 p-8">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-10 text-center drop-shadow-md">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-700">
          User Dashboard
        </span>
      </h1>


      {/* Filters & Search */}
      <div className="max-w-6xl mx-auto mb-8 px-4">
        <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
          
          {/* Role Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Filter by Role</label>
            <select
              value={filters.role}
              onChange={e => updateFilters({ role: e.target.value })}
              className="px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={ROLES.ALL}>All Roles</option>
              <option value={ROLES.ADMIN}>Admin</option>
              <option value={ROLES.USER}>User</option>
              <option value={ROLES.MODERATOR}>Moderator</option>
              <option value={ROLES.EDITOR}>Editor</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={filters.status}
              onChange={e => updateFilters({ status: e.target.value })}
              className="px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={STATUSES.ALL}>All Status</option>
              <option value={STATUSES.ACTIVE}>Active</option>
              <option value={STATUSES.PENDING}>Pending</option>
              <option value={STATUSES.DISABLED}>Disabled</option>
            </select>
          </div>

          {/* Search Field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search name/email"
              value={filters.search}
              onChange={e => updateFilters({ search: e.target.value })}
              className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-60"
            />
          </div>

          {/* Limit Selector */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Items per Page</label>
            <select
              value={filters.limit}
              onChange={e => updateFilters({ limit: parseInt(e.target.value) })}
              className="px-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ITEMS_PER_PAGE.map(size => (
                <option key={size} value={size}>{size} per page</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden max-w-6xl mx-auto ring-1 ring-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <tr key={user._id} className="hover:bg-red-50 transition duration-150 ease-in-out">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                          <label className="flex items-center justify-center cursor-pointer">
                            <div className="relative">
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={user.isActive}
                                onChange={() => handleAction(user, user.isActive ? ACTIONS.DISABLE : ACTIONS.ENABLE)}
                              />
                              <div className={`block w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${
                                user.isActive ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 ease-in-out ${
                                user.isActive ? 'translate-x-6' : 'translate-x-0'
                              }`}></div>
                            </div>
                            <span className={`ml-3 text-sm font-medium ${
                              user.isActive ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </label>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleAction(user, ACTIONS.DELETE)}
                              className="px-5 py-2 rounded-lg text-white font-medium bg-red-600 hover:bg-red-700 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-6 text-center text-gray-500 text-lg">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Enhanced Pagination */}
          <div className="flex justify-between items-center mt-6 max-w-6xl mx-auto px-4">
            <div className="text-sm text-gray-700">
              Showing {Math.min((filters.page - 1) * filters.limit + 1, pagination.total)} to{' '}
              {Math.min(filters.page * filters.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={!pagination.hasPrev}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                Page {filters.page} of {pagination.totalPages || 1}
              </span>
              <button
                onClick={handleNextPage}
                disabled={!pagination.hasNext}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Enhanced Confirmation Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-900/80 bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-3xl w-full max-w-md border-t-4 border-red-500">
            <div className="text-center mb-6">
              <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d={actionType === ACTIONS.DELETE
                        ? "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        : "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"}
                />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
              Confirm {actionType === ACTIONS.DELETE ? 'Deletion' : actionType === ACTIONS.ENABLE ? 'Activation' : 'Deactivation'}
            </h2>
            <p className="text-gray-700 text-center mb-8 text-lg">
              You are about to <span className="font-bold text-red-700">
                {actionType === ACTIONS.DELETE ? 'permanently delete' : selectedUser.isActive ? 'deactivate' : 'activate'}
              </span> the user <span className="font-extrabold text-red-900">{selectedUser.name}</span>.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => { setSelectedUser(null); setActionType(''); }}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-200 ${
                  actionType === ACTIONS.DELETE
                    ? 'bg-red-600 hover:bg-red-700'
                    : selectedUser.isActive
                      ? 'bg-yellow-600 hover:bg-yellow-700'
                      : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {actionType === ACTIONS.DELETE ? 'Confirm Delete' : `Yes, ${selectedUser.isActive ? 'Deactivate' : 'Activate'}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer 
        position="bottom-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AllUser;