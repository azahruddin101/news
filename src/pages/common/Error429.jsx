import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/cnews.png';


const Error429 = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleAction = () => {
    if (token) {
      navigate('/subscribe');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent px-4">
      <div className="bg-transparent border-2 border-red-600 shadow-lg rounded-xl max-w-md w-full p-10 text-center">
        <div className="flex justify-center mb-8">
        <img src={logo} alt="" className='h-56 w-auto'/>
        </div>
        <h2 className="text-2xl font-semibold text-red-700 mb-6">Too Many Requests</h2>
        <p className="text-gray-700 mb-8 text-base">
          Your free trial has expired. Please{' '}
          <strong className="text-red-600">{token ? 'subscribe' : 'login'}</strong> to continue using our service.
        </p>
        <button
          onClick={handleAction}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-md transition duration-200"
          aria-label={token ? 'Subscribe Now' : 'Login'}
        >
          {token ? 'Subscribe Now' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Error429;
