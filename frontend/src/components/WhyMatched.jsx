import React from 'react';
import { GitCompare } from 'lucide-react';

export const WhyMatched = ({ reason }) => {
  if (!reason) return null;

  // Check if comma-separated or single sentence
  const reasons = reason.includes(',') 
    ? reason.split(',').map(r => r.trim()).filter(Boolean)
    : [reason];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        <GitCompare className="w-3.5 h-3.5 text-indigo-600" />
        <span>Match Factors</span>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {reasons.map((r, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50/80 text-indigo-900 border border-indigo-100"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
            <span>{r}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
