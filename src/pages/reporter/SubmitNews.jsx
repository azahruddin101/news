
import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import JoditEditor from 'jodit-react';

const SubmitNews = () => {
  const editor = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    language: 'Hindi',
    accessType: 'free',
    media: []
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isAccessTypeDropdownOpen, setIsAccessTypeDropdownOpen] = useState(false);

  const languageOptions = [
    'Hindi', 'English', 'Bengali', 'Tamil', 'Telugu', 
    'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'
  ];

  const accessTypeOptions = [
    { value: 'free', label: 'Free' },
    { value: 'premium', label: 'Premium' }
  ];

  // Comprehensive Jodit configuration with most toolbar features
  const joditConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'This is a detailed description of the news article. Please provide comprehensive details about the news event, including background information, key facts, and relevant context. You can format your text using the toolbar above. (minimum 50 characters)',
    height: 400,
    minHeight: 200,
    maxHeight: 600,
    
    // File upload settings
    uploader: {
      insertImageAsBase64URI: true,
      url: false,
      imagesExtensions: ['jpg', 'png', 'jpeg', 'gif', 'svg', 'webp'],
      filesVariableName: 'files[]',
      withCredentials: false,
      pathVariableName: 'path',
      format: 'json',
      headers: {},
      prepareData: function (formData) {
        return formData;
      },
      isSuccess: function (resp) {
        return !resp.error;
      },
      getMessage: function (resp) {
        return resp.msg;
      },
      process: function (resp) {
        return resp.files || [];
      },
      error: function (e) {
        this.j.events.fire('errorMessage', e.getMessage(), 'error', 4000);
      },
      defaultHandlerSuccess: function (data, resp) {
        const j = this.j || this;
        if (data.files && data.files.length) {
          data.files.forEach((filename, index) => {
            const [tagName, attr] = filename.indexOf('.') !== -1 
              ? ['img', 'src'] 
              : ['a', 'href'];
            
            const elm = j.createInside.element(tagName);
            elm.setAttribute(attr, data.baseurl + filename);
            
            if (tagName === 'img') {
              elm.setAttribute('alt', filename);
              elm.style.maxWidth = '100%';
              elm.style.height = 'auto';
            } else {
              elm.textContent = filename;
            }
            
            j.s.insertNode(elm);
          });
        }
      }
    },

    // Toolbar configuration with comprehensive buttons
    buttons: [
      // File operations
      'source', '|',
      
      // Formatting
      'bold', 'italic', 'underline', 'strikethrough', '|',
      
      // Lists
      'ul', 'ol', '|',
      
      // Indentation
      'outdent', 'indent', '|',
      
      // Alignment  
      'left', 'center', 'right', 'justify', '|',
      
      // Links and media
      'link', 'unlink', '|', 'image', '|',
      
      // Text styling
      'fontsize', 'brush', '|',
      
      // Tables
      'table', '|',
      
      // Advanced formatting
      'superscript', 'subscript', '|',
      
      // Utilities
      'copyformat', '|', 'selectall', '|',
      
      // History
      'undo', 'redo', '|',
      
      // View
      'fullsize', 'print'
    ],

    // Mobile toolbar (fewer buttons for smaller screens)
    buttonsMD: [
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|',
      'left', 'center', 'right', '|',
      'link', 'image', '|',
      'table', '|',
      'undo', 'redo', '|',
      'fullsize'
    ],

    buttonsSM: [
      'bold', 'italic', '|',
      'ul', 'ol', '|',
      'link', 'image', '|',
      'undo', 'redo'
    ],

    buttonsXS: [
      'bold', 'italic', '|',
      'ul', 'ol', '|',
      'link'
    ],

    // Font options
    controls: {
      fontsize: {
        list: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
      },
      font: {
        command: 'fontName',
        list: {
          'Arial': 'Arial, Helvetica, sans-serif',
          'Georgia': 'Georgia, serif',
          'Times New Roman': 'Times New Roman, serif',
          'Courier New': 'Courier New, monospace',
          'Verdana': 'Verdana, sans-serif',
          'Trebuchet MS': 'Trebuchet MS, sans-serif',
          'Tahoma': 'Tahoma, sans-serif',
          'Impact': 'Impact, sans-serif',
          'Comic Sans MS': 'Comic Sans MS, cursive'
        }
      },
      brush: {
        popup: function (editor, current, self, close) {
          const list = [
            '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
            '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
            '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC'
          ];
          
          return editor.c.fromHTML(
            '<div class="jodit-color-picker">' +
            list.map(color => 
              `<span class="jodit-color-picker__color" style="background: ${color}" data-color="${color}"></span>`
            ).join('') +
            '</div>'
          );
        }
      }
    },

    // Table settings
    table: {
      selectionCellStyle: 'border: 1px double #1e88e5 !important;',
      allowMultipleSelection: true,
      defaultWidth: {
        'px': 200,
        '%': 100
      }
    },

    // Image settings
    image: {
      openOnDblClick: true,
      editSrc: true,
      useImageEditor: true,
      editTitle: true,
      editAlt: true,
      editLink: true,
      editSize: true,
      editBorderRadius: true,
      editMargins: true,
      editClass: true,
      editStyle: true,
      editId: true,
      resizer: true,
      resizeUsingRatio: true,
      resizeMinSize: 10,
      resizeMaxSize: 2000,
      deleteOnDoubleClick: false
    },

    // Link settings
    link: {
      followOnDblClick: true,
      processVideoLink: true,
      processPastedLink: true,
      openLinkDialogTab: 'url',
      removeLinkAfterFormat: true,
      noFollowCheckbox: true,
      targetCheckbox: true,
      modeClassName: 'input'
    },

    // General settings
    statusbar: true,
    toolbarAdaptive: true,
    toolbarSticky: true,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html',
    enter: 'P',
    iframe: false,
    editHTMLDocumentMode: false,
    useSplitMode: false,
    dragAndDropElement: true,
    direction: 'ltr',
    language: 'en',
    debugLanguage: false,
    i18n: 'en',
    tabIndex: -1,
    toolbar: true,
    removeEmptyBlocks: false,
    fileBrowser: {
      ajax: {
        url: 'https://xdsoft.net/jodit/connector/index.php'
      }
    },

    // Style options
    style: {
      font: '16px Arial, sans-serif',
      color: '#333',
      background: '#fff'
    },

    // Color picker options
    colors: {
      greyscale: [
        '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF'
      ],
      palette: [
        '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
        '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC',
        '#CC0000', '#E06666', '#F6B26B', '#FFD966', '#93C47D', '#76A5AF', '#6D9EEB', '#6FA8DC', '#8E7CC3', '#C27BA0'
      ]
    },

    colorPickerDefaultTab: 'background',
    imageDefaultWidth: 300,
    disablePlugins: [],
    extraPlugins: [],
    ownerDocument: typeof document !== 'undefined' ? document : undefined,
    ownerWindow: typeof window !== 'undefined' ? window : undefined,
    cleanHTML: {
      replaceNBSP: true,
      removeEmptyElements: false,
      fillEmptyParagraph: true,
      removeOnlyEmptyElements: false,
      allowTags: false,
      denyTags: false
    },

    // Custom CSS for better styling
    theme: 'default',
    zIndex: 100002,
    fullsize: false,
    globalFullsize: true,
    
    // Events
    events: {
      afterInit: function () {
        // console.log('Jodit editor initialized');
      },
      beforeDestruct: function () {
        // console.log('Jodit editor destroyed');
      }
    }
  }), []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}categories?page=1&limit=20&sortBy=displayOrder&sortOrder=asc`,
          {
            headers: {
              'accept': 'application/json'
            }
          }
        );
        // console.log('Categories response:', response.data);
        if (response.data.success) {
          setCategories(response.data.data.docs);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-dropdown')) {
        setIsCategoryDropdownOpen(false);
        setIsLanguageDropdownOpen(false);
        setIsAccessTypeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle Jodit editor content changes
  const handleDescriptionChange = (content) => {
    setFormData(prev => ({
      ...prev,
      description: content
    }));
    
    // Clear description errors when user starts typing
    if (errors.description) {
      setErrors(prev => ({
        ...prev,
        description: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // console.log('Selected files:', files);
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });
    
    setFormData(prev => ({
      ...prev,
      media: validFiles
    }));
  };

  const handleCategorySelect = (categoryId) => {
    // console.log('Selected category ID:', categoryId);
    setFormData(prev => ({
      ...prev,
      category: categoryId
    }));
    setIsCategoryDropdownOpen(false);
    
    if (errors.category) {
      setErrors(prev => ({
        ...prev,
        category: ''
      }));
    }
  };

  const handleLanguageSelect = (language) => {
    setFormData(prev => ({
      ...prev,
      language: language
    }));
    setIsLanguageDropdownOpen(false);
  };

  const handleAccessTypeSelect = (accessType) => {
    setFormData(prev => ({
      ...prev,
      accessType: accessType
    }));
    setIsAccessTypeDropdownOpen(false);
  };

  // Enhanced validation function based on backend requirements
  const validateForm = () => {
    const newErrors = {};
    
    // Title validation: 10-200 characters
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 10) {
      newErrors.title = 'Title must be at least 10 characters long';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must be no more than 200 characters long';
    }
    
    // Description validation: 50-10000 characters (plain text)
    const plainTextDescription = formData.description.replace(/<[^>]*>/g, '').trim();
    
    if (!plainTextDescription) {
      newErrors.description = 'Description is required';
    } else if (plainTextDescription.length < 50) {
      newErrors.description = 'Description must be at least 50 characters long';
    } else if (plainTextDescription.length > 10000) {
      newErrors.description = 'Description must be no more than 10,000 characters long';
    }
    
    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    // Tags validation: maximum 10 tags, no trailing commas
    if (formData.tags.trim()) {
      const tagsString = formData.tags.trim();
      
      // Remove trailing comma if exists
      const cleanTagsString = tagsString.replace(/,$/, '');
      
      // Split and filter empty tags
      const tagsArray = cleanTagsString.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      if (tagsArray.length > 10) {
        newErrors.tags = 'Maximum 10 tags allowed';
      }
      
      // Check for empty tags or very short tags
      const invalidTags = tagsArray.filter(tag => tag.length < 2);
      if (invalidTags.length > 0) {
        newErrors.tags = 'Each tag must be at least 2 characters long';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to clean tags
  const cleanTags = (tagsString) => {
    if (!tagsString.trim()) return '';
    
    return tagsString
      .trim()
      .replace(/,$/, '') // Remove trailing comma
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .slice(0, 10) // Limit to 10 tags
      .join(',');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication token not found. Please log in again.');
      return;
    }
    
    setLoading(true);
    
    try {
      const submitData = new FormData();
      
      // Add text fields with proper validation
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('category', formData.category);
      
      // Clean and format tags properly
      const cleanedTags = cleanTags(formData.tags);
      if (cleanedTags) {
        submitData.append('tags', cleanedTags);
      }
      
      submitData.append('language', formData.language);
      submitData.append('accessType', formData.accessType);
      
      // Add media files
      if (formData.media && formData.media.length > 0) {
        formData.media.forEach((file) => {
          submitData.append('media', file);
        });
      }

      // Debug: Log form data contents
      // console.log('Submitting form data:');
      // for (let pair of submitData.entries()) {
      //   // console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]));
      // }

      const response = await axios.post(
        `${BASE_URL}news/submit`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          timeout: 30000
        }
      );
      
      // console.log('Form submitted successfully:', response.data);
      
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        category: '',
        tags: '',
        language: 'Hindi',
        accessType: 'free',
        media: []
      });
      
      // Clear file input
      const fileInput = document.getElementById('media');
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Clear editor content
      if (editor.current) {
        editor.current.value = '';
      }
      
      alert('News article submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      let errorMessage = 'Error submitting form. Please try again.';
      
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        
        // Handle validation errors from backend
        if (responseData.errors && Array.isArray(responseData.errors)) {
          const errorMessages = responseData.errors.map(err => 
            `${err.field}: ${err.message}`
          ).join('\n');
          errorMessage = `Validation errors:\n${errorMessages}`;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
        
        if (error.response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
          localStorage.removeItem('token');
        } else if (error.response.status === 413) {
          errorMessage = 'File size too large. Please reduce file sizes.';
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedCategory = () => {
    return categories.find(cat => cat._id === formData.category);
  };

  const getSelectedAccessType = () => {
    return accessTypeOptions.find(option => option.value === formData.accessType);
  };

  // Helper function to get character counts for display
  const getTitleCharCount = () => formData.title.length;
  
  const getDescriptionCharCount = () => {
    const plainText = formData.description.replace(/<[^>]*>/g, '');
    return plainText.length;
  };
  
  const getTagsCount = () => {
    if (!formData.tags.trim()) return 0;
    return formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0).length;
  };

  return (
    <>
      <style jsx>{`
        .jodit-container {
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
        
        .jodit-toolbar {
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
          padding: 8px;
        }
        
        .jodit-wysiwyg {
          border: none;
          font-family: inherit;
          font-size: 1rem;
          line-height: 1.5;
          padding: 16px;
          min-height: 200px;
          background-color: #ffffff;
        }
        
        .jodit-wysiwyg:focus {
          outline: none;
        }
        
        .jodit-status-bar {
          border-top: 1px solid #e5e7eb;
          background-color: #f9fafb;
          padding: 4px 8px;
          font-size: 0.75rem;
          color: #6b7280;
        }
        
        .jodit-error .jodit-container {
          border: 1px solid #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .jodit-error .jodit-toolbar {
          border-bottom-color: #ef4444;
        }
        
        .jodit-toolbar-button {
          margin: 1px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .jodit-toolbar-button:hover {
          background-color: #e5e7eb;
        }
        
        .jodit-toolbar-button_active {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        .jodit-color-picker {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          padding: 8px;
          max-width: 200px;
        }
        
        .jodit-color-picker__color {
          width: 20px;
          height: 20px;
          border-radius: 2px;
          cursor: pointer;
          border: 1px solid #e5e7eb;
        }
        
        .jodit-color-picker__color:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        /* Mobile responsive adjustments for Jodit */
        @media (max-width: 768px) {
          .jodit-toolbar {
            padding: 6px;
          }
          
          .jodit-toolbar__box {
            flex-wrap: wrap;
          }
          
          .jodit-toolbar-button {
            margin: 1px;
            min-width: 32px;
            height: 32px;
          }
          
          .jodit-wysiwyg {
            padding: 12px;
            font-size: 16px; /* Prevent zoom on iOS */
          }
        }
        
        @media (max-width: 480px) {
          .jodit-toolbar-button {
            min-width: 28px;
            height: 28px;
          }
          
          .jodit-toolbar {
            padding: 4px;
          }
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
        <h2 className={`text-3xl font-bold text-red-800 mb-6 text-center ${isMobile ? 'mt-8' : ''}`}>
          Submit News Article
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="title" className="text-base font-medium text-gray-700">
              Title <span className="text-red-500 font-bold">*</span>
              <span className="text-sm text-gray-500 font-normal ml-2">
                ({getTitleCharCount()}/200 characters)
              </span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Breaking News: Major Event Happening (minimum 10 characters)"
              className={`px-4 py-3 rounded-lg border text-base transition-all duration-200 outline-none ${
                errors.title 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              }`}
              maxLength="200"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
            <p className="text-xs text-gray-500">Title must be between 10-200 characters</p>
          </div>

          {/* Description Field with Comprehensive Jodit Editor */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="description" className="text-base font-medium text-gray-700">
              Description <span className="text-red-500 font-bold">*</span>
              <span className="text-sm text-gray-500 font-normal ml-2">
                ({getDescriptionCharCount()}/10,000 characters)
              </span>
            </label>
            
            <div className={`rounded-lg border transition-all duration-200 overflow-hidden ${
              errors.description 
                ? 'jodit-error border-red-500' 
                : 'border-gray-300 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200'
            }`}>
              <JoditEditor
                ref={editor}
                value={formData.description}
                config={joditConfig}
                tabIndex={1}
                onBlur={handleDescriptionChange}
                onChange={newContent => {}}
              />
            </div>
            
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500">
              Description must be between 50-10,000 characters (plain text count). 
              Use the comprehensive toolbar above to format your text with various styling options, 
              insert images, create tables, add links, and more.
            </p>
          </div>

          {/* Rest of the form remains the same */}
          {/* Custom Category Dropdown */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="category" className="text-base font-medium text-gray-700">
              Category <span className="text-red-500 font-bold">*</span>
            </label>
            
            <div className="relative custom-dropdown">
              <button
                type="button"
                onClick={() => {
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                  setIsLanguageDropdownOpen(false);
                  setIsAccessTypeDropdownOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg border text-base transition-all duration-200 outline-none bg-white text-left flex justify-between items-center ${
                  errors.category 
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                }`}
              >
                <span className={getSelectedCategory() ? 'text-gray-900' : 'text-gray-500'}>
                  {getSelectedCategory() ? 
                    `${getSelectedCategory().icon} ${getSelectedCategory().name}` 
                    : 'Select a category'
                  }
                </span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                  <div
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-500"
                    onClick={() => handleCategorySelect('')}
                  >
                    Select a category
                  </div>
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      className={`px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 ${
                        formData.category === category._id ? 'bg-red-50 text-red-700' : 'text-gray-900'
                      }`}
                      onClick={() => handleCategorySelect(category._id)}
                    >
                      {category.icon} {category.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Tags Field */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="tags" className="text-base font-medium text-gray-700">
              Tags
              <span className="text-sm text-gray-500 font-normal ml-2">
                ({getTagsCount()}/10 tags)
              </span>
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="politics, government, policy, breaking news"
              className={`px-4 py-3 rounded-lg border text-base transition-all duration-200 outline-none ${
                errors.tags 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              }`}
            />
            {errors.tags && (
              <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
            )}
            <p className="text-sm text-gray-500">
              Separate tags with commas. Maximum 10 tags. Each tag must be at least 2 characters.
            </p>
          </div>

          {/* Custom Language Dropdown */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="language" className="text-base font-medium text-gray-700">
              Language
            </label>
            
            <div className="relative custom-dropdown">
              <button
                type="button"
                onClick={() => {
                  setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
                  setIsCategoryDropdownOpen(false);
                  setIsAccessTypeDropdownOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-base transition-all duration-200 outline-none bg-white text-left flex justify-between items-center focus:border-red-500 focus:ring-2 focus:ring-red-200"
              >
                <span className="text-gray-900">{formData.language}</span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isLanguageDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                  {languageOptions.map((language) => (
                    <div
                      key={language}
                      className={`px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 ${
                        formData.language === language ? 'bg-red-50 text-red-700' : 'text-gray-900'
                      }`}
                      onClick={() => handleLanguageSelect(language)}
                    >
                      {language}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Custom Access Type Dropdown */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="accessType" className="text-base font-medium text-gray-700">
              Access Type
            </label>
            
            <div className="relative custom-dropdown">
              <button
                type="button"
                onClick={() => {
                  setIsAccessTypeDropdownOpen(!isAccessTypeDropdownOpen);
                  setIsCategoryDropdownOpen(false);
                  setIsLanguageDropdownOpen(false);
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 text-base transition-all duration-200 outline-none bg-white text-left flex justify-between items-center focus:border-red-500 focus:ring-2 focus:ring-red-200"
              >
                <span className="text-gray-900">{getSelectedAccessType()?.label}</span>
                <svg 
                  className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isAccessTypeDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isAccessTypeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                  {accessTypeOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 ${
                        formData.accessType === option.value ? 'bg-red-50 text-red-700' : 'text-gray-900'
                      }`}
                      onClick={() => handleAccessTypeSelect(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Media Upload */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="media" className="text-base font-medium text-gray-700">
              Media Files (Optional)
            </label>
            <div className="mt-2 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex items-center justify-center gap-1 mt-4 text-sm text-gray-600">
                  <label
                    htmlFor="media"
                    className="cursor-pointer bg-white rounded-md px-3 py-1 font-medium text-red-600 hover:text-red-500 transition-colors duration-200"
                  >
                    <span>Upload files</span>
                    <input
                      id="media"
                      name="media"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p>or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">Images and videos up to 10MB each</p>
              </div>
            </div>
            
            {formData.media.length > 0 && (
              <div className="mt-4">
                <p className="text-base font-medium text-gray-700 mb-2">Selected files:</p>
                <ul className="space-y-1">
                  {formData.media.map((file, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-red-600">📎</span>
                      <span className="flex-1">{file.name}</span>
                      <span className="text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg text-white font-medium text-base transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-200'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit News Article'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SubmitNews;
  