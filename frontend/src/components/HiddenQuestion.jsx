import React, { useState, useEffect } from 'react';
import { HelpCircle, ShieldQuestion, CheckCircle, AlertCircle } from 'lucide-react';

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
    // Clear selection immediately on submit
    setSelectedOption('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-md space-y-4">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
            <ShieldQuestion className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Finder's Anti-Fraud Challenge</h3>
            <p className="text-xs text-slate-500">
              Answer the finder's secret detail question to unlock their contact information.
            </p>
          </div>
        </div>

        {/* Attempts Badge */}
        <div className="text-right">
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

      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Secret Question
        </p>
        <p className="text-sm font-bold text-slate-800">
          "{question}"
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-600">Select the correct detail:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {options.map((option, idx) => {
              const isSelected = selectedOption === option;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isLocked || submitting}
                  onClick={() => setSelectedOption(option)}
                  className={`p-3 text-left rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-sm ring-1 ring-indigo-600 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span>{option}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <CheckCircle className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={!selectedOption || submitting || isLocked}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
