import React from 'react';

export const PageHeader = ({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  children,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 ${className}`}>
      <div className="space-y-1">
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 mb-1">
            {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5 text-indigo-600" />}
            <span>{badge}</span>
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-600 leading-normal max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {children}
        </div>
      )}
    </div>
  );
};
