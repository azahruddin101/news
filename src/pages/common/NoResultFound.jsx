import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/cnews.png';

const NoResultFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get('q') || 'your search';
  const token = localStorage.getItem('token');

  const handleAction = () => {
    // Navigate back to the search page, or wherever search is performed
    if (location.pathname.includes('/search')) {
      navigate(location.pathname + location.search); // Refresh search page
    } else {
      navigate('/search'); // Go to search page if not already there
    }
  };

  return (
    <div className="min-h-[400px] pt-3 flex flex-col items-center justify-center bg-transparent px-4">
      <div className="bg-transparent border-2 border-red-600 shadow-lg rounded-xl max-w-md w-full p-10 text-center">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="" className="h-56 w-auto" />
        </div>
        <h2 className="text-2xl font-semibold text-red-700 mb-6">No Results Found</h2>
        <p className="text-gray-700 mb-6 text-base">
          Sorry, we couldn't find any results for <strong className="text-red-600">"{searchTerm}"</strong>.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Try another search term, or let us know if you think this result should be here.
        </p>
        <a
          href="/contact"
          className="text-red-600 hover:underline font-medium"
          onClick={(e) => {
            e.preventDefault();
            navigate('/contact');
          }}
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default NoResultFound;
