import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, Eye, User } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import HorizontalAdSection from "../common/HorizontalAdSection";
import VerticalAdSection from "../common/VerticleAdSection";
import Loader from "../common/Loader";
import NoResultFound from "../common/NoResultFound";

const SearchResults = () => {
  const { query } = useParams();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const img_url = import.meta.env.VITE_IMG_URL;
  const url = import.meta.env.VITE_BASE_URL;

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleClick = (slug) => {
    navigate(`/news/${slug}`);
  };

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}news/search`, {
        params: {
          q: query,
          page: 1,
          limit: 20,
        },
        headers: {
          accept: "application/json",
        },
      });
      setResults(res.data.data.news || []);
      // console.log("Search results:", res.data.data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query?.trim()) {
      fetchSearchResults();
    } else {
      navigate("/"); // go home if no query
    }
  }, [query]);

  const NewsCard = ({ article }) => (
    <div
      onClick={() => handleClick(article.slug)}
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
        <h3 className="text-[1rem] font-medium text-gray-900 line-clamp-2 mb-1 hover:text-blue-700 transition-all">
          {article.title}
        </h3>
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
          <User className="w-4 h-4 mr-1" title="Reporter" />
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

  return (
    <>
      <Navbar />
      <div className="w-full bg-gray-50 min-h-screen py-2">
        <div className="max-w-6xl mx-auto px-2 md:px-6">
          <div className="md:grid md:grid-cols-4 md:gap-6">
            {/* Main content */}
            <div className="md:col-span-3 flex flex-col gap-2 sm:gap-3">
              <h2 className="text-lg sm:text-xl font-bold mb-2">
                Search Results for: <span className="text-red-600">"{query}"</span>
              </h2>

              {/* Top Ad (Mobile) */}
              <div className="block md:hidden">
                <HorizontalAdSection type="banner-top-mobile" />
              </div>

              {loading && <p className="text-sm text-gray-500">
                <Loader />
              </p>}
              {!loading && results.length === 0 && (
                <p className="text-gray-500">
                  <NoResultFound />
                </p>
              )}

              {results.map((article, idx) => (
                <React.Fragment key={article._id}>
                  <NewsCard article={article} />
                  {idx > 0 && idx % 10 === 0 && (
                    <div className="my-2">
                      <HorizontalAdSection type="inline-feed" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Sidebar */}
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

export default SearchResults;