import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginSchema } from '../schemas/authSchema';
import { useAuth } from '../auth/AuthContext';
import { FormField } from '../components/FormField';
import { LogIn, ShieldAlert, Sparkles, KeyRound } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { name: 'Meena Iyer (Lost Case)', email: 'meena@snsct.org', reg: '713524CS102' },
  { name: 'Arun Kumar (Finder)', email: 'arun@snsct.org', reg: '713524CS101' },
  { name: 'Shahith (Student Demo)', email: 'shahith@snsct.org', reg: '713524AM120' }
];

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      regNumber: ''
    }
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setAuthError('');
    try {
      await login(data.email, data.regNumber);
      const destination = location.state?.from?.pathname || '/home';
      navigate(destination, { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Email or registration number is incorrect.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = (email, reg) => {
    setValue('email', email, { shouldValidate: true });
    setValue('regNumber', reg, { shouldValidate: true });
    setAuthError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-4">
          <KeyRound className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Campus Lost & Found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in with your verified college credentials
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-2xl sm:px-10 border border-slate-100">
          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700 font-medium">
                {authError}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <FormField
              label="College Email"
              id="email"
              error={errors.email?.message}
              required
            >
              <input
                id="email"
                type="email"
                placeholder="e.g. name@snsct.org"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
                {...register('email')}
              />
            </FormField>

            <FormField
              label="Registration Number"
              id="regNumber"
              error={errors.regNumber?.message}
              helperText="e.g. 713524AM120 (Department & Roll Number)"
              required
            >
              <input
                id="regNumber"
                type="text"
                placeholder="e.g. 713524AM120"
                className="w-full px-4 py-2.5 uppercase rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 placeholder:text-slate-400 text-sm shadow-sm tracking-wider"
                {...register('regNumber')}
              />
            </FormField>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md shadow-indigo-200 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign in</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              First time here?{' '}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Create student profile
              </Link>
            </p>
          </div>

          {/* 1-Click Demo Accounts Pill Tray */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Demo Accounts</span>
            </div>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleFillDemo(acc.email, acc.reg)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-200 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-700">
                      {acc.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {acc.email} | {acc.reg}
                    </p>
                  </div>
                  <span className="text-[11px] font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Fill
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
