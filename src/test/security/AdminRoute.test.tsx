import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { useAuth } from '../../components/security/AuthContext';
import AdminRoute from '../../components/security/AdminRoute';
import { BrowserRouter as Router } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

// Mock the useAuth hook
jest.mock('../../components/security/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the useNavigate hook from react-router-dom
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

jest.mock('jwt-decode');

describe('AdminRoute', () => {
  const mockUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children if the user is an admin', async () => {
    const mockAuthContext = {
      storedToken: 'Bearer valid.token',
      setToken: jest.fn(),
      setIsAuthenticated: jest.fn(),
      setUsername: jest.fn(),
      setIsAdmin: jest.fn(),
    };
    const mockDecodedToken = { exp: Date.now() / 1000 + 1000, sub: 'user', isAdmin: true };

    mockUseAuth.mockReturnValue(mockAuthContext);
    (jwtDecode as jest.Mock).mockReturnValue(mockDecodedToken);

    const { findByText } = render(
      <Router>
        <AdminRoute>
          <div>Admin Content</div>
        </AdminRoute>
      </Router>
    );

    await findByText('Admin Content');
  });

  it('should navigate to /not-authorized if the user is not an admin', async () => {
    const mockAuthContext = {
      storedToken: 'Bearer valid.token',
      setToken: jest.fn(),
      setIsAuthenticated: jest.fn(),
      setUsername: jest.fn(),
      setIsAdmin: jest.fn(),
    };
    const mockDecodedToken = { exp: Date.now() / 1000 + 1000, sub: 'user', isAdmin: false };

    mockUseAuth.mockReturnValue(mockAuthContext);
    (jwtDecode as jest.Mock).mockReturnValue(mockDecodedToken);

    render(
      <Router>
        <AdminRoute>
          <div>Admin Content</div>
        </AdminRoute>
      </Router>
    );

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/not-authorized'));
  });

  it('should navigate to /login if the token is expired', async () => {
    const mockAuthContext = {
      storedToken: 'Bearer expired.token',
      setToken: jest.fn(),
      setIsAuthenticated: jest.fn(),
      setUsername: jest.fn(),
      setIsAdmin: jest.fn(),
    };
    const mockDecodedToken = { exp: Date.now() / 1000 - 1000, sub: 'user', isAdmin: true };

    mockUseAuth.mockReturnValue(mockAuthContext);
    (jwtDecode as jest.Mock).mockReturnValue(mockDecodedToken);

    render(
      <Router>
        <AdminRoute>
          <div>Admin Content</div>
        </AdminRoute>
      </Router>
    );

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/login'));
  });
});
