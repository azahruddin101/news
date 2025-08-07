// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Loader from '../common/Loader';

// const SubmissionQueue = () => {
//   const [pendingNews, setPendingNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [selectedNews, setSelectedNews] = useState(null);
//   const [actionType, setActionType] = useState('');
//   const [actionLoading, setActionLoading] = useState(false);

//   const token = localStorage.getItem('token');
//   const url = import.meta.env.VITE_BASE_URL;

//   const fetchPendingNews = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${url}news/pending?page=1&limit=10`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json'
//         }
//       });
//       setPendingNews(response.data.data.news || []);
//     } catch (error) {
//       console.error('Error fetching news:', error);
//       toast.error("Failed to load pending news.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleActionClick = (news, action) => {
//     setSelectedNews(news);
//     setActionType(action);
//     setShowConfirmModal(true);
//   };

//   const handleConfirmAction = async () => {
//     if (!selectedNews || !actionType) return;

//     setActionLoading(true);
//     const actionToastId = toast.loading(`Processing news ${actionType}...`);
//     try {
//       await axios.post(`${url}news/${selectedNews.id}/${actionType}`, {}, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: 'application/json'
//         }
//       });

//       setPendingNews(prev => prev.filter(news => news.id !== selectedNews.id));
//       setShowConfirmModal(false);
//       setSelectedNews(null);
//       setActionType('');
//       toast.update(actionToastId, {
//         render: `News ${actionType === 'approve' ? 'approved' : 'rejected'} successfully!`,
//         type: 'success',
//         isLoading: false,
//         autoClose: 3000
//       });
//     } catch (error) {
//       console.error(`Failed to ${actionType} news:`, error);
//       toast.update(actionToastId, {
//         render: `Failed to ${actionType} news.`,
//         type: 'error',
//         isLoading: false,
//         autoClose: 3000
//       });
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleCancelAction = () => {
//     setShowConfirmModal(false);
//     setSelectedNews(null);
//     setActionType('');
//   };

//   useEffect(() => {
//     fetchPendingNews();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 to-indigo-100 p-8">
//       <h1 className="text-5xl font-extrabold text-gray-900 mb-10 text-center drop-shadow-md">
//         <span className="bg-transparent text-red-600">News Submission Queue</span>
//       </h1>

//       {loading ? (
//         <Loader />
//       ) : pendingNews.length === 0 ? (
//         <div className="bg-white shadow-lg rounded-xl p-8 max-w-2xl mx-auto text-center border-t-4 border-red-500">
//           <svg className="mx-auto h-20 w-20 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <p className="text-xl text-gray-600 font-semibold">No Pending News Submissions</p>
//           <p className="text-gray-500 mt-2">All submitted articles have been reviewed.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
//           {pendingNews.map(news => (
//             <div
//               key={news.id}
//               className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 ease-in-out border-b-4 border-red-400"
//             >
//               <div className="mb-4">
//                 <p className="font-extrabold text-2xl text-gray-800 mb-1 line-clamp-2">{news.title}</p>
//                 <p className="text-gray-600 text-sm">
//                   <span className="font-medium">Category:</span>
//                   <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
//                     {news.category?.name || 'N/A'}
//                   </span>
//                 </p>
//                 <p className="text-gray-600 text-sm">
//                   <span className="font-medium">Reporter:</span> {news.reporter?.name || 'Unknown'}
//                 </p>
//                 <p className="text-gray-600 text-sm">
//                   <span className="font-medium">Status:</span> <span className="text-yellow-600 font-bold">{news.status}</span>
//                 </p>
//               </div>

//               {news.excerpt && (
//                 <p className="text-gray-700 text-base leading-relaxed mb-4 line-clamp-3">{news.excerpt}</p>
//               )}

//               <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-6">
//                 <span className="flex items-center gap-1">
//                   <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h.01M10 16h.01M12 16h.01M14 16h.01M16 16h.01M9 21H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2h-5m-7 0L9 17m-3 0l3 4"></path>
//                   </svg>
//                   {new Date(news.createdAt).toLocaleDateString()}
//                 </span>
//                 {news.views !== undefined && (
//                   <span className="flex items-center gap-1">
//                     <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
//                     </svg>
//                     {news.views} Views
//                   </span>
//                 )}
//               </div>

//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => handleActionClick(news, 'approve')}
//                   className="flex items-center px-4 py-2 rounded-md text-white font-medium bg-green-600 hover:bg-green-700 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//                 >
//                   <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                   </svg>
//                   Approve
//                 </button>
//                 <button
//                   onClick={() => handleActionClick(news, 'reject')}
//                   className="flex items-center px-4 py-2 rounded-md text-white font-medium bg-red-600 hover:bg-red-700 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//                 >
//                   <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                   Reject
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Confirmation Modal */}
//       {showConfirmModal && selectedNews && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
//           <div className="bg-white p-8 rounded-2xl shadow-3xl w-full max-w-md transform scale-100 opacity-100 transition-all duration-300 ease-out border-t-4 border-red-500">
//             <div className="text-center mb-6">
//               {actionType === 'approve' ? (
//                 <svg className="mx-auto h-20 w-20 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               ) : (
//                 <svg className="mx-auto h-20 w-20 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               )}
//             </div>
//             <h2 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
//               Confirm {actionType === "approve" ? "Approval" : "Rejection"}
//             </h2>
//             <p className="text-gray-700 text-center mb-6 text-lg leading-relaxed">
//               You are about to <span className={`font-bold text-xl ${actionType === 'approve' ? 'text-green-700' : 'text-red-700'}`}>{actionType === "approve" ? "approve" : "reject"}</span> the news article:
//             </p>
//             <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 mb-6">
//               <h4 className="font-semibold text-lg text-red-900 mb-1 line-clamp-2">"{selectedNews.title}"</h4>
//               <p className="text-red-700 text-sm">by {selectedNews.reporter?.name || 'Unknown Reporter'}</p>
//             </div>

