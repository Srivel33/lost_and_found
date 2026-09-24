import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginSchema } from '../schemas/authSchema';
import { useAuth } from '../auth/AuthContext';
import { FormField } from '../components/FormField';
import { LogIn, ShieldCheck, Lock, UserCheck, Trash2 } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
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

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Defined subtle geometric grid background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50 bg-[radial-gradient(#94a3b8_1.2px,transparent_1.2px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="w-full max-w-5xl relative z-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-elevation overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
          
          {/* Left Brand Panel - Desktop */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-10 text-white flex-col justify-between relative overflow-hidden">
            {/* Soft subtle glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 space-y-6">
              {/* Brand Logo */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-950/50 text-white">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-white leading-tight">
                    Campus Lost & Found
                  </h2>
                  <p className="text-[11px] font-medium text-indigo-200">
                    College Safe Network
                  </p>
                </div>
              </div>

              {/* Quote */}
              <div className="pt-4 border-t border-indigo-800/60">
                <blockquote className="text-sm font-medium text-indigo-100 italic leading-relaxed">
                  "Every lost item carries a memory. Connect students, rebuild trust, and reunite campus belongings safely."
                </blockquote>
              </div>
            </div>

            {/* 3 Trust Pillars */}
            <div className="relative z-10 space-y-4 pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-900/80 border border-indigo-700/50 text-indigo-200 flex-shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Verified Students Only</p>
                  <p className="text-[11px] text-indigo-200/80">Only campus enrolled credentials can log in.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-900/80 border border-indigo-700/50 text-indigo-200 flex-shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Zero Public Postings</p>
                  <p className="text-[11px] text-indigo-200/80">Found items remain strictly private to protect owners.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-900/80 border border-indigo-700/50 text-indigo-200 flex-shrink-0 mt-0.5">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Automatic Retention Purge</p>
                  <p className="text-[11px] text-indigo-200/80">Records are automatically cleared after resolution.</p>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="relative z-10 pt-4 text-[11px] text-indigo-300/80">
              © 2026 Campus Student Security Portal
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
            <div className="max-w-md w-full mx-auto space-y-6">
              
              {/* Header on mobile & form header */}
              <div className="space-y-1.5">
                <div className="lg:hidden flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-900 text-base">Campus Lost & Found</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Welcome!
                </h1>
                <p className="text-sm text-slate-500">
                  Enter your college email and registration number to access your account.
                </p>
              </div>

              {/* Error Banner */}
              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800 animate-fadeIn" role="alert">
                  <span className="font-semibold">{authError}</span>
                </div>
              )}

              {/* Form */}
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
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all bg-white hover:bg-slate-50"
                    {...register('email')}
                  />
                </FormField>

                <FormField
                  label="Registration Number"
                  id="regNumber"
                  error={errors.regNumber?.message}
                  helperText="Official student roll number (e.g. 713524CS102)"
                  required
                >
                  <input
                    id="regNumber"
                    type="text"
                    placeholder="e.g. 713524CS102"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 uppercase tracking-wider text-slate-900 placeholder:text-slate-400 text-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all bg-white hover:bg-slate-50"
                    {...register('regNumber')}
                  />
                </FormField>

                {/* Sign in Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_12px_25px_rgba(79,70,229,0.4)]"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Sign In to Portal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Bottom Switch Link */}
              <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
                <span>New to the campus portal? </span>
                <Link
                  to="/register"
                  className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Create student profile &rarr;
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
