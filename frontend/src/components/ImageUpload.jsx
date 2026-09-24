import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export const ImageUpload = ({ value, onChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    // Check type
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG or WebP images are allowed.');
      return;
    }

    // Check size: max 5 MB
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error('Image size must be less than 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
      toast.success('Photo uploaded successfully');
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
    <div className="space-y-2 w-full">
      <label className="block text-sm font-medium text-slate-700">
        Item Photo <span className="text-xs text-slate-400 font-normal">(Optional)</span>
      </label>

      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-w-sm">
          <img
            src={value}
            alt="Item preview"
            className="w-full h-48 object-cover rounded-2xl"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 hover:bg-red-600 text-white transition-colors shadow-md"
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
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50/50'
              : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
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
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-slate-700">
              Click or drag image to upload
            </p>
            <p className="text-[11px] text-slate-400">
              JPG or PNG, max 5 MB
            </p>
          </div>
        </div>
      )}

      {/* Required Privacy warning */}
      <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" />
        <span>Don't upload photos showing faces or ID numbers.</span>
      </div>
    </div>
  );
};
