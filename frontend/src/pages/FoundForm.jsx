import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { api } from '../api/client';
import { foundSchema } from '../schemas/foundSchema';
import { FormField } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import { CATEGORIES, COMMON_COLORS, CAMPUS_PLACES, FOUND_CURRENT_LOCATIONS } from '../utils/constants';
import { PlusCircle, ArrowLeft, Send, ShieldAlert, Lock, CheckCircle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const FoundForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const now = new Date();
  const toLocalISO = (d) => {
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(foundSchema),
    defaultValues: {
      category: 'earphones',
      itemName: '',
      description: '',
      color: 'Black',
      location: 'Library',
      timeFound: toLocalISO(now),
      currentLocation: 'With me',
      photo: null,
      phone: user?.phone || '',
      hiddenQuestion: '',
      correctAnswer: '',
      decoy1: '',
      decoy2: '',
      decoy3: ''
    }
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        category: data.category,
        itemName: data.itemName,
        description: data.description,
        color: data.color,
        location: data.location,
        timeFound: new Date(data.timeFound).toISOString(),
        currentLocation: data.currentLocation,
        photo: data.photo,
        phone: data.phone,
        hiddenQuestion: data.hiddenQuestion,
        correctAnswer: data.correctAnswer,
        decoyAnswers: [data.decoy1, data.decoy2, data.decoy3]
      };

      await api.createFound(payload);
      toast.success('Found item registered with anti-fraud protection!');
      navigate('/my-posts');
    } catch (err) {
      toast.error(err.message || 'Failed to submit found report');
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
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Report a Found Item
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Help reconnect the item with its rightful owner using anti-fraud verification.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Section 1: Item Details */}
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
                  placeholder="e.g. Black Earbuds Case"
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
                label="Campus Location Found"
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Date & Time Found"
                id="timeFound"
                error={errors.timeFound?.message}
                required
              >
                <input
                  id="timeFound"
                  type="datetime-local"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm"
                  {...register('timeFound')}
                />
              </FormField>

              <FormField
                label="Where is the item right now?"
                id="currentLocation"
                error={errors.currentLocation?.message}
                required
              >
                <select
                  id="currentLocation"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm bg-white"
                  {...register('currentLocation')}
                >
                  {FOUND_CURRENT_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField
              label="Item Description"
              id="description"
              error={errors.description?.message}
              helperText="Give a general overview without spoiling the secret challenge answer"
              required
            >
              <textarea
                id="description"
                rows={3}
                placeholder="e.g. Found on desk in 2nd floor library reading room (10 to 500 chars)..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm"
                {...register('description')}
              />
            </FormField>
          </div>

          {/* Section 2: Anti-Fraud Hidden Question Builder */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-indigo-100 pb-2">
              <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  2. Anti-Fraud Hidden Question Builder
                </h2>
                <p className="text-xs text-slate-500">
                  Ask a question about a detail only the real owner would know.
                </p>
              </div>
            </div>

            <FormField
              label="Secret Verification Question"
              id="hiddenQuestion"
              error={errors.hiddenQuestion?.message}
              helperText="Do not ask for color or brand. Ask about stickers, wallpapers, keychains, etc."
              required
            >
              <input
                id="hiddenQuestion"
                type="text"
                placeholder="e.g. What sticker is on the case?"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm"
                {...register('hiddenQuestion')}
              />
            </FormField>

            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-3">
              <FormField
                label="Correct Answer (Exact Match)"
                id="correctAnswer"
                error={errors.correctAnswer?.message}
                required
              >
                <div className="relative">
                  <input
                    id="correctAnswer"
                    type="text"
                    placeholder="e.g. Green frog sticker"
                    className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 text-sm bg-white"
                    {...register('correctAnswer')}
                  />
                  <CheckCircle className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
                </div>
              </FormField>

              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Decoy Answers (3 incorrect options for multiple choice)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <FormField id="decoy1" error={errors.decoy1?.message}>
                    <input
                      id="decoy1"
                      type="text"
                      placeholder="Decoy 1: Yellow smiley"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-xs bg-white"
                      {...register('decoy1')}
                    />
                  </FormField>
                  <FormField id="decoy2" error={errors.decoy2?.message}>
                    <input
                      id="decoy2"
                      type="text"
                      placeholder="Decoy 2: Blue wave"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-xs bg-white"
                      {...register('decoy2')}
                    />
                  </FormField>
                  <FormField id="decoy3" error={errors.decoy3?.message}>
                    <input
                      id="decoy3"
                      type="text"
                      placeholder="Decoy 3: Red heart"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-xs bg-white"
                      {...register('decoy3')}
                    />
                  </FormField>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Photo Upload */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              3. Photo (Optional)
            </h2>
            <Controller
              name="photo"
              control={control}
              render={({ field }) => (
                <ImageUpload value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          {/* Safety Tip */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Campus Handover Safety Tip:</span>
              <p className="mt-0.5">
                Hand over items at the Security desk or a busy campus spot. Never meet in secluded areas or share personal addresses.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registering found post...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Found Item Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
