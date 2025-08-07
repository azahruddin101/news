import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import NewsLanding from './NewsLanding';
import Category from './Category';
import Footer from './Footer';
import axios from 'axios';
import Error429 from '../common/Error429';
import FloatingFactCheck from './FloatingFactCheck';

const Homepage = () => {
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}categories?page=1&limit=20&sortBy=displayOrder&sortOrder=asc`,
          { headers: { accept: 'application/json' } }
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

  if (errorMessage === '429') {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-2xl font-bold">
        <Error429 />
      </div>
    );
  }

  return (
    <div className="relative">
      <Navbar />
      <NewsLanding />

      {categories.map((cat) => (
        <div key={cat._id}>
          <Category category={cat.name} id={cat._id} themeColor={cat.color} />
        </div>
      ))}

      <Footer />

      {/* Floating Fact-Check Chatbot with smooth animation and click-outside-to-close */}
      <FloatingFactCheck />
    </div>
  );
};

export default Homepage;
