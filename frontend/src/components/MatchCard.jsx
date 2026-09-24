import React from 'react';
import { Link } from 'react-router-dom';
import { ConfidenceBadge } from './ConfidenceBadge';
import { StatusPill } from './StatusPill';
import { WhyMatched } from './WhyMatched';
import { formatDate } from '../utils/format';
import { MapPin, Calendar, ArrowRight, ShieldAlert } from 'lucide-react';

export const MatchCard = ({ match }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
              {match.category}
            </span>
            <StatusPill status={match.status} />
          </div>
          <ConfidenceBadge band={match.band} />
        </div>

        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Match for: {match.lostItemName}
        </h3>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span>Found at: <strong className="text-slate-800">{match.location || 'Campus'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span>{formatDate(match.timeFound, 'dd MMM, hh:mm a')}</span>
          </div>
        </div>

        <div className="mt-3">
          <WhyMatched reason={match.whyMatched} />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="text-[11px] text-slate-400">
          {match.status === 'verified' ? (
            <span className="text-emerald-600 font-semibold">Contact Unlocked</span>
          ) : (
            <span>Anti-fraud verification pending</span>
          )}
        </div>
        <Link
          to={`/matches/${match.id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
        >
          <span>{match.status === 'verified' ? 'View Contact' : 'Verify & Unlock'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
