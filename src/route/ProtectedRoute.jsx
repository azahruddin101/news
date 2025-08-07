// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";

// function ProtectedRoute() {
//   // Check for the 'token' in localStorage, consistent with App.js and Login.jsx
//   const isLoggedIn = localStorage.getItem("token") ? true : false;

//   // If not logged in (no token), redirect to the login page
//   return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
// }

// export default ProtectedRoute;

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ userType }) {
  const token = localStorage.getItem("token");
  const storedUserType = localStorage.getItem("userType");
  
  // console.log('ProtectedRoute - Token:', !!token, 'UserType:', userType, 'StoredUserType:', storedUserType); // Debug
  
  // If not logged in, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If userType doesn't match what's stored, something is wrong
  if (userType !== storedUserType) {
    console.warn('UserType mismatch:', userType, 'vs', storedUserType);
  }

  return <Outlet />;
}

export default ProtectedRoute;
