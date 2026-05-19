import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, User as UserIcon, LogOut, Menu, X, Search, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');

  React.useEffect(() => {
    setLocalSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      navigate(`/?search=${encodeURIComponent(localSearch.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <span className="text-3xl font-medium text-black tracking-tight">
                LibraryHub
              </span>
            </Link>
          </div>


          {/* Right Side: Search + Menu */}
          <div className="hidden md:flex items-center flex-1 justify-end space-x-6 ml-8">
            {/* Navbar Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-[260px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2.5 rounded-full border border-black bg-slate-50 text-black text-sm focus:border-black focus:ring-1 focus:ring-black focus:outline-none transition-all placeholder-slate-400"
                placeholder="Search books..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </form>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 mx-2 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-slate-300" />

            {/* Desktop Menu */}
            <div className="flex items-center space-x-6 shrink-0">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 text-primary hover:bg-blue-100 border border-blue-100 transition-all font-medium">
                  <span>My Library</span>
                </Link>
                <div className="h-6 w-px bg-slate-200" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-all font-medium border border-slate-200 hover:border-red-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/login" className="font-bold text-slate-600 hover:text-primary transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 rounded-full bg-primary hover:bg-blue-700 text-white font-bold shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 shadow-xl absolute w-full left-0"
          >
            <div className="px-6 pt-4 pb-8 space-y-3">
              {/* Mobile Search */}
              <form onSubmit={(e) => { handleSearchSubmit(e); setIsOpen(false); }} className="relative w-full mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-black text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-slate-400"
                  placeholder="Search books..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                />
              </form>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-lg font-medium text-black hover:bg-blue-50 hover:text-primary"
                  >
                    My Library
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-xl text-lg font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-lg font-bold text-black hover:bg-slate-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-lg font-bold bg-primary text-white text-center mt-6 shadow-md shadow-primary/20"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
