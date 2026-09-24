import React from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';

export const HandoverCode = ({ code }) => {
  if (!code) return null;

  return (
    <div className="card-surface p-6 space-y-4 border border-emerald-100 bg-emerald-50/30">
      <div className="flex items-center gap-2">
        <div className="bg-emerald-100 p-2 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Digital Handover Verification</h3>
          <p className="text-xs text-slate-500">Show this code to the finder or security desk to claim your item.</p>
        </div>
      </div>

      <div className="bg-white border border-emerald-200 rounded-xl p-4 flex flex-col items-center justify-center space-y-2 shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Verification Code</span>
        <div className="flex items-center gap-3 font-mono text-3xl font-black text-slate-800 tracking-[0.2em]">
          <KeyRound className="w-6 h-6 text-emerald-400 -ml-2" />
          {code.slice(0, 3)}-{code.slice(3, 6)}
        </div>
        <p className="text-[10px] text-slate-400 text-center max-w-[200px] mt-2">
          This code is unique to this match and acts as proof of ownership.
        </p>
      </div>
    </div>
  );
};
