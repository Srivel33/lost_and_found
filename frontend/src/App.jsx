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
import { ShieldCheck, Shield } from 'lucide-react';

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

      {/* Short & Clean Professional Footer */}
      {!isAuthPage && (
        <footer className="bg-white border-t border-slate-200/80 py-5 text-slate-500 text-xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-slate-800">
                Campus Lost & Found
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">
                Privacy-Preserving College Network
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <Link to="/home" className="hover:text-indigo-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/matches" className="hover:text-indigo-600 transition-colors">
                Matches
              </Link>
              <Link to="/privacy" className="hover:text-indigo-600 transition-colors">
                Privacy Policy
              </Link>
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
