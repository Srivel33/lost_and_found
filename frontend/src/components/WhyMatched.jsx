import React from 'react';
import { GitCompare } from 'lucide-react';

export const WhyMatched = ({ reason }) => {
  if (!reason) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50/70 px-2.5 py-1.5 rounded-lg border border-indigo-100/80">
      <GitCompare className="w-3.5 h-3.5 flex-shrink-0 text-indigo-500" />
      <span className="font-medium">Why matched: <span className="font-normal text-slate-700">{reason}</span></span>
    </div>
  );
};
