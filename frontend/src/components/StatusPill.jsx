import React from 'react';

const STATUS_CONFIGS = {
  open: {
    label: 'Open',
    classes: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  matched: {
    label: 'Matched',
    classes: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  claimed: {
    label: 'Claimed',
    classes: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  returned: {
    label: 'Returned',
    classes: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  withdrawn: {
    label: 'Withdrawn',
    classes: 'bg-slate-100 text-slate-700 border-slate-300'
  },
  expired: {
    label: 'Expired',
    classes: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  verified: {
    label: 'Question Verified',
    classes: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  pending: {
    label: 'Verification Pending',
    classes: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  rejected: {
    label: 'Declined',
    classes: 'bg-slate-100 text-slate-600 border-slate-200'
  }
};

export const StatusPill = ({ status = 'open' }) => {
  const norm = (status || 'open').toLowerCase();
  const config = STATUS_CONFIGS[norm] || STATUS_CONFIGS.open;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${config.classes}`}
    >
      {config.label}
    </span>
  );
};
