import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_BASE_URL || '';

function Comment({ comment }) {
  const userName = comment.user?.name || comment.userName || 'Anonymous';
  const createdAt = comment.createdAt || comment.created_at || new Date().toISOString();

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white px-4 py-3 rounded-lg shadow-sm border mb-3"
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium text-gray-900">{userName}</span>
        <span className="text-xs text-gray-400">
          {new Date(createdAt).toLocaleString()}
        </span>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">
        {comment.content || comment.text}
      </p>
    </motion.li>
  );
}

export default function CommentsSection({ newsId }) {
  const [comments, setComments] = useState([]);
  const [commentValue, setCommentValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const currentComments = comments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  useEffect(() => {
    if (!newsId) return;
    fetchComments();
  }, [newsId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}news/${newsId}/comments`);
      let commentsList = [];
      const data = res.data;

      if (data.success && data.data) {
        if (Array.isArray(data.data.comments)) commentsList = data.data.comments;
        else if (Array.isArray(data.data)) commentsList = data.data;
      } else if (Array.isArray(data.comments)) commentsList = data.comments;
      else if (Array.isArray(data)) commentsList = data;

      setComments(commentsList || []);
      setCurrentPage(1); // Reset to first page on fetch
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!commentValue.trim()) return;
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}news/${newsId}/comments`, { content: commentValue }, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
      });
      setCommentValue('');
      await fetchComments();
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      layout
      className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm"
    >
      <form onSubmit={submit} className="flex gap-2 mb-6">
        <input
          className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Write your comment..."
          value={commentValue}
          onChange={e => setCommentValue(e.target.value)}
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting || !commentValue.trim()}
          className="bg-blue-600 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </form>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 text-sm"
        >
          Loading comments...
        </motion.div>
      ) : (
        <>
          {comments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 text-sm italic"
            >
              No comments yet. Be the first to comment!
            </motion.div>
          ) : (
            <ul>
              <AnimatePresence>
                {currentComments.map((c) => (
                  <Comment comment={c} key={c.id || c._id} />
                ))}
              </AnimatePresence>
            </ul>
          )}

          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center items-center gap-4 mt-4"
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
