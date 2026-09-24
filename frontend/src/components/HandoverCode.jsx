import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Copy, Check, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export const HandoverCode = ({ code }) => {
  const [copied, setCopied] = useState(false);

  if (!code) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Handover code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedCode = `${code.slice(0, 3)}-${code.slice(3, 6)}`;

  return (
    <div className="card-surface p-6 space-y-4 border border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 shadow-card">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-100/80 p-2.5 rounded-xl border border-emerald-200/60 text-emerald-700 shadow-xs">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Official Handover Code</h3>
          <p className="text-xs text-slate-500 mt-0.5">Show or state this 6-digit code to the finder to verify ownership.</p>
        </div>
      </div>

      <div className="bg-white border border-emerald-200 rounded-2xl p-5 flex flex-col items-center justify-center space-y-3 shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          Cryptographic Ownership Token
        </span>

        <div className="flex items-center gap-3 font-mono text-3xl sm:text-4xl font-black text-slate-900 tracking-[0.25em]">
          <KeyRound className="w-7 h-7 text-emerald-500 -ml-2" />
          {formattedCode}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
            copied
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied Code</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy 6-Digit Code</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/60">
        <Info className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
        <span>For safety, meet in an open campus location (e.g. Library Desk or Food Court) when exchanging the item.</span>
      </div>
    </div>
  );
};
