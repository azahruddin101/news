import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, Eye, User } from "lucide-react";
import Navbar from "./Navbar";
import Error429 from "../common/Error429";
import Footer from "./Footer";
import HorizontalAdSection from "../common/HorizontalAdSection";
import VerticalAdSection from "../common/VerticleAdSection";
import AdSection from "../common/AdSection";


// Throttle helper
const useThrottle = (value, delay) => {
  const [throttled, setThrottled] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setThrottled(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return throttled;
};

const AllNewsScroll = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [newsList, setNewsList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const hasFetchedOnce = useRef(false);
  const observer = useRef();

  const url = import.meta.env.VITE_BASE_URL;
  const img_url = import.meta.env.VITE_IMG_URL;

  // Helpers
  const isValidImageExtension = (filePath) => {
    if (!filePath) return false;
    const ext = filePath.toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".bmp"].some((e) =>
      ext.endsWith(e)
    );
  };

  const getImageUrl = useCallback(
    (mediaPath, articleId) => {
      if (imageErrors[articleId]) {
        return "https://via.placeholder.com/120x90/ef4444/ffffff?text=Image+Error";
      }
      if (!mediaPath || mediaPath.length === 0) {
        return "https://via.placeholder.com/120x90/e2e8f0/64748b?text=No+Image";
      }
      const path = mediaPath[0];
      if (!isValidImageExtension(path)) {
        return "https://via.placeholder.com/120x90/f59e0b/fff?text=Invalid+Img";
      }
      const cleanPath = path.startsWith("/") ? path : `/${path}`;
      return `${img_url}${cleanPath}`;
    },
    [imageErrors, img_url]
  );

  const handleImageError = useCallback((articleId) => {
    setImageErrors((prev) => ({ ...prev, [articleId]: true }));
  }, []);

  const fetchNews = useCallback(async () => {
    if (loading || !categoryId || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(`${url}news`, {
        params: { category: categoryId, page, limit: 10 },
        headers: { Accept: "application/json" },
      });
      const newItems = Array.isArray(res.data?.data?.news)
        ? res.data.data.news
        : [];
      setNewsList((prev) => [...prev, ...newItems]);
      setHasMore(newItems.length > 0);
      setPage((prev) => prev + 1);
    } catch (err) {
      if (err.response && err.response.status === 429) {
        setErrorMessage("429");
      } else {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, categoryId, url]);

  const throttledPage = useThrottle(page, 1000);

  useEffect(() => {
    setPage(1);
    setNewsList([]);
    setHasMore(true);
    hasFetchedOnce.current = false;
  }, [categoryId]);

  useEffect(() => {
    if (!hasFetchedOnce.current && categoryId) {
      fetchNews();
      hasFetchedOnce.current = true;
    }
  }, [categoryId, fetchNews]);

  const lastItemRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchNews();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchNews, loading, hasMore]
  );

  const handleClick = (slug) => {
    navigate(`/news/${slug}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // News card, shrinks to feed style on mobile
  const NewsCard = ({ article, onClick, lastRef, getImageUrl, handleImageError }) => (
    <div
      ref={lastRef}
      onClick={onClick}
      className="relative flex gap-2 sm:gap-3 items-start bg-white rounded border border-gray-200 shadow-sm hover:shadow-md cursor-pointer overflow-hidden p-2 sm:p-3 min-h-[75px] w-full"
    >
      <img
        src={getImageUrl(article.media, article._id)}
        alt={article.title}
        onError={() => handleImageError(article._id)}
        className="w-20 h-16 sm:w-28 sm:h-20 rounded object-cover flex-shrink-0"
        loading="lazy"
      />
      <div className="flex flex-col min-w-0 w-full">
        <h3 className="text-[1rem] font-medium text-gray-900 line-clamp-2 mb-1 hover:text-blue-700 transition-all">{article.title}</h3>
        <div
  className="hidden lg:line-clamp-2 text-xs text-gray-500"
  dangerouslySetInnerHTML={{
    __html: article.shortDescription || article.description || "",
  }}
></div>
        <div className="flex flex-wrap text-[0.80rem] text-gray-400 items-center gap-x-3 gap-y-1 mt-[0.20rem]">
          <span><Calendar className="inline w-3 h-3 mr-0.5" />{formatDate(article.publishingDate)}</span>
          <span>{article.language || "NA"}</span>
        </div>
        <div className="flex items-center mt-1 text-xs text-gray-500">
          <User className="w-4 h-4 mr-1" />
          {article.reporter?.name || "Unknown"}
        </div>
      </div>
      {article.isTrending && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide">
          TRENDING
        </div>
      )}
    </div>
  );

  if (errorMessage === "429") {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-2xl font-bold">
        <Error429 />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-full bg-gray-50 min-h-screen py-2">
        <div className="max-w-6xl mx-auto px-2 md:px-6">
          {/* On md+: grid with sidebar; mobile: vertical feed */}
          <div className="md:grid md:grid-cols-4 md:gap-6">
            {/* --- News Feed --- */}
            <div className="md:col-span-3 flex flex-col gap-2 sm:gap-3">
              <h2 className="text-lg sm:text-xl font-bold mb-2 capitalize">{categoryId} News</h2>

              {/* Optional: mobile top ad */}
              <div className="block md:hidden">
                <HorizontalAdSection type="banner-top-mobile" />
              </div>

              {newsList.map((article, idx) => (
                <React.Fragment key={article._id}>
                  <NewsCard
                    article={article}
                    onClick={() => handleClick(article.slug)}
                    lastRef={idx === newsList.length - 1 ? lastItemRef : null}
                    getImageUrl={getImageUrl}
                    handleImageError={handleImageError}
                  />
                  {/* Inline ad after every 10 items, skip first */}
                  {(idx > 0 && idx % 10 === 0) && (
                    <div className="my-2">
                      <HorizontalAdSection type="inline-feed" />
                    </div>
                  )}
                </React.Fragment>
              ))}

              {loading && (
                <div className="text-center text-sm text-gray-400 mt-4">Loading more news...</div>
              )}
              {!loading && newsList.length === 0 && (
                <div className="text-center text-gray-500 mt-6">No news found.</div>
              )}
            </div>

            {/* --- Right Sidebar Ads (only on md+) --- */}
            <aside className="hidden md:flex col-span-1 flex-col gap-4 sticky top-28 h-fit">
              <VerticalAdSection type="sidebar-rect" />
              <VerticalAdSection type="sidebar-square" />
              <div className="hidden lg:block">
                <VerticalAdSection type="sidebar-skyscraper" />
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllNewsScroll;
