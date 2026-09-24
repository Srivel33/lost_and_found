import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '../schemas/authSchema';
import { useAuth } from '../auth/AuthContext';
import { FormField } from '../components/FormField';
import { UserPlus, ShieldAlert, Sparkles, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/30 to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 mb-4">
          <UserPlus className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Student Registration
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Join the campus lost & found network with your college ID
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

          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-800">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Privacy Note: Your phone number and email are kept hidden and never shared publicly.</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
                {...register('name')}
              />
            </FormField>

            <FormField
              label="College Email"
              id="email"
              error={errors.email?.message}
              helperText="Must be your official @snsct.org address (or @college.edu)"
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

            <FormField
              label="Phone Number"
              id="phone"
              error={errors.phone?.message}
              helperText="10-digit mobile number for secure hand-off"
              required
            >
              <input
                id="phone"
                type="tel"
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-slate-900 placeholder:text-slate-400 text-sm shadow-sm"
                {...register('phone')}
              />
            </FormField>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md shadow-indigo-200 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating profile...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already registered?{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
