import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { api } from '../api/client';
import { lostSchema } from '../schemas/lostSchema';
import { FormField } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import { CATEGORIES, COMMON_COLORS, CAMPUS_PLACES } from '../utils/constants';
import { Search, ArrowLeft, Send, Sparkles, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const LostForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Helper to format ISO to datetime-local value format (YYYY-MM-DDTHH:mm)
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const toLocalISO = (d) => {
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(lostSchema),
    defaultValues: {
      category: 'earphones',
      itemName: '',
      description: '',
      color: 'Black',
      specialMarks: '',
      location: 'Library',
      timeStart: toLocalISO(oneHourAgo),
      timeEnd: toLocalISO(now),
      phone: user?.phone || '',
      photo: null
    }
  });

  const descriptionValue = watch('description') || '';

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Format timestamps to full ISO strings
      const payload = {
        ...data,
        timeStart: new Date(data.timeStart).toISOString(),
        timeEnd: new Date(data.timeEnd).toISOString()
      };
      await api.createLost(payload);
      toast.success('Lost item report posted! Searching for potential matches...');
      navigate('/matches');
    } catch (err) {
      toast.error(err.message || 'Failed to submit lost post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
      {/* Back button & Header */}
      <div className="mb-6">
        <Link
          to="/home"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-200">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Report a Lost Item
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Provide specific details so our smart system can match it with found items.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Section: Basic Details */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              1. Item Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Category"
                id="category"
                error={errors.category?.message}
                required
              >
                <select
                  id="category"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm bg-white"
                  {...register('category')}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Item Name / Model"
                id="itemName"
                error={errors.itemName?.message}
                required
              >
                <input
                  id="itemName"
                  type="text"
                  placeholder="e.g. Black AirPods Pro Case"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm"
                  {...register('itemName')}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Primary Color"
                id="color"
                error={errors.color?.message}
                required
              >
                <select
                  id="color"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm bg-white"
                  {...register('color')}
                >
                  {COMMON_COLORS.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Special Identifiers (Stickers, Scratches, Case)"
                id="specialMarks"
                error={errors.specialMarks?.message}
                helperText="Helps verify ownership without revealing all details"
              >
                <input
                  id="specialMarks"
                  type="text"
                  placeholder="e.g. Green frog sticker, small scratch near port"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm"
                  {...register('specialMarks')}
                />
              </FormField>
            </div>

            <FormField
              label="Detailed Description"
              id="description"
              error={errors.description?.message}
              required
            >
              <textarea
                id="description"
                rows={3}
                placeholder="Describe where you had it last, specific brand, distinguishing attributes (10 to 500 characters)..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm"
                {...register('description')}
              />
              {/* Dynamic prompt if description is under 25 chars */}
              {descriptionValue.length > 0 && descriptionValue.length < 25 && (
                <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span>Any stickers, scratches or keychain?</span>
                </div>
              )}
            </FormField>
          </div>

          {/* Section: Location & Time Window */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              2. Where and When Lost
            </h2>

            <FormField
              label="Campus Location Where Lost"
              id="location"
              error={errors.location?.message}
              required
            >
              <select
                id="location"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm bg-white"
                {...register('location')}
              >
                {CAMPUS_PLACES.map((place) => (
                  <option key={place} value={place}>
                    {place}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Estimated Time (From)"
                id="timeStart"
                error={errors.timeStart?.message}
                required
              >
                <input
                  id="timeStart"
                  type="datetime-local"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm"
                  {...register('timeStart')}
                />
              </FormField>

              <FormField
                label="Estimated Time (To)"
                id="timeEnd"
                error={errors.timeEnd?.message}
                required
              >
                <input
                  id="timeEnd"
                  type="datetime-local"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm"
                  {...register('timeEnd')}
                />
              </FormField>
            </div>
          </div>

          {/* Section: Optional Photo */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              3. Photo Upload (Optional)
            </h2>
            <Controller
              name="photo"
              control={control}
              render={({ field }) => (
                <ImageUpload value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          {/* Section: Contact Details */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              4. Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Name</span>
                <span className="text-xs font-semibold text-slate-800">{user?.name}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Email</span>
                <span className="text-xs font-semibold text-slate-800">{user?.email}</span>
              </div>

              <FormField
                label="Contact Phone"
                id="phone"
                error={errors.phone?.message}
              >
                <input
                  id="phone"
                  type="tel"
                  placeholder="10-digit phone"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm"
                  {...register('phone')}
                />
              </FormField>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Your contact details are encrypted and will only be shared when a finder's match is confirmed.</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Matching item with campus reports...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Lost Item Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
