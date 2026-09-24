import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { MatchCard } from '../components/MatchCard';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/Skeleton';
import { Bell, Sparkles, RefreshCw, PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await api.getMyMatches();
      setMatches(data || []);
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Multi-Factor Matching</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Possible Matches for Your Lost Items
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review potential matches and verify secret questions to unlock finder contacts.
          </p>
        </div>

        <button
          onClick={fetchMatches}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-44 w-full" count={3} />
        </div>
      ) : matches.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matches found yet"
          description="We compare your lost items with every found report. When a match score passes our safety threshold, it will appear here."
          action={
            <Link
              to="/lost"
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report a Lost Item</span>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
};
