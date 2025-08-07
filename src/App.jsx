

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import ProtectedRoute from "./route/ProtectedRoute.jsx";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EditorDashboard from "./pages/editor/EditorDashboard";
import ModeratorDashboard from "./pages/moderator/ModeratorDashboard";
import ReporterDashboard from "./pages/reporter/ReporterDashboard";
import SubmitNews from "./pages/reporter/SubmitNews";
import AiAssist from "./pages/reporter/AiAssist";
import LiveStreaming from "./pages/reporter/LiveStreaming";
import ReporterAnalytics from "./pages/reporter/ReporterAnalytics";
import FactCheckingRequest from "./pages/reporter/FactCheckingRequest";
import SubmissionQueue from "./pages/admin/SubmissionQueue";
import FactCheckVerification from "./pages/admin/FactCheckVerification";
import MonetizationPanel from "./pages/admin/MonetizationPanel";
import ApprovalQueue from "./pages/admin/ApprovalQueue.jsx";
import AllUser from "./pages/admin/AllUser.jsx";
import MyNews from "./pages/reporter/MyNews.jsx";
import Homepage from "./pages/user/Homepage.jsx";
import NewsDetail from "./pages/reporter/NewsDetail.jsx";
import EditNews from "./pages/editor/EditNews.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Subscribe from "./pages/common/Subscribe.jsx";
import AdsDashboard from "./pages/moderator/AdsDashboard.jsx";
import AISuggestions from "./pages/admin/AISuggestions.jsx";
import AddAdvertisementForm from "./pages/user/AddAdvertisementForm.jsx";
import MyAds from "./pages/user/MyAds.jsx";
import EditAdPage from "./pages/user/EditAdPage.jsx";
import AllNewsControl from "./pages/moderator/AllNewsControl.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import AdPerformance from "./pages/user/AdPerformance.jsx";
import AllNewsScroll from "./pages/user/AllNewsScroll.jsx";
import FactCheck from "./pages/user/FactCheck.jsx";
import Profile from "./pages/user/Profile.jsx";
import UserFactChecks from "./pages/user/UserFactChecks.jsx";
import SearchResult from "./pages/user/SearchResult.jsx";
import SearchResults from "./pages/user/SearchResult.jsx";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const storedUserType = localStorage.getItem("userType");
        setIsLoggedIn(!!token);
        setUserType(storedUserType);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLoginSuccess = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    setIsLoggedIn(false);
    setUserType(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const defaultDashboardPath = (() => {
    switch (userType) {
      case "ADMIN": return "/admin-dashboard";
      case "EDITOR": return "/editor-dashboard";
      case "MODERATOR": return "/moderator-dashboard";
      case "REPORTER": return "/reporter-dashboard";
      case "USER": return "/homepage";
      default: return "/";
    }
  })();

  return (
    <Router basename="/">
      <ToastContainer />
      <div className="flex min-h-screen w-full">
        {isLoggedIn && userType !== "USER" && (
          <Sidebar isLoggedIn={isLoggedIn} userType={userType} onLogout={handleLogout} />
        )}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <Routes>
            {/* ✅ Public Routes */}
            <Route path="/news/:slug" element={<NewsDetail />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/edit-ads/:id" element={<EditAdPage />} />
            <Route path="/create-ads" element={<AddAdvertisementForm />} />
            <Route path="/My-ads" element={<MyAds />} />
            {/* ✅ Protected Routes */}

            {!isLoggedIn ? (
              <>
                <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/news-for/:categoryId" element={<AllNewsScroll />} />
                <Route path="/search-news/:query" element={<SearchResult />} />
                {/* <Route path="/search" element={<SearchResults />} /> */}

                <Route path="*" element={<Navigate to="/homepage" replace />} />
              </>
            ) : (
              <>
                <Route path="/login" element={<Navigate to={defaultDashboardPath} replace />} />
                <Route path="/register" element={<Navigate to={defaultDashboardPath} replace />} />

                <Route element={<ProtectedRoute userType={userType} />}>
                  {/* Admin Routes */}
                  {userType === "ADMIN" && (
                    <>
                      <Route path="/admin-dashboard" element={<AdminDashboard />} />
                      <Route path="/submission-queue" element={<SubmissionQueue />} />
                      <Route path="/edit-news" element={<EditNews />} />
                      <Route path="/fact-check-verification" element={<FactCheckVerification />} />
                      <Route path="/ai-suggestions" element={<AISuggestions />} />
                      <Route path="/monetization" element={<MonetizationPanel />} />
                      <Route path="/approval-queue" element={<ApprovalQueue />} />
                      <Route path="/all-users" element={<AllUser />} />
                      <Route path="/ads-dashboard" element={<AdsDashboard />} />
                      <Route path="/manage-news" element={<AllNewsControl />} />

                    </>
                  )}

                  {/* Editor Routes */}
                  {userType === "EDITOR" && (
                    <>
                      <Route path="/edit-news" element={<EditNews />} />
                      <Route path="/editor-dashboard" element={<EditorDashboard />} />
                      <Route path="/manage-news" element={<AllNewsControl />} />

                    </>
                  )}

                  {/* Moderator Routes */}
                  {userType === "MODERATOR" && (
                    <>
                      <Route path="/moderator-dashboard" element={<ModeratorDashboard />} />
                      <Route path="/submission-queue" element={<SubmissionQueue />} />
                      <Route path="/ads-dashboard" element={<AdsDashboard />} />
                      <Route path="/manage-news" element={<AllNewsControl />} />
                    </>
                  )}

                  {/* Reporter Routes */}
                  {userType === "REPORTER" && (
                    <>
                      <Route path="/reporter-dashboard" element={<ReporterDashboard />} />
                      <Route path="/submit-news" element={<SubmitNews />} />
                      <Route path="/ai-assist" element={<AiAssist />} />
                      <Route path="/live-streaming" element={<LiveStreaming />} />
                      <Route path="/reporter-analytics" element={<ReporterAnalytics />} />
                      <Route path="/fact-checking-request" element={<FactCheckingRequest />} />
                      <Route path="/my-news" element={<MyNews />} />


                    </>
                  )}

                  {/* User-only Route (already public but protected redundancy) */}
                  {userType === "USER" && (
                    <>
                      <Route path="/search-news/:query" element={<SearchResult />} />
                      <Route path="/news-for/:categoryId" element={<AllNewsScroll />} />
                      <Route path="/homepage" element={<Homepage />} />
                      <Route path="/user-dashboard" element={<UserDashboard />}>
                        <Route index element={<MyAds />} />
                        <Route path="post-ads" element={<AddAdvertisementForm />} />
                        <Route path="my-ads" element={<MyAds />} />
                        <Route path="ad-performance/:id" element={<AdPerformance />} />
                        <Route path="userfact-check" element={<UserFactChecks />} />
                        <Route path="profile" element={<Profile />} />

                        <Route path="fact-check" element={<FactCheck />} />

                      </Route>
                    </>
                  )}
                </Route>
                {/* Catch-all route for authenticated users */}
                <Route path="*" element={<Navigate to={defaultDashboardPath} replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
