import React, { useState, useEffect } from 'react';
import { ShieldQuestion, CheckCircle2, Lock, AlertCircle } from 'lucide-react';

export const HiddenQuestion = ({
  question,
  options = [],
  attemptsLeft = 3,
  isLocked = false,
  onSubmitAnswer,
  submitting = false
}) => {
  const [selectedOption, setSelectedOption] = useState('');

  // Privacy Rule: Clear selection on unmount / navigation
  useEffect(() => {
    return () => {
      setSelectedOption('');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOption || submitting || isLocked) return;
    onSubmitAnswer(selectedOption);
    setSelectedOption('');
  };

  return (
    <div className="card-surface border-indigo-200/80 bg-gradient-to-b from-indigo-50/30 to-white space-y-5">
      
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
            <ShieldQuestion className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Finder's Anti-Fraud Challenge</h3>
            <p className="text-xs text-slate-500">
              Answer the secret detail question to unlock finder contact info.
            </p>
          </div>
        </div>

        {/* Attempts Badge */}
        <div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
              attemptsLeft === 3
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : attemptsLeft === 2
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} left
          </span>
        </div>
      </div>

      {/* Question prompt */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Secret Challenge Question
        </span>
        <p className="text-sm font-semibold text-slate-900 leading-snug">
          "{question}"
        </p>
      </div>

      {/* Option Cards Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600">Select the matching detail:</p>
          <div className="grid grid-cols-1 gap-2.5">
            {options.map((option, idx) => {
              const isSelected = selectedOption === option;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isLocked || submitting}
                  onClick={() => setSelectedOption(option)}
                  className={`p-3.5 text-left rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-1 ring-indigo-600 font-semibold shadow-xs'
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/80 text-slate-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="leading-snug">{option}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ml-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={!selectedOption || submitting || isLocked}
          className="btn-primary w-full text-xs h-11 shadow-sm"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Verifying Answer...</span>
            </>
          ) : (
            <span>Submit Verification Answer</span>
          )}
        </button>
      </form>

    </div>
  );
};
