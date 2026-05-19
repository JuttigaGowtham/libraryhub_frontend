import React from 'react';
import { Link } from 'react-router-dom';
import { FiTwitter as Twitter, FiInstagram as Instagram, FiGithub as Github, FiLinkedin as Linkedin } from 'react-icons/fi';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 group mb-6">
              <span className="text-3xl font-medium text-black tracking-tight">
                LibraryHub
              </span>
            </Link>
            <p className="text-slate-600 font-medium max-w-sm leading-relaxed mb-6">
              The ultimate platform to track your reading journey. Immerse yourself in millions of stories and discover your next favorite book.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary hover:border-blue-200 transition-colors shadow-sm">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary hover:border-blue-200 transition-colors shadow-sm">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary hover:border-blue-200 transition-colors shadow-sm">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-black text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 font-medium text-slate-600">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">My Library</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-black text-lg mb-6">Legal</h4>
            <ul className="space-y-4 font-medium text-slate-600">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 font-medium text-sm">
            &copy; {new Date().getFullYear()} LibraryHub. All rights reserved.
          </p>
          <p className="text-slate-500 font-medium text-sm flex items-center gap-1">
            Built with <span className="text-red-500">♥</span> for book lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
