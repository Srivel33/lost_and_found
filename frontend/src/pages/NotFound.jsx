import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-slate-600 max-w-md mb-6 text-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/home"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Return Home</span>
      </Link>
    </div>
  );
};
