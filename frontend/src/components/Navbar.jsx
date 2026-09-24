import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { NotificationBell } from './NotificationBell';
import { ShieldCheck, LogOut, Home, Search, PlusCircle, Sparkles, Layers, Shield } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/lost', label: 'Report Lost', icon: Search },
    { to: '/found', label: 'Report Found', icon: PlusCircle },
    { to: '/matches', label: 'Matches', icon: Sparkles },
    { to: '/my-posts', label: 'My Posts', icon: Layers },
    { to: '/privacy', label: 'Privacy', icon: Shield }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/home" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white flex items-center justify-center shadow-xs transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-slate-900 leading-tight">
                  Campus <span className="text-indigo-600">Lost & Found</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  College Safe Portal
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      isActive(link.to)
                        ? 'bg-indigo-50 text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Right Actions */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <NotificationBell />

              {/* User Avatar Chip */}
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-none">
                    {user?.name}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 leading-tight mt-0.5">
                    {user?.regNumber}
                  </p>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={logout}
                title="Sign out of portal"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary text-xs h-9 px-4 shadow-xs"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav bar */}
      {isAuthenticated && (
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-1.5 bg-slate-50/70 px-2 overflow-x-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
                  active
                    ? 'text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${active ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
