import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { NotificationBell } from './NotificationBell';
import { Shield, LogOut, PlusCircle, Search, Layers, User } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, resetDemoData, isAuthenticated } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/lost', label: 'Report Lost' },
    { to: '/found', label: 'Report Found' },
    { to: '/matches', label: 'Matches' },
    { to: '/my-posts', label: 'My Posts' },
    { to: '/privacy', label: 'Privacy' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <Link to="/home" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-200 transition-colors">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">
                  Campus <span className="text-indigo-600">Lost & Found</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
                  College Safe Portal
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive(link.to)
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Right Action Items */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <NotificationBell />

              {/* User Chip */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/60">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">
                    {user?.name}
                  </p>
                  <p className="text-[10px] font-mono text-slate-500 leading-tight">
                    {user?.regNumber}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-xl shadow-sm transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav bar at bottom of header */}
      {isAuthenticated && (
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-2 bg-slate-50/50 px-2 overflow-x-auto">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive(link.to)
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
