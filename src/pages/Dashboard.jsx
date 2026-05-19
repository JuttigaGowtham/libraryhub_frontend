import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { FiBook as Book, FiClock as Clock, FiCheckCircle as CheckCircle, FiAlertCircle as AlertCircle, FiLoader as Loader2, FiArrowRight as ArrowRight, FiArrowLeft as ArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [historyRes, analyticsRes] = await Promise.all([
            API.get(`/members/${user.id}/history`),
            API.get(`/progress/analytics/member/${user.id}`)
          ]);
          setHistory(historyRes.data);
          setAnalytics(analyticsRes.data);
        } catch (error) {
          toast.error('Failed to load dashboard data');
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [user]);

  const handleReturn = async (borrowingId) => {
    setReturningId(borrowingId);
    try {
      await API.put(`/borrowings/${borrowingId}/return`);
      toast.success('Book returned successfully!');
      
      // Update local state
      setHistory(prev => prev.map(h => 
        h.id === borrowingId ? { ...h, status: 'Returned', returnDate: new Date().toISOString() } : h
      ));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return book');
    }
    setReturningId(null);
  };

  const updateProgress = async (borrowingId, pagesRead) => {
    try {
      await API.post('/progress', { borrowingId, pagesRead });
      toast.success('Progress updated!');
      // Update analytics state
      setAnalytics(prev => {
        const historyItem = history.find(h => h.id === borrowingId);
        const targetBookId = historyItem?.Book?._id || historyItem?.Book?.id || historyItem?.book;
        
        const exists = prev.some(a => a.bookId === targetBookId);
        const newProgressPercentage = Math.round((pagesRead / (historyItem?.Book?.totalPages || 100)) * 100);

        if (exists) {
          return prev.map(a => 
            a.bookId === targetBookId 
              ? { ...a, pagesRead, progressPercentage: newProgressPercentage }
              : a
          );
        } else {
          // If progress was just created for the first time, append it
          return [...prev, {
            bookId: targetBookId,
            pagesRead,
            totalPages: historyItem?.Book?.totalPages || 100,
            progressPercentage: newProgressPercentage
          }];
        }
      });
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const activeBorrowings = history.filter(h => h.status === 'Active');
  const pastBorrowings = history.filter(h => h.status !== 'Active');

  return (
    <div className="space-y-12 pb-20">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-black transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Library
      </Link>
      
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-[2rem] bg-white border border-blue-100 shadow-xl shadow-blue-900/5 px-8 py-16 md:px-12 md:py-20 text-left">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-blue-50/80 via-white to-white -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 -z-10" />

        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-medium text-black mb-4 tracking-tight">
            Welcome back, <span className="text-primary">{user.name}</span>!
          </h1>
          <p className="text-lg font-medium text-slate-600 mb-10">
            Here's a snapshot of your current reading activity and history.
          </p>

          <div className="flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:border-primary/30 transition-colors">
              <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
                <Book className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Currently Reading</p>
                <p className="text-3xl font-medium text-black leading-none">{activeBorrowings.length}</p>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:border-green-500/30 transition-colors">
              <div className="p-3.5 bg-green-50 text-green-600 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Books Finished</p>
                <p className="text-3xl font-medium text-black leading-none">{pastBorrowings.length}</p>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:border-orange-500/30 transition-colors">
              <div className="p-3.5 bg-orange-50 text-orange-600 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Overdue</p>
                <p className="text-3xl font-medium text-black leading-none">
                  {activeBorrowings.filter(b => new Date(b.dueDate) < new Date()).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Active Borrowings */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4">
            <div className="p-2 bg-blue-50 text-primary rounded-xl">
              <Book className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-medium text-black tracking-tight">Active Borrowings</h2>
          </div>
          
          {activeBorrowings.length > 0 ? (
            <div className="space-y-6">
              {activeBorrowings.map((borrowing) => {
                const isOverdue = new Date(borrowing.dueDate) < new Date();
                const targetBookId = borrowing.Book?._id || borrowing.Book?.id || borrowing.book;
                const bookAnalytics = analytics.find(a => a.bookId === targetBookId);
                const progress = bookAnalytics ? bookAnalytics.progressPercentage : 0;
                
                return (
                  <motion.div 
                    key={borrowing.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col md:flex-row gap-8 items-start md:items-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    {borrowing.Book.coverUrl ? (
                      <img src={borrowing.Book.coverUrl} className="w-24 h-36 object-cover rounded-xl shadow-md border border-slate-100 shrink-0" />
                    ) : (
                      <div className="w-24 h-36 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 border border-slate-200">
                        <Book className="w-10 h-10 text-slate-300" />
                      </div>
                    )}
                    
                    <div className="flex-1 space-y-4 w-full">
                      <Link to={`/books/${borrowing.Book.id}`}>
                        <h3 className="text-2xl font-medium text-black hover:text-primary transition-colors leading-tight">
                          {borrowing.Book.title}
                        </h3>
                      </Link>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 font-medium text-sm px-3 py-1.5 rounded-lg ${
                          isOverdue ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-primary border border-blue-100'
                        }`}>
                          {isOverdue ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          Due: {new Date(borrowing.dueDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-2 max-w-sm pt-2">
                        <div className="flex justify-between text-sm font-medium text-slate-600">
                          <span>Reading Progress</span>
                          <span className="text-primary">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                          <div 
                            className="bg-primary h-3 rounded-full transition-all duration-1000" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-auto flex flex-row md:flex-col gap-3 shrink-0 mt-4 md:mt-0 border-t border-slate-100 md:border-t-0 pt-4 md:pt-0">
                      <button
                        onClick={() => {
                          const newPages = prompt('Enter pages read:', bookAnalytics?.pagesRead || 0);
                          if (newPages !== null) updateProgress(borrowing.id, parseInt(newPages));
                        }}
                        className="flex-1 md:flex-none px-5 py-3 rounded-xl font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-black transition-colors"
                      >
                        Update Progress
                      </button>
                      <button
                        onClick={() => handleReturn(borrowing.id)}
                        disabled={returningId === borrowing.id}
                        className="flex-1 md:flex-none px-5 py-3 rounded-xl font-medium bg-primary hover:bg-blue-700 text-white shadow-md shadow-primary/20 transition-all flex justify-center items-center gap-2"
                      >
                        {returningId === borrowing.id ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Return Book'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
              <Book className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4 font-medium text-lg">You don't have any active borrowings right now.</p>
              <Link to="/" className="inline-flex items-center gap-2 text-primary font-medium hover:underline text-lg">
                Browse Books <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>

        {/* Reading History Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sticky top-28">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
              <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-medium text-black">History</h2>
            </div>
            
            {pastBorrowings.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {pastBorrowings.slice(0, 5).map(borrowing => (
                  <div key={borrowing.id} className="py-4 flex gap-4 items-center group cursor-pointer">
                    {borrowing.Book.coverUrl ? (
                      <img src={borrowing.Book.coverUrl} className="w-14 h-20 object-cover rounded-md shadow-sm border border-slate-100" />
                    ) : (
                      <div className="w-14 h-20 bg-slate-100 rounded-md flex items-center justify-center border border-slate-200">
                        <Book className="w-6 h-6 text-slate-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <Link to={`/books/${borrowing.Book.id}`}>
                        <h4 className="font-medium text-black group-hover:text-primary transition-colors truncate mb-1">
                          {borrowing.Book.title}
                        </h4>
                      </Link>
                      <p className="text-xs font-medium text-slate-500">
                        Returned: {new Date(borrowing.returnDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 font-medium bg-slate-50 rounded-2xl border border-slate-100">
                Your reading history will appear here.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
