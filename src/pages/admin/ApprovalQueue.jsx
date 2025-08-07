
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css";
import Loader from "../common/Loader";

const ApprovalQueue = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState("approve");
  const [rejectReason, setRejectReason] = useState("");

  const token = localStorage.getItem('token');
  const url = import.meta.env.VITE_BASE_URL

  const fetchPendingUsers = async () => {
    setLoading(true);
    // const loadingToastId = toast.loading("Fetching pending users...");
    try {
      const res = await axios.get(
        `${url}admin/users/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      setPendingUsers(res.data.data.users);
      toast.update(loadingToastId, { render: "Pending users loaded successfully!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      console.error("Error fetching pending users:", error);
      toast.update(loadingToastId, { render: "Failed to load pending users.", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId) => {
    const loadingToastId = toast.loading("Approving user...");
    try {
      await axios.post(
        `${url}admin/users/${userId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
      setSelectedUser(null);
      toast.update(loadingToastId, { render: "User approved successfully!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      console.error("Error approving user:", error);
      toast.update(loadingToastId, { render: "Failed to approve user.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const rejectUser = async (userId) => {
    if (!rejectReason.trim()) {
      toast.warn("Please enter a reason for rejection.");
      return;
    }
    const loadingToastId = toast.loading("Rejecting user...");
    try {
      await axios.post(
        `${url}admin/users/${userId}/reject`,
        { reason: rejectReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
      setSelectedUser(null);
      setRejectReason("");
      toast.update(loadingToastId, { render: "User rejected successfully!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.update(loadingToastId, { render: "Failed to reject user.", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-indigo-100 p-8">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-10 text-center drop-shadow-md">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-700">Approval Queue</span>
      </h1>

      {loading ? (
        <><Loader/></>
      ) : pendingUsers.length === 0 ? (
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-2xl mx-auto text-center border-t-4 border-red-500">
          <svg className="mx-auto h-20 w-20 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl text-gray-600 font-semibold">No pending users found.</p>
          <p className="text-gray-500 mt-2">All new user registrations have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {pendingUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 ease-in-out border-b-4 border-red-400"
            >
              <div className="mb-4">
                <p className="font-extrabold text-2xl text-gray-800 mb-1">{user.name}</p>
                <p className="text-gray-600 text-sm"><span className="font-medium">Email:</span> {user.email}</p>
                <p className="text-gray-600 text-sm"><span className="font-medium">Role:</span> <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">{user.role}</span></p>
                <p className="text-gray-600 text-sm"><span className="font-medium">Phone:</span> {user.phone || 'N/A'}</p>
                <p className="text-gray-600 text-sm"><span className="font-medium">Status:</span> <span className="text-yellow-600 font-bold">{user.status}</span></p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setActionType("approve");
                  }}
                  className="flex items-center px-4 py-2 rounded-md text-white font-medium bg-green-600 hover:bg-green-700 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setActionType("reject");
                  }}
                  className="flex items-center px-4 py-2 rounded-md text-white font-medium bg-red-600 hover:bg-red-700 transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal - Redesigned and Enhanced */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-900/80 bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-3xl w-full max-w-md transform scale-100 opacity-100 transition-all duration-300 ease-out border-t-4 border-red-500">
            <div className="text-center mb-6">
              {actionType === 'approve' ? (
                <svg className="mx-auto h-20 w-20 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="mx-auto h-20 w-20 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">
              Confirm {actionType === "approve" ? "Approval" : "Rejection"}
            </h2>
            <p className="text-gray-700 text-center mb-6 text-lg leading-relaxed">
              You are about to <span className={`font-bold text-xl ${actionType === 'approve' ? 'text-green-700' : 'text-red-700'}`}>{actionType === "approve" ? "approve" : "reject"}</span> the user{' '}
              <span className="font-extrabold text-red-900 text-xl">{selectedUser.name}</span>.
              <br/>
              {actionType === "reject" ? "This action will deny the user access. Please provide a clear reason." : "This action will grant the user access."}
            </p>

            {actionType === "reject" && (
              <div className="mb-6">
                <label htmlFor="rejectReason" className="block text-gray-700 text-sm font-semibold mb-2">Reason for Rejection:</label>
                <textarea
                  id="rejectReason"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 resize-y min-h-[80px]"
                  placeholder="e.g., Incomplete profile, Duplicate registration, Does not meet criteria."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows="3"
                ></textarea>
                {!rejectReason.trim() && (
                  <p className="text-red-500 text-xs mt-1">Reason is required for rejection.</p>
                )}
              </div>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setRejectReason("");
                }}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100
                  transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (actionType === "approve") {
                    approveUser(selectedUser._id);
                  } else {
                    rejectUser(selectedUser._id);
                  }
                }}
                className={`px-6 py-3 rounded-lg text-white font-semibold transition duration-200 ease-in-out
                  transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${actionType === "approve" ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" : "bg-red-600 hover:bg-red-700 focus:ring-red-500"}`}
              >
                {actionType === "approve" ? "Confirm Approval" : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default ApprovalQueue;