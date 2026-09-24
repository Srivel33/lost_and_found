import React from 'react';
import { User, Phone, Mail, MapPin, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';

export const ContactCard = ({
  finderName,
  finderPhone,
  finderEmail,
  currentLocation,
  onConfirmMine,
  onNotMine,
  submitting = false,
  status = 'verified'
}) => {
  const isConfirmed = status === 'confirmed' || status === 'claimed' || status === 'returned';
  const isRejected = status === 'rejected';

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50 p-6 rounded-2xl border-2 border-emerald-300 shadow-lg space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-emerald-200 pb-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-emerald-950">
            Finder Contact Verified & Unlocked!
          </h3>
          <p className="text-xs text-emerald-700">
            You successfully answered the finder's challenge question.
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-200/80">
        <div className="flex items-center gap-2.5 text-xs text-slate-800">
          <User className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Finder Name</span>
            <span className="font-semibold text-slate-900">{finderName || 'Campus Student'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-slate-800">
          <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Phone Number</span>
            <a href={`tel:${finderPhone}`} className="font-semibold text-emerald-700 hover:underline">
              {finderPhone || 'N/A'}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-slate-800">
          <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">College Email</span>
            <a href={`mailto:${finderEmail}`} className="font-semibold text-emerald-700 hover:underline">
              {finderEmail || 'N/A'}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-slate-800">
          <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Item is currently</span>
            <span className="font-semibold text-slate-900">{currentLocation || 'With finder'}</span>
          </div>
        </div>
      </div>

      {/* Campus Hand-off Safety Tip */}
      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
        <span className="font-bold text-amber-700">Safety Tip:</span>
        <span>Hand over items at the Security desk or a busy campus spot. Always verify in person before concluding.</span>
      </div>

      {/* Confirmation Actions */}
      {!isConfirmed && !isRejected ? (
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onConfirmMine}
            disabled={submitting}
            className="w-full sm:w-auto flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4" />
            <span>This is mine (Confirm Match)</span>
          </button>
          <button
            onClick={onNotMine}
            disabled={submitting}
            className="w-full sm:w-auto py-3 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            <span>Not mine</span>
          </button>
        </div>
      ) : isConfirmed ? (
        <div className="p-3 bg-emerald-100/90 text-emerald-900 rounded-xl border border-emerald-300 text-center text-xs font-bold flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          <span>Match Confirmed! Connect with the finder to collect your item.</span>
        </div>
      ) : (
        <div className="p-3 bg-slate-100 text-slate-700 rounded-xl border border-slate-300 text-center text-xs font-medium">
          You marked this item as not yours.
        </div>
      )}
    </div>
  );
};
