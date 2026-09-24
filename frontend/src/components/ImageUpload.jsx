import React, { useState, useRef } from 'react';
import { UploadCloud, X, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export const ImageUpload = ({ value, onChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG or WebP images are allowed.');
      return;
    }

    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error('Image size must be less than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
      toast.success('Photo attached');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2.5 w-full">
      <label className="block text-sm font-medium text-slate-700">
        Item Photo <span className="text-xs text-slate-400 font-normal">(Optional)</span>
      </label>

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-w-sm">
          <img
            src={value}
            alt="Item preview"
            className="w-full h-44 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/80 hover:bg-rose-600 text-white transition-colors shadow-sm"
            title="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            dragActive
              ? 'border-indigo-600 bg-indigo-50/50'
              : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/60'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700">
              Click to select or drag and drop photo
            </p>
            <p className="text-[11px] text-slate-400">
              Supports JPG, PNG or WebP up to 5 MB
            </p>
          </div>
        </div>
      )}

      {/* Privacy Guidance */}
      <div className="flex items-center gap-2 text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200/80">
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
        <span>Privacy Tip: Never upload photos displaying personal faces, bank cards, or ID registration badges.</span>
      </div>
    </div>
  );
};