//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={handleCancelAction}
//                 className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={actionLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmAction}
//                 className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
//                   ${actionType === "approve" ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" : "bg-red-600 hover:bg-red-700 focus:ring-red-500"}`}
//                 disabled={actionLoading}
//               >
//                 {actionLoading ? (
//                   <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                 ) : (
//                   `Confirm ${actionType === 'approve' ? 'Approval' : 'Rejection'}`
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
//     </div>
//   );
// };

// export default SubmissionQueue;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../common/Loader';



const SubmissionQueue = () => {
  const [pendingNews, setPendingNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [actionType, setActionType] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const token = localStorage.getItem('token');
  const url = import.meta.env.VITE_BASE_URL;
  const baseImg = import.meta.env.VITE_IMG_URL;

  const fetchPendingNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}news/pending?page=1&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      setPendingNews(response.data.data.news || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Failed to load pending news.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (news) => {
    setSelectedNews(news);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedNews(null);
    setActionType('');
  };

  const handleConfirmAction = async (action) => {
    if (!selectedNews) return;

    setActionLoading(true);
    const toastId = toast.loading(`Processing ${action}...`);
    try {
      await axios.post(
        `${url}news/${selectedNews.id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      setPendingNews((prev) =>
        prev.filter((news) => news.id !== selectedNews.id)
      );
      toast.update(toastId, {
        render: `News ${action === 'approve' ? 'approved' : 'rejected'} successfully!`,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      handleCloseDetailModal();
    } catch (error) {
      console.error(`Failed to ${action} news:`, error);
      toast.update(toastId, {
        render: `Failed to ${action} news.`,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingNews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-indigo-100 p-8">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-10 text-center drop-shadow-md">
        <span className="bg-transparent text-red-600">News Submission Queue</span>
      </h1>

      {loading ? (
        <>
                <div className="flex items-center justify-center h-screen bg-gray-100">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
                    <div className="w-full h-full border-4 border-t-transparent border-red-600 rounded-full animate-spin"></div>
                  </div>
                </div>
              </>
      ) : pendingNews.length === 0 ? (
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-2xl mx-auto text-center border-t-4 border-red-500">
          <svg className="mx-auto h-20 w-20 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl text-gray-600 font-semibold">No Pending News Submissions</p>
          <p className="text-gray-500 mt-2">All submitted articles have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {pendingNews.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 ease-in-out border-b-4 border-red-400"
            >
              <div className="mb-4">
                <p className="font-extrabold text-2xl text-gray-800 mb-1 line-clamp-2">{news.title}</p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Category:</span>{' '}
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {news.category?.name || 'N/A'}
                  </span>
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Reporter:</span> {news.reporter?.name || 'Unknown'}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Status:</span>{' '}
                  <span className="text-yellow-600 font-bold">{news.status}</span>
                </p>
              </div>
              {news.excerpt && (
                <p className="text-gray-700 text-base leading-relaxed mb-4 line-clamp-3">{news.excerpt}</p>
              )}
              <div className="flex justify-end">
                <button
                  onClick={() => handleViewDetail(news)}
                  className="px-4 py-2 rounded-md text-white font-medium bg-red-600 hover:bg-red-700 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  View Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedNews && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-white w-[90%] max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">

            {/* Image Section - Vertically centered */}
            <div className="md:w-1/2 flex items-center justify-center bg-gray-100 p-4">
              <img
                src={`${baseImg}${selectedNews.media[0]}`}
                alt="News"
                className="max-h-[400px] w-full object-contain"
              />
            </div>

            {/* Right Side Content with buttons at bottom-right */}
            <div className="md:w-1/2 flex flex-col justify-between p-6">
              {/* Top Content */}
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedNews.title}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  <span className="font-medium">Reporter:</span> {selectedNews.reporter?.name || 'Unknown'} |{' '}
                  <span className="font-medium">Category:</span> {selectedNews.category?.name || 'N/A'}
                </p>
                <div
                  className="text-gray-700 text-base leading-relaxed prose max-w-none overflow-y-auto max-h-[200px]"
                  dangerouslySetInnerHTML={{
                    __html: selectedNews.description || '<p>No description provided.</p>',
                  }}
                />
              </div>

              {/* Buttons Bottom Right */}
              <div className="flex justify-end gap-3 mt-auto">
                <button
                  onClick={() => handleConfirmAction('approve')}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none disabled:opacity-50"
                >
                  {actionLoading && actionType === 'approve' ? 'Approving...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleConfirmAction('reject')}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50"
                >
                  {actionLoading && actionType === 'reject' ? 'Rejecting...' : 'Reject'}
                </button>
                <button
                  onClick={handleCloseDetailModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default SubmissionQueue;
