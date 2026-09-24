import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './auth/AuthContext';
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
import { RotateCcw } from 'lucide-react';

const AppLayout = () => {
  const { resetDemoData } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-800">
      <Navbar />

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

      {/* Global Campus Portal Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Campus Lost & Found System — Privacy-Preserving College Network</p>
          <div className="flex items-center gap-4">
            <button
              onClick={resetDemoData}
              className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </footer>
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
            fontWeight: 500
          }
        }}
      />
      <AppLayout />
    </AuthProvider>
  );
};

export default App;
