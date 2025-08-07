import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown, MapPin, Menu, X, Globe, Search, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/cnews.png';
import axios from 'axios';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const dropdownRef = useRef(null);
  const categoryRefs = useRef([]);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}categories?page=1&limit=20&sortBy=displayOrder&sortOrder=asc`,
          { headers: { 'accept': 'application/json' } }
        );
        if (response.data.success) {
          setCategories(response.data.data.docs);
        }
      } catch (err) {
        if (err.response && err.response.status === 429) {
          setErrorMessage('429');
        } else {
          console.error('Error fetching news:', err);
        }
      }
    };
    fetchCategories();
  }, []);

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchDistrict = async () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=10&addressdetails=1`
          );
          const data = await res.json();
          const detected =
            data.address?.city || data.address?.county || data.address?.state_district;
          if (detected) setDistrictName(detected);
        } catch {/* ignore */ }
      });
    };
    fetchDistrict();
  }, []);

  useEffect(() => {
    localStorage.setItem('districtName', districtName);
  }, [districtName]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search-news/${trimmed}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <motion.header
      ref={dropdownRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-md'} bg-white`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Top Info Bar */}
      <div className="bg-slate-100 border-b border-slate-200 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 h-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="font-medium text-slate-800">
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>Coverage: {districtName || 'India'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {token ? (
              <>
                <Link to="/user-dashboard">
                  <motion.button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700" whileHover={{ scale: 1.05 }}>
                    Dashboard
                  </motion.button>
                </Link>
                <motion.button
                  onClick={handleLogout}
                  className="text-red-600 px-3 py-1 border rounded text-xs hover:text-red-700" whileHover={{ scale: 1.05 }}>
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/subscribe">
                  <motion.button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700" whileHover={{ scale: 1.05 }}>
                    Subscribe
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button className="text-red-600 border px-3 py-1 rounded text-xs hover:text-red-700" whileHover={{ scale: 1.05 }}>
                    Login
                  </motion.button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center relative">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-1 select-none">
          <img src={logo} className="w-8 h-8" alt="Logo" />
          <span className="font-[Times_New_Roman] text-red-600 text-4xl font-bold">C</span>
          <span className="text-slate-800 font-bold text-xl">NEWS</span>
          <span className="text-slate-700 text-xl font-bold sm:inline">भारत</span>
        </Link>

        {/* Categories - Scrollable */}
        <div className="relative max-w-[600px] hidden lg:flex items-center">
          <div
            className="flex gap-2 overflow-x-auto scrollbar-hide pr-12"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {categories.map((cat, index) => (
              <button
                key={cat.name}
                ref={(el) => (categoryRefs.current[index] = el)}
                onClick={() => {
                  categoryRefs.current[index]?.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest',
                  });
                  navigate(`/news-for/${cat.name.toLowerCase()}`);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg whitespace-nowrap transition"
              >
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="absolute -right-5 top-0 h-full w-12 flex items-center justify-end pointer-events-none bg-gradient-to-l from-white to-transparent">
            <div className="mr-2 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Search & Mobile Menu */}
        <div className="flex items-center gap-2">
          <AnimatePresence>
            {isSearchOpen ? (
              <motion.form
                onSubmit={handleSearchSubmit}
                className="flex items-center"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '14rem', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="border px-3 py-1 rounded"
                />
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                >
                  <Search className="w-4 h-4" />
                </button>
              </motion.form>
            ) : (
              <motion.button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <Search className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="lg:hidden bg-white shadow-inner border-t px-4 py-4 space-y-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/news-for/${cat.name.toLowerCase()}`}
                className="block text-left w-full py-2 text-sm text-slate-700 hover:bg-slate-100 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
