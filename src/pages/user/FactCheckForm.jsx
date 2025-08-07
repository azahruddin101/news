import React, { useState } from 'react';

const FactCheckForm = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');

  const handleToggle = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ text, language });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 w-full md:w-1/2">
      <h2 className="text-2xl font-semibold text-[#c10106] mb-6">Fact Check</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Text
          </label>
          <textarea
            id="text"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your statement to fact check"
            required
          />
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Language:</span>
          <div
            onClick={handleToggle}
            className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              language === 'en' ? 'bg-red-600' : 'bg-green-600'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                language === 'en' ? 'translate-x-0' : 'translate-x-4'
              }`}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {language === 'en' ? 'English' : 'Hindi'}
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-[#c10106] hover:bg-[#a80105] text-white py-2 rounded-md text-lg font-medium transition"
        >
          Check Fact
        </button>
      </form>
    </div>
  );
};

export default FactCheckForm;
