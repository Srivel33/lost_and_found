import React from 'react';
import { getRetentionInfo } from '../utils/format';
import { Clock } from 'lucide-react';

export const RetentionLabel = ({ createdAt, returnedAt, status }) => {
  const { label } = getRetentionInfo(createdAt, returnedAt, status);

  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200"
      title="Automatic privacy data deletion policy"
    >
      <Clock className="w-3 h-3 text-slate-400" />
      <span>{label}</span>
    </span>
  );
};
