 import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from '../../assets/cnews.png';
import { Mail ,Phone } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};
const buttonHover = {
  scale: 1.08,
  boxShadow: "0 2px 12px #b91c1c22",
  transition: { duration: 0.15, ease: "easeInOut" }
};
const listHover = { x: 6, color: "#b91c1c" };

const FALLBACK_CATEGORIES = [
  "Breaking News",
  "Politics",
  "World News",
  "Technology",
  "Business",
  "Sports",
  "Entertainment",
  "Health"
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  const baseUrl = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, "") + "/";
  const navigate = useNavigate();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 2800);
    }
  };

  const handleSocialClick = (platform) => {
    // placeholder
    console.log("social clicked:", platform);
  };
  const handleLinkClick = (section, item) => {
    console.log(`clicked ${section} -> ${item}`);
  };

  const handleClick = (name) => {
    navigate(`/news-for/${name.toLowerCase()}`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  const getCategories = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await axios.get(`${baseUrl}categories?page=1&limit=20`, {
        headers: { "Content-Type": "application/json" }
      });
      const json = res.data;
      if (!json?.success) {
        throw new Error(json?.message || "Failed to fetch categories");
      }
      setCategories(json.data?.docs || []);
    } catch (err) {
      console.error("getCategories error:", err);
      setError(err?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const categoryItems = !loading && categories.length > 0
    ? categories.map(c => c.name)
    : FALLBACK_CATEGORIES;

  return (
    <footer className="bg-white border-t-4 border-red-700 relative font-inter">
      {/* Newsletter Banner */}
      <motion.section
        className="w-full bg-red-700 py-10 px-4"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-extrabold text-white mb-1 tracking-tight">
              Stay Informed, Stay Ahead
            </h3>
            <p className="text-white/80 text-sm md:text-base font-medium truncate">
              Get breaking news, analysis, and exclusive content delivered to your inbox.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex-shrink-0 flex mt-4 lg:mt-0">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="rounded-l-lg px-4 py-3 w-56 md:w-72 border-none text-gray-900 outline-none"
              required
              aria-label="Email address"
            />
            <motion.button
              type="submit"
              whileHover={buttonHover}
              className="bg-white text-red-700 px-5 md:px-6 py-3 rounded-r-lg font-bold shadow-sm hover:bg-red-50 transition flex items-center gap-1"
              aria-label="Subscribe"
            >
              Subscribe
            </motion.button>
          </form>
          <AnimatePresence>
            {isSubscribed && (
              <motion.div
                className="absolute top-4 right-6 bg-green-50 px-4 py-2 rounded-full text-green-700 font-semibold shadow border border-green-200 text-sm"
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.34 }}
              >
                Subscribed successfully!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Main Footer */}
      <motion.div
        className="max-w-7xl mx-auto py-16 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-gray-900"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        {/* Brand */}
        <motion.div variants={fadeInUp} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <img src={logo} className="w-10 h-10" alt="Logo" />
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-[Times_New_Roman] text-red-700 text-3xl font-extrabold">C</span>
                <span className="text-gray-900 text-2xl font-bold">NEWS</span>
              </div>
              <span className="text-gray-500 text-sm font-medium">भारत</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your trusted source for timely, accurate news across categories. Stay connected with what's happening around you.
          </p>
          <div className="flex gap-2 mt-2">
            <div className="flex items-center text-sm text-gray-600 gap-2">
              <Mail className="w-4 h-4" />
              <span>support@cnews.in</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 gap-2">
  <Phone className="w-4 h-4" />
  <span className="whitespace-nowrap">+91 98765 43210</span>
</div>
          </div>
        </motion.div>

        {/* News Categories (accordion on small) */}
        <motion.div variants={fadeInUp} className="space-y-2">
          <div
            className="flex justify-between items-center cursor-pointer lg:cursor-default"
            onClick={() => setOpenSection(openSection === "categories" ? null : "categories")}
          >
            <h4 className="text-lg font-bold mb-2 text-red-700 tracking-wide">
              News Categories
            </h4>
            <div className="lg:hidden">
              {openSection === "categories" ? (
                <ChevronUp className="w-5 h-5 text-red-700" />
              ) : (
                <ChevronDown className="w-5 h-5 text-red-700" />
              )}
            </div>
          </div>
          <div
            className={`overflow-hidden transition-[max-height] duration-300 ${
              openSection === "categories" || window.innerWidth >= 1024
                ? "max-h-96"
                : "max-h-0"
            }`}
          >
            <ul className="space-y-2">
              {loading && (
                <li className="text-gray-600 text-sm">Loading categories...</li>
              )}
              {error && !loading && (
                <li className="text-sm text-yellow-800">
                  Failed to load categories. Showing defaults.
                </li>
              )}
              {categoryItems.map((name) => (
                <motion.li
                  key={name}
                  whileHover={listHover}
                  transition={{ duration: 0.2 }}
                  className="rounded group"
                >
                  <button
                    onClick={() => handleClick(name)}
                    className="text-gray-700 hover:text-red-700 text-base flex items-center gap-2 transition w-full"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:text-red-700" /> {name}
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={fadeInUp} className="space-y-2">
          <div
            className="flex justify-between items-center cursor-pointer lg:cursor-default"
            onClick={() => setOpenSection(openSection === "quick" ? null : "quick")}
          >
            <h4 className="text-lg font-bold mb-2 text-red-700 tracking-wide">
              Quick Links
            </h4>
            <div className="lg:hidden">
              {openSection === "quick" ? (
                <ChevronUp className="w-5 h-5 text-red-700" />
              ) : (
                <ChevronDown className="w-5 h-5 text-red-700" />
              )}
            </div>
          </div>
          <div
            className={`overflow-hidden transition-[max-height] duration-300 ${
              openSection === "quick" || window.innerWidth >= 1024
                ? "max-h-72"
                : "max-h-0"
            }`}
          >
            <ul className="space-y-2">
              {[
                "About Us",
                "Our Team",
                "Editorial Policy",
                "Careers",
                "Contact Us",
                "Advertise",
                "Archive"
              ].map((item) => (
                <motion.li
                  key={item}
                  whileHover={listHover}
                  transition={{ duration: 0.2 }}
                  className="rounded"
                >
                  <button
                    onClick={() => handleLinkClick("Quick Links", item)}
                    className="text-gray-700 hover:text-red-700 text-base flex items-center gap-2 transition w-full"
                  >
                    <ArrowRight className="w-4 h-4" /> {item}
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Social */}
        <motion.div variants={fadeInUp} className="space-y-2">
          <div
            className="flex justify-between items-center cursor-pointer lg:cursor-default"
            onClick={() => setOpenSection(openSection === "social" ? null : "social")}
          >
            <h4 className="text-lg font-bold mb-2 text-red-700 tracking-wide">
              Follow Us
            </h4>
            <div className="lg:hidden">
              {openSection === "social" ? (
                <ChevronUp className="w-5 h-5 text-red-700" />
              ) : (
                <ChevronDown className="w-5 h-5 text-red-700" />
              )}
            </div>
          </div>
          <div
            className={`overflow-hidden transition-[max-height] duration-300 ${
              openSection === "social" || window.innerWidth >= 1024
                ? "max-h-52"
                : "max-h-0"
            }`}
          >
            <div className="flex flex-wrap gap-3 mt-1">
              {[
                { name: "Facebook", icon: Facebook, bg: "bg-gray-100", color: "text-blue-700", count: "125K" },
                { name: "Twitter", icon: Twitter, bg: "bg-gray-100", color: "text-sky-700", count: "89K" },
                { name: "Instagram", icon: Instagram, bg: "bg-gray-100", color: "text-pink-600", count: "67K" },
                { name: "YouTube", icon: Youtube, bg: "bg-gray-100", color: "text-red-700", count: "45K" },
                { name: "LinkedIn", icon: Linkedin, bg: "bg-gray-100", color: "text-blue-800", count: "23K" }
              ].map(({ name, icon: Icon, bg, color, count }) => (
                <motion.button
                  key={name}
                  onClick={() => handleSocialClick(name)}
                  className={`${bg} rounded-full flex flex-col items-center justify-center p-3 hover:shadow transition w-20`}
                  title={name}
                  whileHover={{ scale: 1.08, backgroundColor: "#fee2e2" }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 320 }}
                  aria-label={name}
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="text-[10px] text-gray-700 mt-1">{count}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between text-xs text-gray-500 gap-2">
          <div>&copy; {new Date().getFullYear()} CNEWS भारत. All rights reserved.</div>
          <div className="flex flex-wrap gap-4">
            <button className="hover:underline" onClick={() => handleLinkClick("Legal", "Privacy Policy")}>
              Privacy Policy
            </button>
            <button className="hover:underline" onClick={() => handleLinkClick("Legal", "Terms of Service")}>
              Terms of Service
            </button>
            <div>Made with ❤ in India</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
