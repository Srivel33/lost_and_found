import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const PrivacyTip = ({ text, type = 'info' }) => {
  const isWarning = type === 'warning';

  return (
    <div
      className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
        isWarning
          ? 'bg-amber-50/80 border-amber-200 text-amber-900'
          : 'bg-indigo-50/80 border-indigo-200 text-indigo-900'
      }`}
    >
      {isWarning ? (
        <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
      ) : (
        <Info className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
      )}
      <div className="leading-relaxed font-medium">{text}</div>
    </div>
  );
};
