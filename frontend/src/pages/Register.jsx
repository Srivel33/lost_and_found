import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '../schemas/authSchema';
import { useAuth } from '../auth/AuthContext';
import { FormField } from '../components/FormField';
import { UserPlus, ShieldCheck, Lock, UserCheck, Trash2, ArrowRight } from 'lucide-react';

export const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      regNumber: '',
      phone: ''
    }
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setAuthError('');
    try {
      await registerUser(data);
      navigate('/home', { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-elevation overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* Left Brand Panel - Desktop */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-900 via-indigo-850 to-slate-900 p-10 text-white flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-950/40 text-white">
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

              <div className="pt-4 border-t border-indigo-800/60">
                <blockquote className="text-sm font-medium text-indigo-100 italic leading-relaxed">
                  "Join your campus network to report, find, and safely claim lost valuables with cryptographic protection."
                </blockquote>
              </div>
            </div>

            {/* 3 Trust Pillars */}
            <div className="relative z-10 space-y-4 pt-8">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-indigo-800/80 text-indigo-200 flex-shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Safe Verification</p>
                  <p className="text-[11px] text-indigo-200/80">Only verified students can access claims.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-indigo-800/80 text-indigo-200 flex-shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Private Hand-off</p>
                  <p className="text-[11px] text-indigo-200/80">Contact details unlock only after secret challenge verification.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-indigo-800/80 text-indigo-200 flex-shrink-0 mt-0.5">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Automated Cleanup</p>
                  <p className="text-[11px] text-indigo-200/80">Logs deleted 7 days after item return.</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 text-[11px] text-indigo-300">
              © 2026 Campus Student Security Portal
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-5">
              
              <div className="space-y-1">
                <div className="lg:hidden flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-900 text-base">Campus Lost & Found</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Student Registration
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Create your verified student profile using your college ID.
                </p>
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800 animate-fadeIn" role="alert">
                  <span className="font-semibold">{authError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
                <FormField
                  label="Full Name"
                  id="name"
                  error={errors.name?.message}
                  required
                >
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. Meena Iyer"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:border-indigo-600 transition-colors"
                    {...register('name')}
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <FormField
                    label="College Email"
                    id="email"
                    error={errors.email?.message}
                    helperText="@snsct.org or @college.edu"
                    required
                  >
                    <input
                      id="email"
                      type="email"
                      placeholder="e.g. meena@snsct.org"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:border-indigo-600 transition-colors"
                      {...register('email')}
                    />
                  </FormField>

                  <FormField
                    label="Registration Number"
                    id="regNumber"
                    error={errors.regNumber?.message}
                    helperText="e.g. 713524CS102"
                    required
                  >
                    <input
                      id="regNumber"
                      type="text"
                      placeholder="e.g. 713524CS102"
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-300 uppercase tracking-wider text-slate-900 placeholder:text-slate-400 text-sm focus:border-indigo-600 transition-colors"
                      {...register('regNumber')}
                    />
                  </FormField>
                </div>

                <FormField
                  label="Phone Number"
                  id="phone"
                  error={errors.phone?.message}
                  helperText="10-digit phone for secure handoff (remains private)"
                  required
                >
                  <input
                    id="phone"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:border-indigo-600 transition-colors"
                    {...register('phone')}
                  />
                </FormField>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full shadow-sm"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Profile...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Create Student Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
                <span>Already have a profile? </span>
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Sign in instead &rarr;
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
