import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-5 shadow-xs border border-indigo-100">
        <HelpCircle className="w-8 h-8" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-slate-600 max-w-sm mb-6 text-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/home"
        className="btn-primary text-xs h-11 px-6 shadow-sm"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
