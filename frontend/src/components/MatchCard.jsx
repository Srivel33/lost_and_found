import React from 'react';
import { Link } from 'react-router-dom';
import { ConfidenceBadge } from './ConfidenceBadge';
import { StatusPill } from './StatusPill';
import { WhyMatched } from './WhyMatched';
import { formatDate } from '../utils/format';
import { MapPin, Calendar, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const MatchCard = ({ match }) => {
  const isVerified = match.status === 'verified' || match.status === 'confirmed' || match.status === 'claimed' || match.status === 'returned';

  return (
    <div className="card-surface hover:shadow-card-hover transition-all duration-200 p-6 flex flex-col justify-between gap-5">
      <div className="space-y-4">
        
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
              {match.category}
            </span>
            <StatusPill status={match.status} />
          </div>
          <ConfidenceBadge band={match.band} score={match.score} />
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
            Match for: {match.lostItemName}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Reported found on campus
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            <span className="truncate">Found at: <strong className="text-slate-800">{match.location || 'Campus'}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            <span>{formatDate(match.timeFound, 'dd MMM, hh:mm a')}</span>
          </div>
        </div>

        {/* Why Matched explanation */}
        <div>
          <WhyMatched reason={match.whyMatched} />
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs">
          {isVerified ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Contact Unlocked</span>
            </span>
          ) : (
            <span className="text-slate-400 font-medium">Verification required</span>
          )}
        </div>

        <Link
          to={`/matches/${match.id}`}
          className="btn-primary text-xs h-9 px-4 shadow-none"
        >
          <span>{isVerified ? 'View Contact' : 'Review Match'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
