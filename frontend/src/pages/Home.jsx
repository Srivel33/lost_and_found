import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Search, PlusCircle, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Clock, Layers } from 'lucide-react';

export const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myLostCount: 0,
    myFoundCount: 0,
    matchesCount: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [lost, found, matches] = await Promise.all([
          api.getMyLost(),
          api.getMyFound(),
          api.getMyMatches()
        ]);
        setStats({
          myLostCount: (lost || []).filter(p => p.status === 'open' || p.status === 'matched').length,
          myFoundCount: (found || []).filter(p => p.status === 'open' || p.status === 'matched').length,
          matchesCount: (matches || []).filter(m => m.status === 'pending' || m.status === 'verified').length
        });
      } catch {
        // ignore
      }
    };
    loadStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Active Student Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome, {user?.name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Campus ID: <span className="font-mono font-medium text-slate-700">{user?.regNumber}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/matches"
            className="btn-secondary text-xs h-10 px-4"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>View Matches</span>
          </Link>
          <Link
            to="/my-posts"
            className="btn-secondary text-xs h-10 px-4"
          >
            <Layers className="w-4 h-4 text-slate-600" />
            <span>My Posts</span>
          </Link>
        </div>
      </div>

      {/* Two Equal Action Cards: LOST & FOUND */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LOST CARD */}
        <Link
          to="/lost"
          className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-rose-300 transition-all duration-200 p-6 sm:p-8 flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                <Search className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-full">
                Lost Item
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                I Lost Something
              </h2>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                Report misplaced belongings with category, color, location, and timeframe. We'll automatically find and score potential matches.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-600 group-hover:text-rose-700">
            <span>Report Lost Item</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* FOUND CARD */}
        <Link
          to="/found"
          className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-emerald-300 transition-all duration-200 p-6 sm:p-8 flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                Found Item
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                I Found Something
              </h2>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                Log a discovered item with anti-fraud challenge verification. Your contact info stays encrypted until the real owner proves ownership.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600 group-hover:text-emerald-700">
            <span>Report Found Item</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>

      {/* Your Activity Summary Row */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Your Activity Snapshot
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-surface p-5 flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.myLostCount}</p>
              <p className="text-xs text-slate-500 font-medium">Active Lost Reports</p>
            </div>
          </div>

          <div className="card-surface p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.myFoundCount}</p>
              <p className="text-xs text-slate-500 font-medium">Active Found Items</p>
            </div>
          </div>

          <div className="card-surface p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.matchesCount}</p>
              <p className="text-xs text-slate-500 font-medium">Pending Matches to Review</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Step Safety Workflow Strip */}
      <div className="card-surface space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900">
            How Campus Lost & Found Works Safely
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            A three-step cryptographic matching process designed for zero public exposure and fraud prevention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-800">1. Submit Post</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Lost items or found valuables are recorded with precise category, time window, and campus zone metadata.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-800">2. Smart Matching</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multi-factor confidence scoring pairs compatible lost reports and found listings privately in real-time.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-800">3. Verify & Return</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The owner answers the secret challenge question. Upon verification, finder contact details unlock for a safe campus hand-off.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
