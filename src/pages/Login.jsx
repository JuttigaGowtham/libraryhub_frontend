import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Importing the new login image
import loginImage from '../assets/login.png';

const Login = () => {
  const [email, setEmail] = useState('admin@libraryhub.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="inline-block mb-12">
            <span className="text-3xl font-medium text-black tracking-tight hover:text-primary transition-colors">
              LibraryHub
            </span>
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-medium text-black mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 font-medium text-lg">Sign in to continue to LibraryHub.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-black focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-black focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-md shadow-primary/20 text-lg font-bold text-white bg-primary hover:bg-blue-700 disabled:opacity-50 transition-all hover:-translate-y-0.5 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-sm font-medium text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary hover:text-blue-700 transition-colors">
              Create one now
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-white items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg aspect-[4/5] rounded-3xl overflow-hidden relative"
        >
          {/* Login Image */}
          <img 
            src={loginImage} 
            alt="Library aesthetic" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 " />
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
