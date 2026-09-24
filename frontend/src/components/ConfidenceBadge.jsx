import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const ConfidenceBadge = ({ band }) => {
  const isHigh = band === 'High' || band === 'high';

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm select-none ${
        isHigh
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          : 'bg-amber-100 text-amber-800 border border-amber-300'
      }`}
      role="status"
      aria-label={`Match Confidence: ${isHigh ? 'High Match' : 'Medium Match'}`}
    >
      {isHigh ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
      ) : (
        <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
      )}
      <span>{isHigh ? 'High Confidence' : 'Medium Confidence'}</span>
    </div>
  );
};
