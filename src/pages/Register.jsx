import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Importing the new register image
import registerImage from '../assets/register.png';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(name, email, password);
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
            <h1 className="text-4xl font-medium text-black mb-3 tracking-tight">Create Account</h1>
            <p className="text-slate-500 font-medium text-lg">Join LibraryHub and discover millions of stories.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-black focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

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
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-4 rounded-xl shadow-md shadow-primary/20 text-lg font-bold text-white bg-primary hover:bg-blue-700 disabled:opacity-50 transition-all hover:-translate-y-0.5 mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-sm font-medium text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:text-blue-700 transition-colors">
              Sign in instead
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-whiteitems-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg aspect-[4/5] rounded-3xl overflow-hidden relative"
        >
          {/* Registration Image */}
          <img 
            src={registerImage} 
            alt="Library aesthetic" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 " />
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
