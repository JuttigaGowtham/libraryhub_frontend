import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import BookCard from '../components/BookCard';
import { Search, Loader2, Sparkles, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import libraryImage from '../assets/library.jpg';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const genres = ['Fiction', 'Sci-Fi', 'Classic', 'Dystopian', 'Romance', 'Mystery', 'Fantasy'];

  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const { data } = await API.get('/books/top');
        setTopBooks(data);
      } catch (error) {
        console.error('Error fetching top books', error);
      }
    };
    fetchTopBooks();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/books?page=${page}&search=${search}&genre=${genre}`);
        setBooks(data.books);
        setTotalPages(data.pages);
      } catch (error) {
        console.error('Error fetching books', error);
      }
      setLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      fetchBooks();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, genre, page]);

  useEffect(() => {
    setPage(1);
  }, [search, genre]);

  return (
    <div className="pb-20">
      {/* Premium Hero Section */}
      <section className="relative -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 px-6 pt-16 pb-12 md:pt-24 md:pb-16 bg-white overflow-hidden border-b border-slate-100 mb-8">
        {/* Subtle Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full lg:w-1/2 text-left"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium text-black mb-6 leading-tight tracking-tight">
              The world's best books, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                all in one place.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-black mb-10 max-w-2xl leading-relaxed font-medium">
              Immerse yourself in millions of stories. From timeless classics to modern bestsellers, find exactly what you're looking for. Keep track of your reading progress, explore personalized recommendations, and dive into a world of limitless knowledge and imagination.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-1/2 mt-8 lg:mt-0"
          >
            <img
              src={libraryImage}
              alt="Library"
              className="w-full h-auto max-h-[300px] sm:max-h-[400px] lg:max-h-[500px]"
            />
          </motion.div>
        </div>
      </section>

      {/* Categories (Horizontal Pills) */}
      <section className="max-w-7xl mx-auto mb-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <button
            onClick={() => {
              setGenre('');
              setPage(1);
            }}
            className={`flex-shrink-0 px-6 py-3 rounded-full font-bold transition-all ${genre === ''
              ? 'bg-black text-white shadow-lg shadow-black/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-black text-medium'
              }`}
          >
            All Categories
          </button>
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => {
                setGenre(g);
                setPage(1);
              }}
              className={`flex-shrink-0 px-6 py-3 rounded-full font-bold transition-all ${genre === g
                ? 'bg-black text-white shadow-lg shadow-black/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-black text-medium'
                }`}
            >
              {g}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* Left Column: Books List (Visual Right on Desktop) */}
        <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4 font-medium">
            <h2 className="text-3xl font-medium text-black">
              {search ? `Search Results for "${search}"` : genre ? `${genre} Collection` : 'Featured Books'}
            </h2>
            <span className="text-slate-500 font-medium">Page {page} of {totalPages}</span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : books.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {books.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <BookCard book={book} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-16">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-6 py-3 rounded-full border border-slate-200 font-bold text-black disabled:opacity-30 hover:bg-slate-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-6 py-3 rounded-full border border-slate-200 font-bold text-black disabled:opacity-30 hover:bg-slate-50 transition-colors"
                  >
                    Next Page
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-32 bg-slate-50 rounded-3xl border border-slate-100">
              <BookOpen className="w-20 h-20 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-black mb-2">No books found</h3>
              <p className="text-slate-500 text-lg">Try adjusting your search or selecting a different category.</p>
            </div>
          )}
        </div>

        {/* Right Column: Trending Sidebar (Visual Left on Desktop) */}
        {!search && !genre && (
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sticky top-24">
              <div className="flex items-center gap-3 mb-8">
                <h3 className="text-2xl font-medium text-black">Trending Now</h3>
              </div>

              <div className="space-y-6">
                {topBooks.slice(0, 5).map((book, index) => (
                  <div key={book.id} className="flex gap-4 group cursor-pointer">
                    <span className="text-2xl font-extrabold text-slate-200 group-hover:text-primary transition-colors">
                      0{index + 1}
                    </span>
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded-md shadow-sm border border-slate-100"
                    />
                    <div className="flex flex-col py-1">
                      <h4 className="font-medium text-black leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-1">
                        {book.title}
                      </h4>
                      <p className="text-sm text-slate-500">{book.author}</p>
                      <div className="mt-auto flex items-center text-xs font-bold text-slate-400">
                        <StarIcon className="w-3 h-3 text-yellow-400 mr-1" />
                        {book.rating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 py-4 bg-slate-50 hover:bg-slate-100 text-black font-medium rounded-xl transition-colors border border-slate-200 flex items-center justify-center gap-2">
                View all charts <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

// Helper component for stars since we removed it from imports to avoid clutter
const StarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

export default Home;
