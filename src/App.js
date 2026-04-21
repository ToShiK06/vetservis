import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Contacts from './pages/Contacts';
import About from './pages/About';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import { auth } from './firebase';
import './App.css';

function App() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAdmin(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="appContainer"></div>;
  }

  return (
    <Router>
      <div className="appContainer">
        <Header admin={admin} setAdmin={setAdmin} />
        <main className="mainContent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login setAdmin={setAdmin} />} />
            <Route path="/admin" element={
              <PrivateRoute admin={admin}>
                <AdminPanel setAdmin={setAdmin} />
              </PrivateRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;