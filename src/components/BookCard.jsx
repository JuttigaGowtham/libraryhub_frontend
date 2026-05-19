import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Book } from 'lucide-react';
import { motion } from 'framer-motion';

const BookCard = ({ book }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col glass-panel rounded-2xl overflow-hidden h-full"
    >
      <Link to={`/books/${book.id}`} className="block relative aspect-[2/3] overflow-hidden bg-slate-200 dark:bg-slate-800">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Book className="w-16 h-16 opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          {book.rating.toFixed(1)}
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">
            {book.genre}
          </span>
          {book.availableCopies === 0 && (
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              Unavailable
            </span>
          )}
        </div>
        
        <Link to={`/books/${book.id}`} className="group-hover:text-primary transition-colors">
          <h3 className="font-medium text-lg leading-tight mb-1 line-clamp-1" title={book.title}>
            {book.title}
          </h3>
        </Link>
        
        <p className="text-slate-500 dark:text-black text-sm mb-4 line-clamp-1">
          {book.author}
        </p>
        
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {book.availableCopies > 0 ? (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {book.availableCopies} available
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Waitlist
              </span>
            )}
          </span>
          <Link
            to={`/books/${book.id}`}
            className="text-sm font-semibold text-primary hover:text-secondary transition-colors"
          >
            Details &rarr;
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
