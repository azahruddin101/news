import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import {
  FileText, Edit3, Calendar, User, Tag, Globe, Lock, Users,
  Upload, X, ChevronDown, Save, XCircle, AlertCircle, Bot,
  Sparkles, Trash2, Image as ImageIcon, CheckCircle, Eye,
  LucideLoader2
} from 'lucide-react';
import Loader from '../common/Loader.jsx'

const EditNews = () => {
  // State management
  const [pendingNews, setPendingNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // AI Suggestions state
  const [aiSuggestions, setAiSuggestions] = useState({
    title: [],
    description: ''
  });
  const [loadingAI, setLoadingAI] = useState({ title: false, description: false });
  const [showAiDialog, setShowAiDialog] = useState({ title: false, description: false });

  // Form data state
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    language: 'English',
    accessType: 'free',
    priority: 'medium',
    trending: false,
    featured: false,
    media: [], // For new media files
    existingMedia: [], // For existing media URLs
    keepExistingMedia: true // Flag to keep existing media
  });

  const token = localStorage.getItem('token');
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch pending news
  const fetchPendingNews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}news/pending?page=1&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingNews(response.data.data.news || []);
    } catch (error) {
      console.error('Error fetching pending news:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}categories?page=1&limit=20`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchPendingNews();
    fetchCategories();
  }, []);

  // Form helpers
  const cleanTags = (tagString) => {
    return tagString
      .trim()
      .replace(/,$/, '')
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .slice(0, 10)
      .join(',');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editFormData.title.trim()) newErrors.title = 'Title is required';
    if (!editFormData.description.replace(/<[^>]+>/g, '').trim()) {
      newErrors.description = 'Description is required';
    }
    if (!editFormData.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // AI Assistance Functions
  const generateTitleSuggestions = async () => {
    setLoadingAI(prev => ({ ...prev, title: true }));
    try {
      const response = await axios.post(`${BASE_URL}ai/news/${selectedNews._id || selectedNews.id}/suggest-title`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setAiSuggestions(prev => ({ ...prev, title: response.data.data.suggestions }));
        setShowAiDialog(prev => ({ ...prev, title: true }));
      } else {
        alert('Failed to generate title suggestions');
      }
    } catch (error) {
      console.error('AI suggestions error:', error);
      alert('Failed to get AI suggestions');
    } finally {
      setLoadingAI(prev => ({ ...prev, title: false }));
    }
  };

  const generateDescriptionSuggestion = async () => {
    setLoadingAI(prev => ({ ...prev, description: true }));
    try {
      const response = await axios.post(`${BASE_URL}ai/news/${selectedNews._id || selectedNews.id}/suggest-description`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setAiSuggestions(prev => ({ ...prev, description: response.data.data.suggestion }));
        setShowAiDialog(prev => ({ ...prev, description: true }));
      } else {
        alert('Failed to generate description suggestion');
      }
    } catch (error) {
      console.error('AI suggestions error:', error);
      alert('Failed to get AI suggestions');
    } finally {
      setLoadingAI(prev => ({ ...prev, description: false }));
    }
  };

  const updateFieldWithAI = async (field, value) => {
    try {
      const response = await axios.patch(`${BASE_URL}news/${selectedNews._id || selectedNews.id}/field`, {
        field,
        value
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setEditFormData(prev => ({ ...prev, [field]: value }));
        setSuccess(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
        setShowAiDialog(prev => ({ ...prev, [field]: false }));
        
        // Update local news data
        setPendingNews(prev => prev.map(news => 
          (news._id || news.id) === (selectedNews._id || selectedNews.id)
            ? { ...news, ...response.data.data.news }
            : news
        ));
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        alert(`Failed to update ${field}`);
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      alert(`Error updating ${field}`);
    }
  };

  // FIXED: Main save function with correct field names
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedNews) return;
    if (!validateForm()) return;

    setEditLoading(true);
    try {
      const formData = new FormData();
      
      // Basic fields
      formData.append('title', editFormData.title.trim());
      formData.append('description', editFormData.description.trim());
      formData.append('category', editFormData.category);
      formData.append('language', editFormData.language);
      formData.append('accessType', editFormData.accessType);
      formData.append('priority', editFormData.priority);
      formData.append('trending', editFormData.trending.toString());
      formData.append('featured', editFormData.featured.toString());
      
      // Tags
      const cleanedTags = cleanTags(editFormData.tags);
      if (cleanedTags) {
        formData.append('tags', cleanedTags);
      }
      
      // FIXED: Append new files with correct field name 'media' (not 'newMedia')
      if (editFormData.media.length > 0) {
        editFormData.media.forEach((file) => {
          formData.append('media', file);
        });
      }
      
      // console.log('FormData entries:');
      for (let pair of formData.entries()) {
        // console.log(pair[0] + ':', pair[1]);
      }

      const response = await axios.patch(
        `${BASE_URL}news/${selectedNews._id || selectedNews.id}`, 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            'accept': 'application/json'
          }
        }
      );
      
      // console.log('Update successful:', response.data);
      
      // Update local state
      setPendingNews(prev => prev.map(news => 
        (news._id || news.id) === (selectedNews._id || selectedNews.id)
          ? { ...news, ...response.data.data.news }
          : news
      ));
      
      setSuccess('Article updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      handleCancelEdit();
      
    } catch (error) {
      console.error('Failed to update news:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Error updating article. Please try again.';
      alert(`Update failed: ${errorMessage}`);
    } finally {
      setEditLoading(false);
    }
  };

  // Modal handlers
  const handleEditClick = (news) => {
    setSelectedNews(news);
    
    // Handle existing media properly
    let existingMedia = [];
    if (news.media && Array.isArray(news.media)) {
      existingMedia = news.media.map(media => {
        if (typeof media === 'string') {
          return { url: media, type: 'image', filename: media.split('/').pop() };
        }
        return media;
      });
    }
    
    setEditFormData({
      title: news.title || '',
      description: news.description || news.excerpt || '',
      category: news.category?._id || news.category || '',
      tags: Array.isArray(news.tags) ? news.tags.join(', ') : (news.tags || ''),
      language: news.language || 'English',
      accessType: news.accessType || 'free',
      priority: news.priority || 'medium',
      trending: news.trending || false,
      featured: news.featured || false,
      media: [],
      existingMedia: existingMedia,
      keepExistingMedia: true
    });
    
    setShowEditModal(true);
    setErrors({});
    setAiSuggestions({ title: [], description: '' });
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setSelectedNews(null);
    setEditFormData({
      title: '', description: '', category: '', tags: '',
      language: 'English', accessType: 'free', priority: 'medium',
      trending: false, featured: false, media: [], existingMedia: [],
      keepExistingMedia: true
    });
    setErrors({});
    setAiSuggestions({ title: [], description: '' });
    setShowAiDialog({ title: false, description: false });
    setSuccess('');
  };

  // File handling
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setEditFormData(prev => ({
      ...prev,
      media: [...prev.media, ...files]
    }));
  };

  const removeFile = (index) => {
    setEditFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const removeExistingMedia = (index) => {
    setEditFormData(prev => ({
      ...prev,
      existingMedia: prev.existingMedia.filter((_, i) => i !== index)
    }));
  };

  const toggleKeepExistingMedia = () => {
    setEditFormData(prev => ({
      ...prev,
      keepExistingMedia: !prev.keepExistingMedia
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center text-red-600 mb-10">
          <h1 className="text-3xl font-bold  mb-2">Edit News Articles</h1>
          <p className="text-red-700">Manage and edit pending news articles</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">{success}</span>
          </div>
        )}

        {/* News List */}
        <div className="grid gap-6">
          {pendingNews.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending articles</h3>
              <p className="text-gray-500">All articles are up to date!</p>
            </div>
          ) : (
            pendingNews.map((news) => (
              <motion.div
                key={news._id || news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {news.description || news.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(news.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {news.author?.name || news.reporter?.name || 'Unknown'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {news.category?.name || news.category}
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        {news.language}
                      </div>
                      <div className="flex items-center gap-1">
                        {news.accessType === 'premium' ? (
                          <Lock className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <Users className="w-4 h-4 text-green-500" />
                        )}
                        {news.accessType}
                      </div>
                    </div>

                    {/* Status indicators */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {news.trending && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Trending
                        </span>
                      )}
                      {news.featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Featured
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        news.priority === 'high' ? 'bg-red-100 text-red-800' :
                        news.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {news.priority || 'medium'} priority
                      </span>
                    </div>

                    {/* Tags */}
                    {news.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(Array.isArray(news.tags) ? news.tags : []).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Media preview */}
                    {news.media && news.media.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        <span className="text-sm text-gray-500">Media:</span>
                        <span className="text-sm text-red-600">{news.media.length} file(s)</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleEditClick(news)}
                    className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {showEditModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={(e) => e.target === e.currentTarget && handleCancelEdit()}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Article</h2>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSaveEdit} className="p-6 space-y-6">
                  {/* Success Message in Modal */}
                  {success && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-800">{success}</span>
                    </div>
                  )}

                  {/* Title Section with AI Assistance */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Title *
                      </label>
                      <button
                        type="button"
                        onClick={generateTitleSuggestions}
                        disabled={loadingAI.title}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                      >
                        {loadingAI.title ? <LucideLoader2 /> : <Sparkles className="w-3 h-3" />}
                        AI Assist
                      </button>
                    </div>
                    <input
                      type="text"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter article title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Description Section with AI Assistance */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Description *
                      </label>
                      <button
                        type="button"
                        onClick={generateDescriptionSuggestion}
                        disabled={loadingAI.description}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                      >
                        {loadingAI.description ? <LucideLoader2 /> : <Sparkles className="w-3 h-3" />}
                        AI Assist
                      </button>
                    </div>
                    <ReactQuill
                      value={editFormData.description}
                      onChange={(content) => setEditFormData(prev => ({ ...prev, description: content }))}
                      className={errors.description ? 'border-red-500 rounded-lg' : ''}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link', 'image'],
                          ['clean']
                        ],
                      }}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Category and Language */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={editFormData.category}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, category: e.target.value }))}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select category</option>
                        {/* {// console.log(categories)} */}
                        {categories.docs.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.icon} 
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={editFormData.language}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="Hindi">Hindi</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                  </div>

                  {/* Priority and Access Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={editFormData.priority}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Access Type
                      </label>
                      <select
                        value={editFormData.accessType}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, accessType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>
                  </div>

                  {/* Feature toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="trending"
                        checked={editFormData.trending}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, trending: e.target.checked }))}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="trending" className="ml-2 block text-sm text-gray-900">
                        Mark as Trending
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={editFormData.featured}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                        Mark as Featured
                      </label>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma separated, max 10)
                    </label>
                    <input
                      type="text"
                      value={editFormData.tags}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="politics, government, policy"
                    />
                  </div>

                  {/* Existing Media Management */}
                  {editFormData.existingMedia.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Current Media Files ({editFormData.existingMedia.length})
                        </label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="keepExistingMedia"
                            checked={editFormData.keepExistingMedia}
                            onChange={toggleKeepExistingMedia}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="keepExistingMedia" className="ml-2 block text-sm text-gray-900">
                            Keep existing media
                          </label>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {editFormData.existingMedia.map((media, index) => (
                          <div key={index} className="relative">
                            <div className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                              {media.url && media.url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                <img 
                                  src={`${BASE_URL.replace('/api', '')}${media.url}`}
                                  alt={media.filename || 'Media'} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : (
                                <span className="text-sm text-gray-600 text-center px-2">
                                  {media.filename || 'Media File'}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExistingMedia(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      {!editFormData.keepExistingMedia && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <p className="text-sm text-yellow-800">
                            <AlertCircle className="w-4 h-4 inline mr-1" />
                            All existing media will be removed when you save.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* New Media Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add New Media Files
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="media-upload"
                      />
                      <label
                        htmlFor="media-upload"
                        className="cursor-pointer flex flex-col items-center justify-center py-4"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload new media files</span>
                        <span className="text-xs text-gray-500 mt-1">Images and videos supported</span>
                      </label>
                    </div>
                    
                    {editFormData.media.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium text-gray-700">New files to upload ({editFormData.media.length}):</p>
                        {editFormData.media.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                <Upload className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-700">{file.name}</span>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Media Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Media Summary</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• Existing media: {editFormData.keepExistingMedia ? editFormData.existingMedia.length : 0} files will be kept</p>
                      <p>• New media: {editFormData.media.length} files will be uploaded</p>
                      <p>• Total after save: {(editFormData.keepExistingMedia ? editFormData.existingMedia.length : 0) + editFormData.media.length} files</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      {editLoading ? (
                        <>
                          <Loader />
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Title Suggestions Dialog */}
        <AnimatePresence>
          {showAiDialog.title && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]"
              onClick={(e) => e.target === e.currentTarget && setShowAiDialog(prev => ({ ...prev, title: false }))}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-red-600" />
                      AI Title Suggestions
                    </h3>
                    <button
                      onClick={() => setShowAiDialog(prev => ({ ...prev, title: false }))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Current Title:</label>
                    <p className="p-3 bg-gray-50 rounded-lg text-sm">{editFormData.title}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">AI Suggestions:</label>
                    <div className="space-y-2">
                      {aiSuggestions.title.map((suggestion, index) => (
                        <div key={index} className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <p className="text-sm flex-1 pr-4">{suggestion}</p>
                          <button
                            onClick={() => updateFieldWithAI('title', suggestion)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 flex-shrink-0"
                          >
                            Use This
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Description Suggestion Dialog */}
        <AnimatePresence>
          {showAiDialog.description && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]"
              onClick={(e) => e.target === e.currentTarget && setShowAiDialog(prev => ({ ...prev, description: false }))}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-red-600" />
                      AI Description Suggestion
                    </h3>
                    <button
                      onClick={() => setShowAiDialog(prev => ({ ...prev, description: false }))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Current Description:</label>
                    <div className="p-3 bg-gray-50 rounded-lg text-sm max-h-32 overflow-y-auto">
                      <div dangerouslySetInnerHTML={{ __html: editFormData.description }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">AI Suggestion:</label>
                    <div className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <p className="text-sm flex-1 pr-4">{aiSuggestions.description}</p>
                      <button
                        onClick={() => updateFieldWithAI('description', aiSuggestions.description)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 flex-shrink-0"
                      >
                        Use This
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EditNews;
