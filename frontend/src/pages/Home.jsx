import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Bell, ArrowRight, ShieldCheck } from 'lucide-react';

export const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Welcome header */}
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hello, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Campus ID: <span className="font-mono font-medium text-slate-800">{user?.regNumber}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/matches"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-xl transition-colors border border-indigo-200"
          >
            <Bell className="w-4 h-4" />
            <span>View Matches</span>
          </Link>
          <Link
            to="/my-posts"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors border border-slate-200"
          >
            <span>My Posts</span>
          </Link>
        </div>
      </div>

      {/* Two Big Action Cards: LOST & FOUND */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        {/* LOST CARD */}
        <Link
          to="/lost"
          className="group relative overflow-hidden bg-gradient-to-br from-rose-500 to-red-600 rounded-3xl p-8 text-white shadow-xl shadow-red-200 hover:shadow-2xl hover:shadow-red-300 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between min-h-[240px]"
        >
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
          <div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 text-white shadow-inner">
              <Search className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
              I Lost Something
            </span>
            <h2 className="text-3xl font-extrabold mt-3 text-white tracking-tight">
              LOST ITEM
            </h2>
            <p className="text-red-100 text-sm mt-2 leading-relaxed">
              Report your misplaced belongings. We’ll automatically match them with found reports.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-bold text-white group-hover:translate-x-1 transition-transform">
            <span>Report Lost Item</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* FOUND CARD */}
        <Link
          to="/found"
          className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-300 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between min-h-[240px]"
        >
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
          <div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 text-white shadow-inner">
              <PlusCircle className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
              I Found Something
            </span>
            <h2 className="text-3xl font-extrabold mt-3 text-white tracking-tight">
              FOUND ITEM
            </h2>
            <p className="text-emerald-100 text-sm mt-2 leading-relaxed">
              Help a classmate recover their item with a fraud-proof hidden challenge question.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-bold text-white group-hover:translate-x-1 transition-transform">
            <span>Report Found Item</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Safety & Privacy Notice */}
      <div className="mt-10 p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 flex-shrink-0 mt-0.5 sm:mt-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Privacy-First Campus Protection</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Found items are never broadcast publicly. Contact details stay hidden until the owner passes the secret question.
            </p>
          </div>
        </div>
        <Link
          to="/privacy"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 whitespace-nowrap"
        >
          Learn about our privacy safeguards &rarr;
        </Link>
      </div>
    </div>
  );
};
