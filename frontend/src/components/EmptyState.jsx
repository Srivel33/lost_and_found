import React from 'react';
import { SearchX } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = SearchX,
  title = 'No items found',
  description = "No matches yet. We'll notify you when one is found.",
  action
}) => {
  return (
    <div className="py-12 px-6 text-center bg-white rounded-3xl border border-slate-200/90 shadow-card flex flex-col items-center max-w-lg mx-auto animate-fadeIn">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-100 to-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4 shadow-xs">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
