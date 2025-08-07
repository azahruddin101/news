import React from 'react';
import logo from '../../assets/cnews.png';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-transparent px-4">
      <div className="bg-transparent border-2 border-red-600 shadow-lg rounded-xl max-w-md w-full p-10 text-center">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="" className="h-56 w-auto"/>
        </div>
        <h2 className="text-2xl font-semibold text-red-700 mb-6">Loading...</h2>
        <p className="text-gray-700 text-base mb-8">
          We are preparing your content. Please wait.
        </p>
      </div>
    </div>
  );  
};

export default Loader;
