import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const ConfidenceBadge = ({ band, score }) => {
  const isHigh = band === 'High' || band === 'high' || (score && score >= 0.8);
  const percentage = score ? Math.round(score * 100) : null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-xs select-none transition-transform duration-150 ${
        isHigh
          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300/80 shadow-emerald-500/10'
          : 'bg-indigo-50 text-indigo-800 border border-indigo-200 shadow-indigo-500/10'
      }`}
      role="status"
      aria-label={`Match Confidence: ${isHigh ? 'High Match' : 'Medium Match'}`}
    >
      {isHigh ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
      )}
      <span>{isHigh ? 'High Match' : 'Likely Match'}</span>
      {percentage && (
        <span className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
          isHigh ? 'bg-emerald-200/80 text-emerald-900' : 'bg-indigo-200/80 text-indigo-900'
        }`}>
          {percentage}%
        </span>
      )}
    </div>
  );
};
