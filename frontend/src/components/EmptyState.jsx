import React from 'react';
import { SearchX } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = SearchX,
  title = 'No items found',
  description = "No matches yet. We'll notify you when one is found.",
  action
}) => {
  return (
    <div className="py-12 px-4 text-center bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
