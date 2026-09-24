import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import { RequireAuth } from '../auth/RequireAuth';

describe('RequireAuth Route Guard', () => {
  it('redirects unauthenticated users to /login', async () => {
    // Clear session
    sessionStorage.clear();

    render(
      <MemoryRouter initialEntries={['/home']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<div>Login Page Target</div>} />
            <Route
              path="/home"
              element={
                <RequireAuth>
                  <div>Protected Home Content</div>
                </RequireAuth>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Should redirect to Login page and not show Protected Home Content
    expect(await screen.findByText('Login Page Target')).toBeInTheDocument();
    expect(screen.queryByText('Protected Home Content')).not.toBeInTheDocument();
  });
});
