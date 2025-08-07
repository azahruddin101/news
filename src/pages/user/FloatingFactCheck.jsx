import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Each step represents one reply to show
const getBotStepsFromResult = (data) => {
  if (data.error) return [{ type: 'error', value: data.error }];
  return [
    { label: 'Status',       value: data.status,              color: "text-blue-600" },
    { label: 'Credibility',  value: data.credibilityScore,    color: "text-orange-600" },
    { label: 'Result',       value: data.verificationResult,  color: data.verificationResult === "FALSE" ? "text-red-600 font-bold" : "text-green-600 font-bold" },
    { label: 'Summary',      value: data.verificationSummary, color: "" },
    { label: 'Reliability',  value: data.reliability,         color: "text-yellow-700" },
  ];
};

const BotStepBubble = ({ step }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.96 }}
    className='flex items-end space-x-2 mb-2 max-w-xs'
  >
    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-red-500 to-rose-400 shadow text-white text-lg font-semibold">
      🤖
    </div>
    <div className="px-4 py-3 rounded-2xl shadow bg-white border border-gray-200 text-gray-900 rounded-bl-md">
      {step.type === 'error'
        ? <span className='text-red-500 font-semibold'>{step.value}</span>
        : <span>
            <b>{step.label}:</b> <span className={step.color}>{step.value}</span>
          </span>
      }
    </div>
  </motion.div>
);

const UserBubble = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.96 }}
    className="flex items-end space-x-2 mb-2 max-w-xs self-end flex-row-reverse"
  >
    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-red-600 to-pink-500 shadow text-white text-lg font-semibold">
      🧑
    </div>
    <div className="px-4 py-3 rounded-2xl shadow bg-gradient-to-tr from-red-600 to-pink-500 text-white rounded-br-md">
      {children}
    </div>
  </motion.div>
);

const FloatingFactCheck = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const popupRef = useRef(null);
  const chatBottomRef = useRef(null);
  const authToken = localStorage.getItem('token');

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Stepwise bot replies
  const handleBotStepwiseReply = async (data) => {
    const steps = getBotStepsFromResult(data);
    for (let i = 0; i < steps.length; i++) {
      setMessages(msgs => [...msgs, { type: "bot", step: steps[i] }]);
      await new Promise(res => setTimeout(res, 700));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setMessages(msgs => [...msgs, { type: "user", content: text }]);
    setLoading(true);
    setText('');
    try {
      const response = await axios.post(
        `${baseUrl}fact-check/verify`,
        { text, language },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      await handleBotStepwiseReply(response.data?.data || { error: 'No data' });
    } catch (error) {
      await handleBotStepwiseReply({ error: error.response?.data?.message || 'Failed to fetch fact check result.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-gradient-to-tr from-red-600 to-red-500 text-white p-5 rounded-full shadow-xl hover:scale-110 hover:bg-red-700 transition duration-200 text-2xl"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.09 }}
        aria-label={isOpen ? 'Close Fact Checker' : 'Open Fact Checker'}
      >
        {isOpen ? '×' : '🤖'}
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-60 flex flex-col overflow-hidden"
            style={{ minHeight: 400 }}
          >
            {/* Header */}
            <div className="flex items-center bg-gradient-to-tr from-red-600 to-rose-500 text-white px-4 py-3 font-semibold text-base shadow-sm">
              <span className="w-8 h-8 mr-2 rounded-full bg-white bg-opacity-10 flex items-center justify-center text-xl">🤖</span>
              Fact Checker Assistant
              <button
                onClick={() => setIsOpen(false)}
                className="ml-auto text-white opacity-60 hover:opacity-90"
                aria-label="Close"
              >×</button>
            </div>
            {/* Chat Area */}
            <div className="flex-1 flex flex-col gap-1 px-3 py-3 overflow-y-auto" style={{ background: '#f7f8fa', minHeight: 300, maxHeight: 450 }}>
              <AnimatePresence initial={false}>
                {messages.map((msg, i) =>
                  msg.type === "user" ? (
                    <UserBubble key={'user'+i}>{msg.content}</UserBubble>
                  ) : (
                    <BotStepBubble key={'bot'+i} step={msg.step} />
                  )
                )}
                {loading && (
                  <BotStepBubble step={{label: "", value: <span className="opacity-70">Verifying...</span>}} />
                )}
              </AnimatePresence>
              <div ref={chatBottomRef} />
            </div>
            {/* User input */}
            <form 
              onSubmit={handleSubmit} 
              className="flex items-end border-t border-gray-200 bg-white px-3 py-2 gap-2"
            >
              <textarea
                value={text}
                disabled={loading}
                onChange={e => setText(e.target.value)}
                placeholder="Enter your claim here..."
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 resize-none text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 min-h-[40px] max-h-[80px]"
                rows={1}
                required
                style={{ lineHeight: "1.3" }}
              />
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="rounded-md border border-gray-300 p-1 text-xs bg-gray-50"
                disabled={loading}
                style={{ marginBottom: 2 }}
              >
                <option value="en">EN</option>
                <option value="hi">HI</option>
              </select>
              {
                authToken ? (
                  <button
                    type="submit"
                    disabled={loading || !text.trim()}
                    className={`
                      px-4 py-2 bg-gradient-to-tr from-red-600 to-rose-500 text-white rounded-lg text-sm font-semibold shadow-md transition
                      ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-700'}
                    `}
                  >
                    Send
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => window.location.href = '/login'}
                    className={`
                      px-4 py-2 bg-gray-300 text-gray-600 rounded-lg text-sm font-semibold shadow-md transition
                      ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-400'}
                    `}
                  >
                    Login
                  </button>
                )
              }
            </form>
            {/* Footer */}
            <div className="text-xs text-center py-2 text-gray-400 bg-white border-t border-gray-100">
              Powered by AI Fact Check
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingFactCheck;
