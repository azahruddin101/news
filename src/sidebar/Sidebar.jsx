
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import avatar from "../assets/avatar.png";
import logo from "../assets/cnews.png";
import {
  Home,
  FileText,
  Plus,
  Brain,
  Video,
  BarChart3,
  CheckSquare,
  Users,
  UserCheck,
  Shield,
  Settings,
  Edit3,
  Eye,
  LogOut,
  User,
  Mail,
  Phone,
  Calendar,
  Activity,
  MoveRight,
  MoveLeftIcon,
  MoveRightIcon,
  PanelRightOpen,
  PanelLeftOpen,
} from "lucide-react";

const Sidebar = ({ isLoggedIn, userType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropup, setShowProfileDropup] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const sidebarRef = useRef();
  const profileDropupRef = useRef();
  const profileButtonRef = useRef();
  const url = import.meta.env.VITE_BASE_URL;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation(); 

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch(`${url}auth/profile`, {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserProfile(data.data.user);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn, url]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropupRef.current &&
        !profileDropupRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setShowProfileDropup(false);
      }
    };

    if (showProfileDropup) {
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showProfileDropup]);

  // Sidebar click outside handler
  useEffect(() => {
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        if (isMobile) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMobile]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 824;
      setIsMobile(mobile);

      if (mobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle profile dropdown toggle
  const handleProfileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfileDropup((prev) => !prev);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    setShowProfileDropup(false);
    window.location.href = "/homepage"; // Redirect to homepage
  };

  const getNavigationItems = () => {
    const commonItems = [
      localStorage.getItem("userType") === "USER"
        ? { to: "/", label: "All News", icon: Home }
        : { to: "/", label: "Dashboard", icon: Home },
    ];

    const roleSpecificItems = {
      REPORTER: [
        { to: "/my-news", label: "My News", icon: FileText },
        { to: "/submit-news", label: "Submit News", icon: Plus },
        // { to: "/ai-assist", label: "AI Assist", icon: Brain },
        // { to: "/live-streaming", label: "Live Streaming", icon: Video },
        // { to: "/reporter-analytics", label: "Reporter Analytics", icon: BarChart3 },
        // { to: "/fact-checking-request", label: "Fact Checking", icon: CheckSquare },
      ],
      ADMIN: [
        { to: "/submission-queue", label: "News Submission Queue", icon: FileText },
        { to: "/approval-queue", label: "Users Approval Queue", icon: UserCheck },
        { to: "/all-users", label: "All Users", icon: Users },
        { to: "/manage-news", label: "All News", icon: Shield },
        { to: "/edit-news", label: "Edit News", icon: Edit3 },
        { to: "/ads-dashboard", label: "Ads Dashboard", icon: BarChart3 },
        // { to: "/fact-check-verification", label: "Fact Check Verification", icon: CheckSquare },
        // { to: "/ai-suggestions", label: "AI Suggestions", icon: Brain },
        // { to: "/monetization", label: "Monetization", icon: Settings },
      ],
      EDITOR: [
        // { to: "/editor-dashboard", label: "Editor Dashboard", icon: BarChart3 },
        { to: "/edit-news", label: "Edit News", icon: Edit3 },
        { to: "/manage-news", label: "All News", icon: Shield },
      ],
      MODERATOR: [
        { to: "/manage-news", label: "All News", icon: Shield },
        { to: "/submission-queue", label: "News Submission Queue", icon: Eye },
        { to: "/ads-dashboard", label: "Ads Dashboard", icon: BarChart3 },
      ],
      USER: [
        { to: "/user-dashboard/post-ads", label: "Post Ads", icon: Plus },
        { to: "/user-dashboard/my-ads", label: "My Ads", icon: FileText },
        // { to: "/user-dashboard/ad-performance", label: "Ad Performance", icon: BarChart3 },
        { to: "/user-dashboard/userfact-check", label: "My Fact Checks", icon: CheckSquare },
        // { to: "/user-dashboard/profile", label: "Profile", icon: User },
      ],
    };

    return [...commonItems, ...(isLoggedIn && roleSpecificItems[userType] ? roleSpecificItems[userType] : [])];
  };

  // 👇 NavLink with route-based highlighting
  const NavLink = ({ to, label, icon: Icon }) => {
    const isActive = location.pathname === to;

    return (
      <motion.div whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
        <Link
          to={to}
          className={`flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-200 group ${
            isActive
              ? "bg-white/20 backdrop-blur-sm border-1 border-white"
              : "hover:bg-white/10 hover:backdrop-blur-sm"
          }`}
          onClick={() => {
            if (isMobile) {
              setIsOpen(false);
            }
          }}
        >
          <Icon
            className={`w-5 h-5 transition-colors ${
              isActive ? "text-white" : "text-gray-300 group-hover:text-white"
            }`}
          />
          <span
            className={`font-medium transition-colors ${
              isActive ? "text-white" : "text-gray-200 group-hover:text-white"
            }`}
          >
            {label}
          </span>
        </Link>
      </motion.div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };



  const getThemeColors = () => {
  const baseBg = "from-red-700/90 via-red-600/90 to-red-800/90";
  const accent = "red-400";
  const headerBg = "bg-red-700/60";

  return {
    bg: baseBg,
    accent,
    headerBg,
  };
};


  const theme = getThemeColors();

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`fixed top-0 left-0 right-0 z-40 bg-gradient-to-r ${theme.bg} backdrop-blur-md border-b border-white/10 shadow-xl lg:hidden`}
        >
          <div className="flex items-center justify-between p-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
              aria-label="Toggle sidebar"
            >
              {isOpen ? (
            <PanelRightOpen className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
            </motion.button>
            <span>
              <img src={logo} alt="" className="w-12 h-12 filter-none mix-blend-normal" />
            </span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              C-News Media
            </h1>
            <div className="w-10"></div>
          </div>
        </motion.header>
      )}

      {/* Desktop Toggle Button */}
      {!isMobile && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed top-4 z-50 p-3 bg-gradient-to-r ${theme.bg} rounded-full text-white transition-all duration-300 hover:shadow-lg border border-white/20 backdrop-blur-sm ${
            isOpen ? "left-[270px]" : "left-4"
          }`}
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <PanelRightOpen className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
        </motion.button>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 mt-16"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        initial={false}
        animate={{
          x: isOpen ? 0 : -280,
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        className={`fixed z-50 h-screen bg-gradient-to-b ${theme.bg} text-white flex flex-col border-r border-white/10 backdrop-blur-xl shadow-2xl w-72 ${
          isMobile ? "top-16" : "top-0"
        }`}
        style={{
          height: isMobile ? "calc(100vh - 4rem)" : "100vh",
        }}
      >
        {/* Desktop Header inside Sidebar */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center justify-center p-6 ${theme.headerBg} backdrop-blur-sm border-b border-white/10`}
          >
            <span className="filter-none bg-white rounded-full p-[2px]">
              <img src={logo} alt="" className="w-12 h-12 filter-none mix-blend-normal" />
            </span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              CNews Bharat
            </h1>
          </motion.div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 text-sm font-medium overflow-y-auto pb-20 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1 }}
            className="space-y-1"
          >
            {getNavigationItems().map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink {...item} />
              </motion.div>
            ))}
          </motion.div>
        </nav>

        {/* Profile Section */}
        {isLoggedIn && (
          <div className="relative p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
            {/* Profile Dropup */}
            <AnimatePresence>
              {showProfileDropup && userProfile && (
                <motion.div
                  ref={profileDropupRef}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: [0.17, 0.67, 0.83, 0.67] }}
                  className="absolute bottom-full left-4 right-4 mb-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 z-60 overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={avatar}
                          alt="Profile"
                          className="w-16 h-16 rounded-full border-3 border-gradient-to-r from-red-400 to-red-400 flex-shrink-0 shadow-lg"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 ${
                            userProfile.status === "active" ? "bg-green-500" : "bg-gray-400"
                          } rounded-full border-2 border-white`}
                        ></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 text-lg truncate">{userProfile.name}</h3>
                        <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">
                          {userProfile.role}
                        </p>
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <div className="min-w-0 flex-1">
                          <span className="text-gray-500 font-medium">Email</span>
                          <p className="text-gray-900 truncate text-xs mt-1">{userProfile.email}</p>
                        </div>
                      </div>

                      {userProfile.phone && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <div>
                            <span className="text-gray-500 font-medium">Phone</span>
                            <p className="text-gray-900 mt-1">{userProfile.phone}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 rounded-xl text-center">
                          <span className="text-gray-500 font-medium text-xs">Status</span>
                          <div className="mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                userProfile.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {userProfile.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-xl text-center">
                          <span className="text-gray-500 font-medium text-xs">Email</span>
                          <div className="mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                userProfile.emailVerified
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {userProfile.emailVerified ? "Verified" : "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {userProfile.bio && (
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <span className="text-gray-500 font-medium text-xs">Bio</span>
                          <p className="text-gray-700 text-xs mt-1 leading-relaxed">{userProfile.bio}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-500 font-medium text-xs">Member Since:</span>
                          <p className="text-gray-700 text-xs">{formatDate(userProfile.createdAt)}</p>
                        </div>

                        {userProfile.lastLogin && (
                          <div className="flex items-center space-x-2">
                            <Activity className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-500 font-medium text-xs">Last Login:</span>
                            <p className="text-gray-700 text-xs">{formatDate(userProfile.lastLogin)}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-gray-200">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-sm transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Avatar Button */}
            <motion.button
              ref={profileButtonRef}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleProfileClick}
              className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 backdrop-blur-sm"
              type="button"
              aria-expanded={showProfileDropup}
              aria-haspopup="true"
            >
              <div className="relative">
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-white/30 flex-shrink-0 shadow-lg"
                />
                {userProfile?.status === "active" && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {userProfile ? userProfile.name : "Loading..."}
                </p>
                <p className="text-xs text-gray-300 truncate uppercase tracking-wide">
                  {userProfile ? userProfile.role : ""}
                </p>
              </div>
              <motion.svg
                animate={{ rotate: showProfileDropup ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-4 h-4 text-gray-300 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </motion.svg>
            </motion.button>
          </div>
        )}
      </motion.aside>

      {/* Content spacer for desktop */}
      {!isMobile && isOpen && <div className="w-72"></div>}
    </>
  );
};

export default Sidebar;
