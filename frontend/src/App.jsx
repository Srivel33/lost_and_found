import React from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './auth/AuthContext';
import { RequireAuth } from './auth/RequireAuth';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { LostForm } from './pages/LostForm';
import { FoundForm } from './pages/FoundForm';
import { Matches } from './pages/Matches';
import { MatchDetail } from './pages/MatchDetail';
import { MyPosts } from './pages/MyPosts';
import { PrivacyPanel } from './pages/PrivacyPanel';
import { NotFound } from './pages/NotFound';
import { ShieldCheck, Lock, ExternalLink, Heart, Shield } from 'lucide-react';

const AppLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {!isAuthPage && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/lost"
            element={
              <RequireAuth>
                <LostForm />
              </RequireAuth>
            }
          />
          <Route
            path="/found"
            element={
              <RequireAuth>
                <FoundForm />
              </RequireAuth>
            }
          />
          <Route
            path="/matches"
            element={
              <RequireAuth>
                <Matches />
              </RequireAuth>
            }
          />
          <Route
            path="/matches/:id"
            element={
              <RequireAuth>
                <MatchDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/my-posts"
            element={
              <RequireAuth>
                <MyPosts />
              </RequireAuth>
            }
          />
          <Route
            path="/privacy"
            element={
              <RequireAuth>
                <PrivacyPanel />
              </RequireAuth>
            }
          />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Professional Campus Portal Footer */}
      {!isAuthPage && (
        <footer className="bg-white border-t border-slate-200/80 mt-12 text-slate-600">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Column 1: Brand & Mission */}
              <div className="md:col-span-5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-900 text-base">
                    Campus <span className="text-indigo-600">Lost & Found</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                  A privacy-preserving college portal enabling students to safely report, match, and recover lost belongings with anti-fraud verification.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified College Security Network</span>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div className="md:col-span-3 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Quick Actions
                </h4>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link to="/home" className="hover:text-indigo-600 transition-colors">
                      Home Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/lost" className="hover:text-rose-600 transition-colors">
                      Report Lost Item
                    </Link>
                  </li>
                  <li>
                    <Link to="/found" className="hover:text-emerald-600 transition-colors">
                      Report Found Item
                    </Link>
                  </li>
                  <li>
                    <Link to="/matches" className="hover:text-indigo-600 transition-colors">
                      View Smart Matches
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Trust & Privacy */}
              <div className="md:col-span-4 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Privacy Safeguards
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Found items are never broadcast publicly. All contact details stay encrypted until the owner passes the secret challenge question.
                </p>
                <div>
                  <Link
                    to="/privacy"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <span>Read Data Protection Policy</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Bottom Copyright & Safety Banner */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <p>© 2026 Campus Lost & Found System. All rights reserved.</p>
              <p className="text-[11px]">Designed for Student Safety & Data Privacy</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
          }
        }}
      />
      <AppLayout />
    </AuthProvider>
  );
};

export default App;
