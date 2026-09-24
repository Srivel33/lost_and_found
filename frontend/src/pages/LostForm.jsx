import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { api } from '../api/client';
import { lostSchema } from '../schemas/lostSchema';
import { FormField } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import { PageHeader } from '../components/PageHeader';
import { AnimatedSelect } from '../components/AnimatedSelect';
import { CATEGORIES, CAMPUS_PLACES } from '../utils/constants';
import { Search, ArrowLeft, Send, Sparkles, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const LostForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [customLocation, setCustomLocation] = useState('');

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
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(lostSchema),
    defaultValues: {
      category: 'electronics',
      itemName: '',
      description: '',
      color: 'Unspecified',
      specialMarks: '',
      location: 'Block A',
      timeStart: toLocalISO(oneHourAgo),
      timeEnd: toLocalISO(now),
      phone: user?.phone || '',
      photo: null
    }
  });

  const selectedCategory = watch('category');
  const selectedLocation = watch('location');
  const descriptionValue = watch('description') || '';

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const finalCategory = data.category === 'others' && customCategory.trim() 
        ? customCategory.trim() 
        : data.category;

      const finalLocation = data.location === 'Others' && customLocation.trim()
        ? customLocation.trim()
        : data.location;

      const payload = {
        ...data,
        category: finalCategory,
        location: finalLocation,
        color: data.color || 'Unspecified',
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      
      {/* Back button */}
      <div>
        <Link
          to="/home"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <PageHeader
          badge="Lost Item Report"
          badgeIcon={Search}
          title="Report a Lost Item"
          subtitle="Provide detailed specifications so our smart algorithm can match with campus found items."
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        
        {/* Section 1: Item Information */}
        <div className="card-surface space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Item Information
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Required fields *</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Category"
              id="category"
              error={errors.category?.message}
              required
            >
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <AnimatedSelect
                    id="category"
                    options={CATEGORIES}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {selectedCategory === 'others' && (
                <input
                  type="text"
                  placeholder="Please specify category (e.g. Umbrella, Calculator)"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="mt-2 w-full h-10 px-3.5 rounded-xl border border-indigo-300 text-slate-900 text-xs focus:border-indigo-600 transition-colors"
                />
              )}
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
                placeholder="e.g. Wireless Earbuds, Scientific Calculator"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:border-indigo-600 transition-colors"
                {...register('itemName')}
              />
            </FormField>
          </div>

          <FormField
            label="Special Identifiers (Stickers, Scratches, Markings)"
            id="specialMarks"
            error={errors.specialMarks?.message}
            helperText="Helps verify ownership without revealing all details"
          >
            <input
              id="specialMarks"
              type="text"
              placeholder="e.g. Blue anime sticker on top, scratched corner"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:border-indigo-600 transition-colors"
              {...register('specialMarks')}
            />
          </FormField>

          <FormField
            label="Detailed Description"
            id="description"
            error={errors.description?.message}
            required
          >
            <textarea
              id="description"
              rows={3}
              placeholder="Describe distinguishing features, brand marks, accessories, or context (10 to 500 characters)..."
              className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:border-indigo-600 transition-colors resize-none"
              {...register('description')}
            />
            {descriptionValue.length > 0 && descriptionValue.length < 25 && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span>Tip: Add any unique marks, brand, or case details for higher match accuracy.</span>
              </div>
            )}
          </FormField>
        </div>

        {/* Section 2: Location & Time */}
        <div className="card-surface space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Where & When Lost
            </h2>
          </div>

          <FormField
            label="Campus Location"
            id="location"
            error={errors.location?.message}
            required
          >
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <AnimatedSelect
                  id="location"
                  options={CAMPUS_PLACES}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {selectedLocation === 'Others' && (
              <input
                type="text"
                placeholder="Please specify custom campus location"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                className="mt-2 w-full h-10 px-3.5 rounded-xl border border-indigo-300 text-slate-900 text-xs focus:border-indigo-600 transition-colors"
              />
            )}
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
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-indigo-600 transition-colors"
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
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-indigo-600 transition-colors"
                {...register('timeEnd')}
              />
            </FormField>
          </div>
        </div>

        {/* Section 3: Photo */}
        <div className="card-surface space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              3. Photo Upload
            </h2>
          </div>

          <Controller
            name="photo"
            control={control}
            render={({ field }) => (
              <ImageUpload value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        {/* Section 4: Contact & Privacy */}
        <div className="card-surface space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              4. Contact & Privacy Protection
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Reporter</span>
              <span className="text-xs font-semibold text-slate-800">{user?.name}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Email</span>
              <span className="text-xs font-semibold text-slate-800 truncate block">{user?.email}</span>
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
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-slate-900 text-xs focus:border-indigo-600 transition-colors"
                {...register('phone')}
              />
            </FormField>
          </div>

          <div className="flex items-center gap-2 p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900">
            <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>Your contact details remain encrypted and will only unlock when a finder challenge is verified.</span>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/home"
            className="btn-secondary text-xs h-11 px-5"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn-danger text-xs h-11 px-6 shadow-sm"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting Report...</span>
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
  );
};
