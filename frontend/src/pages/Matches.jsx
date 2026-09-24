import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { MatchCard } from '../components/MatchCard';
import { EmptyState } from '../components/EmptyState';
import { Skeleton } from '../components/Skeleton';
import { PageHeader } from '../components/PageHeader';
import { Sparkles, RefreshCw, PlusCircle, Search } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      
      {/* Header */}
      <PageHeader
        badge="Multi-Factor Confidence Matching"
        badgeIcon={Sparkles}
        title="Possible Matches for Your Lost Items"
        subtitle="Review potential matches scored by category, time, and zone. Complete the finder's challenge question to unlock contact info."
      >
        <button
          onClick={fetchMatches}
          disabled={loading}
          className="btn-secondary text-xs h-10 px-4"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </PageHeader>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" count={2} />
        </div>
      ) : matches.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Potential Matches Found"
          description="We continuously evaluate newly reported campus items against your lost postings. As soon as a match passes the confidence threshold, it will appear here."
          action={
            <Link
              to="/lost"
              className="btn-danger text-xs h-10 px-5 inline-flex"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Another Lost Item</span>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
};
