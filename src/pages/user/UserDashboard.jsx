import React from 'react';
import Sidebar from '../../sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

const UserDashboard = () => {
  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <Sidebar isLoggedIn={true} userType="USER" />
      {/* Main Content */}
      <main className="flex-1 bg-white overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;