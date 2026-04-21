import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ admin, children }) {
  return admin ? children : <Navigate to="/login" />;
}

export default PrivateRoute;