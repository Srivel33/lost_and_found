import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { api } from '../api/client';
import { foundSchema } from '../schemas/foundSchema';
import { FormField } from '../components/FormField';
import { ImageUpload } from '../components/ImageUpload';
import { PageHeader } from '../components/PageHeader';
import { AnimatedSelect } from '../components/AnimatedSelect';
import { CATEGORIES, CAMPUS_PLACES, FOUND_CURRENT_LOCATIONS } from '../utils/constants';
import { PlusCircle, ArrowLeft, Send, ShieldAlert, Lock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const FoundForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [customLocation, setCustomLocation] = useState('');

  const now = new Date();
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
    resolver: zodResolver(foundSchema),
    defaultValues: {
      category: 'electronics',
      itemName: '',
      description: '',
      color: 'Unspecified',
      location: 'Block A',
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
        category: finalCategory,
        itemName: data.itemName,
        description: data.description,
        color: data.color || 'Unspecified',
        location: finalLocation,
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
          badge="Found Item Report"
          badgeIcon={PlusCircle}
          title="Report a Found Item"
          subtitle="Register a discovered campus item. The secret question prevents false claimants from taking it."
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        
        {/* Section 1: Item Details */}
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
                  placeholder="Please specify category (e.g. Notebook, Watch)"
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
                placeholder="e.g. Wireless Earbuds Case, College ID Card"
                className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:border-indigo-600 transition-colors"
                {...register('itemName')}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Campus Location Found"
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

            <FormField
              label="Date & Time Found"
              id="timeFound"
              error={errors.timeFound?.message}
              required
            >
              <div className="space-y-1.5">
                <input
                  id="timeFound"
                  type="datetime-local"
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-indigo-600 transition-colors"
                  {...register('timeFound')}
                />
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setValue('timeFound', toLocalISO(new Date()))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-[10px] font-semibold rounded-md border border-slate-200 transition-colors"
                  >
                    Just Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('timeFound', toLocalISO(new Date(Date.now() - 60 * 60 * 1000)))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-[10px] font-semibold rounded-md border border-slate-200 transition-colors"
                  >
                    1h Ago
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('timeFound', toLocalISO(new Date(Date.now() - 24 * 60 * 60 * 1000)))}
                    className="px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-[10px] font-semibold rounded-md border border-slate-200 transition-colors"
                  >
                    Yesterday
                  </button>
                </div>
              </div>
            </FormField>
          </div>

          <FormField
            label="Current Custody of Item"
            id="currentLocation"
            error={errors.currentLocation?.message}
            required
          >
            <Controller
              name="currentLocation"
              control={control}
              render={({ field }) => (
                <AnimatedSelect
                  id="currentLocation"
                  options={FOUND_CURRENT_LOCATIONS}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>

          <FormField
            label="General Public Description"
            id="description"
            error={errors.description?.message}
            helperText="Provide general info without revealing the secret challenge answer"
            required
          >
            <div className="relative">
              <textarea
                id="description"
                rows={3}
                placeholder="e.g. Found on desk in 2nd floor library reading room (10 to 500 chars)..."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:border-indigo-600 transition-colors resize-none"
                {...register('description')}
              />
              <span className={`absolute right-2.5 bottom-2.5 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ${
                descriptionValue.length > 500
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {descriptionValue.length}/500
              </span>
            </div>
          </FormField>
        </div>

        {/* Section 2: Anti-Fraud Hidden Question Builder */}
        <div className="card-surface space-y-5 border-indigo-200/80 bg-gradient-to-b from-indigo-50/40 to-white">
          <div className="flex items-center gap-2.5 border-b border-indigo-100 pb-3">
            <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                2. Anti-Fraud Verification Challenge
              </h2>
              <p className="text-xs text-slate-500">
                Ask a specific question only the true owner would know.
              </p>
            </div>
          </div>

          <FormField
            label="Secret Verification Question"
            id="hiddenQuestion"
            error={errors.hiddenQuestion?.message}
            helperText="Ask about stickers, lock screen, charms, engravings, or case textures."
            required
          >
            <input
              id="hiddenQuestion"
              type="text"
              placeholder="e.g. What specific sticker or marking is placed on the item?"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:border-indigo-600 transition-colors bg-white"
              {...register('hiddenQuestion')}
            />
          </FormField>

          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-3.5">
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
                  placeholder="e.g. Green frog cartoon sticker"
                  className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-emerald-300 text-slate-900 placeholder:text-slate-400 text-sm bg-white focus:border-emerald-600 transition-colors"
                  {...register('correctAnswer')}
                />
                <CheckCircle className="w-4 h-4 text-emerald-600 absolute right-3.5 top-3.5" />
              </div>
            </FormField>

            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                Decoy Answers (3 incorrect options for multiple choice challenge)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField id="decoy1" error={errors.decoy1?.message}>
                  <input
                    id="decoy1"
                    type="text"
                    placeholder="Decoy 1: Yellow star"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:border-indigo-600 transition-colors"
                    {...register('decoy1')}
                  />
                </FormField>
                <FormField id="decoy2" error={errors.decoy2?.message}>
                  <input
                    id="decoy2"
                    type="text"
                    placeholder="Decoy 2: Blue guitar"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:border-indigo-600 transition-colors"
                    {...register('decoy2')}
                  />
                </FormField>
                <FormField id="decoy3" error={errors.decoy3?.message}>
                  <input
                    id="decoy3"
                    type="text"
                    placeholder="Decoy 3: Plain white"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:border-indigo-600 transition-colors"
                    {...register('decoy3')}
                  />
                </FormField>
              </div>
            </div>
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

        {/* Safety Note */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Campus Handover Protocol:</span>
            <span className="ml-1">Never meet in isolated areas. Always handover items at the campus security desk or student center.</span>
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
            className="btn-primary text-xs h-11 px-6 shadow-sm bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Registering Report...</span>
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
  );
};
