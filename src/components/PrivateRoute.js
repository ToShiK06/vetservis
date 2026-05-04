import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ admin, children }) {  
  const isAdmin = admin && admin.email === 'admin@vetmaster.com';
  
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default PrivateRoute;