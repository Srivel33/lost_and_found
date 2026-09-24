import React from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { Lock, AlertCircle } from 'lucide-react';

export const CooldownBanner = ({ lockoutUntil }) => {
  const { timeLeft, isExpired } = useCountdown(lockoutUntil);

  if (isExpired) return null;

  return (
    <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 shadow-sm flex items-start sm:items-center justify-between gap-4 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-rose-200/80 rounded-xl text-rose-700 flex-shrink-0">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-900">Verification Locked</h4>
          <p className="text-xs text-rose-700 mt-0.5">
            Maximum incorrect attempts reached. Verification will unlock in:
          </p>
        </div>
      </div>
      <div className="bg-white px-3.5 py-2 rounded-xl border border-rose-300 shadow-inner font-mono text-base font-extrabold text-rose-600 tracking-wider">
        {timeLeft}
      </div>
    </div>
  );
};
