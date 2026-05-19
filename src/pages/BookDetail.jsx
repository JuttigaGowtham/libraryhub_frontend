import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Star, Book as BookIcon, ArrowLeft, Heart, Clock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedBooks, setRelatedBooks] = useState([]);

  useEffect(() => {
    const fetchBookAndRelated = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/books/${id}`);
        setBook(data);
        
        // Check if favorite
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.some(f => f.id === data.id));

        // Fetch related
        const relatedRes = await API.get(`/books?genre=${data.genre}&limit=4`);
        setRelatedBooks(relatedRes.data.books.filter(b => b.id !== data.id).slice(0, 3));
      } catch (error) {
        toast.error('Failed to load book details');
      }
      setLoading(false);
    };
    
    fetchBookAndRelated();
    window.scrollTo(0, 0);
  }, [id]);

  const handleBorrow = async () => {
    if (!user) {
      toast.info('Please log in to borrow books');
      navigate('/login');
      return;
    }
    
    setBorrowing(true);
    try {
      await API.post('/borrowings', { bookId: book.id });
      toast.success(`Successfully borrowed ${book.title}!`);
      // Update local state
      setBook(prev => ({ ...prev, availableCopies: prev.availableCopies - 1 }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to borrow book');
    }
    setBorrowing(false);
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const newFavs = favorites.filter(f => f.id !== book.id);
      localStorage.setItem('favorites', JSON.stringify(newFavs));
      toast.info('Removed from favorites');
    } else {
      favorites.push({ id: book.id, title: book.title, coverUrl: book.coverUrl });
      localStorage.setItem('favorites', JSON.stringify(favorites));
      toast.success('Added to favorites');
    }
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Book not found</h2>
        <Link to="/" className="text-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-black transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Library
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Book Cover */}
        <div className="md:col-span-5 lg:col-span-4 max-w-sm mx-auto md:max-w-none w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden aspect-[2/3] relative shadow-xl border border-slate-200 bg-white"
          >
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                <BookIcon className="w-20 h-20 text-slate-300" />
              </div>
            )}
            <div className="absolute top-4 right-4 bg-white shadow-md rounded-full px-3 py-1.5 flex items-center gap-1.5 text-black font-bold text-sm border border-slate-100">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              {book.rating.toFixed(1)}
            </div>
          </motion.div>
        </div>

        {/* Book Info */}
        <div className="md:col-span-7 lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-1.5 bg-blue-50 text-primary font-bold rounded-full text-sm border border-blue-100">
                {book.genre}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <Clock className="w-4 h-4" /> Published 2023
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-black leading-[1.1] tracking-tight">
              {book.title}
            </h1>
            
            <p className="text-xl text-slate-500 font-medium">
              By <span className="text-primary font-medium">{book.author}</span>
            </p>
          </div>

          <div className="prose max-w-none text-slate-600">
            <p className="text-lg leading-relaxed font-medium">{book.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 py-6 border-y border-slate-200">
            <div className="flex flex-col">
              <span className="text-sm text-slate-500 font-medium mb-1">Availability</span>
              <span className="font-bold text-xl flex items-center gap-2 text-black">
                <span className={`w-3 h-3 rounded-full ${book.availableCopies > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {book.availableCopies} of {book.totalCopies} copies
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={handleBorrow}
              disabled={borrowing || book.availableCopies === 0}
              className="flex-1 md:flex-none px-8 py-4 bg-primary hover:bg-blue-700 text-white rounded-xl font-medium text-lg shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 flex justify-center items-center gap-2"
            >
              {borrowing ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookIcon className="w-5 h-5" />}
              {book.availableCopies === 0 ? 'Join Waitlist' : 'Borrow Book'}
            </button>
            
            <button
              onClick={toggleFavorite}
              className={`px-6 py-4 rounded-xl border-2 font-bold text-lg flex justify-center items-center gap-2 transition-all hover:-translate-y-0.5 ${
                isFavorite 
                  ? 'border-red-500 text-red-500 bg-red-50' 
                  : 'border-slate-200 hover:border-slate-300 text-black bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className="pt-16 mt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-medium text-black tracking-tight">More like this in {book.genre}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedBooks.map(relatedBook => (
              <Link 
                key={relatedBook.id} 
                to={`/books/${relatedBook.id}`}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden p-3 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="aspect-[2/3] rounded-xl overflow-hidden mb-4 relative">
                  {relatedBook.coverUrl ? (
                    <img src={relatedBook.coverUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <BookIcon className="w-8 h-8 opacity-20" />
                    </div>
                  )}
                </div>
                <div className="px-1">
                  <h3 className="font-medium text-lg leading-tight mb-1 text-black line-clamp-1 group-hover:text-primary transition-colors">{relatedBook.title}</h3>
                  <p className="text-sm font-medium text-slate-500">{relatedBook.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
