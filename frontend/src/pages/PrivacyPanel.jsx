import React from 'react';
import { ShieldCheck, Lock, EyeOff, Trash2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

export const PrivacyPanel = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      
      {/* Back Link & Header */}
      <div>
        <Link
          to="/home"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <PageHeader
          badge="Security Architecture"
          badgeIcon={ShieldCheck}
          title="Privacy Safeguards & Data Policy"
          subtitle="How Campus Lost & Found protects your personal student identity, prevents fraud, and enforces automated data purges."
        />
      </div>

      {/* 3 Main Pillars */}
      <div className="space-y-6">
        
        {/* Section 1: What We Store */}
        <div className="card-surface space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                1. What We Store & Verify
              </h2>
              <p className="text-xs text-slate-500">
                Minimal data collection required strictly for identity verification.
              </p>
            </div>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800">College Credentials:</strong> Verified @college.edu email and student registration number to confirm active campus enrollment.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800">Post Metadata:</strong> Category, color, approximate campus zone, and time intervals to compute matching scores.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800">Temporary Session Tokens:</strong> Stored strictly in <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">sessionStorage</code> (never in URLs or permanent trackers) with an automatic 1-hour expiration.
              </span>
            </li>
          </ul>
        </div>

        {/* Section 2: What Stays Hidden */}
        <div className="card-surface space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                2. What Stays Hidden (Zero Public Listings)
              </h2>
              <p className="text-xs text-slate-500">
                Found items are never broadcast publicly to eliminate false claim risks.
              </p>
            </div>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800">No Public Found Board:</strong> There is no global list of found items. Items are only revealed as 1-to-1 matches to confirmed lost reporters.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800">Finder Contact Protection:</strong> Finder phone numbers and emails are blocked until the lost claimant correctly passes the anti-fraud challenge.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-800">Blind Verification:</strong> Wrong answers are never revealed by choice to prevent guessing. 3 consecutive wrong attempts enforce a 24-hour lockout timer.
              </span>
            </li>
          </ul>
        </div>

        {/* Section 3: When Data is Deleted */}
        <div className="card-surface space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                3. Automatic Data Retention & Purge Policy
              </h2>
              <p className="text-xs text-slate-500">
                Automated background schedules clear inactive and resolved records.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Standard Retention</span>
              <p className="text-base font-bold text-slate-800">60 Days After Post Creation</p>
              <p className="text-slate-500 mt-1">
                Unresolved lost and found reports are automatically deleted 60 days after submission.
              </p>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block mb-1">Returned Items</span>
              <p className="text-base font-bold text-emerald-950">7 Days After Item Return</p>
              <p className="text-emerald-700 mt-1">
                Once an item is marked as Returned, all associated contact logs and post data are purged within 7 days.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
