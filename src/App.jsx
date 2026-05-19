import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookDetail from './pages/BookDetail';
import Dashboard from './pages/Dashboard';

const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {!isAuthPage && <Navbar />}
      <main className={`flex-grow w-full ${!isAuthPage ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
