import React from 'react';
import { User, Phone, Mail, MapPin, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

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
    <div className="card-surface border-emerald-300 bg-gradient-to-b from-emerald-50/50 to-white space-y-5">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-emerald-100 pb-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Finder Contact Unlocked!
          </h3>
          <p className="text-xs text-slate-500">
            Challenge passed. Contact the finder to coordinate hand-off.
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-emerald-200/70">
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
            <a href={`mailto:${finderEmail}`} className="font-semibold text-emerald-700 hover:underline truncate block max-w-[180px]">
              {finderEmail || 'N/A'}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-xs text-slate-800">
          <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Item Location</span>
            <span className="font-semibold text-slate-900">{currentLocation || 'With finder'}</span>
          </div>
        </div>
      </div>

      {/* Campus Hand-off Safety Tip */}
      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
        <span className="font-bold text-amber-700">Safety Tip:</span>
        <span>Meet at the campus security desk or student center to verify and collect your item in person.</span>
      </div>

      {/* Confirmation Actions */}
      {!isConfirmed && !isRejected ? (
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onConfirmMine}
            disabled={submitting}
            className="btn-primary w-full sm:w-auto flex-1 text-xs h-11 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>This is mine (Confirm Match)</span>
          </button>
          <button
            onClick={onNotMine}
            disabled={submitting}
            className="btn-secondary w-full sm:w-auto text-xs h-11"
          >
            <XCircle className="w-4 h-4 text-slate-500" />
            <span>Not mine</span>
          </button>
        </div>
      ) : isConfirmed ? (
        <div className="p-3.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-center text-xs font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Match Confirmed! Coordinate with the finder to collect your item.</span>
        </div>
      ) : (
        <div className="p-3.5 bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-center text-xs font-medium">
          You marked this item as not yours.
        </div>
      )}
    </div>
  );
};
