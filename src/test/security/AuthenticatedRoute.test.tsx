import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { useAuth } from '../../components/security/AuthContext';
import AuthenticatedRoute from '../../components/security/AuthenticatedRoute';
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

// Mock jwtDecode
jest.mock('jwt-decode');

describe('AuthenticatedRoute', () => {
  const mockUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children if the user is authenticated', async () => {
    const mockAuthContext = {
      storedToken: 'Bearer valid.token',
      setToken: jest.fn(),
      setIsAuthenticated: jest.fn(),
      setUsername: jest.fn(),
    };
    const mockDecodedToken = { exp: Date.now() / 1000 + 1000, sub: 'user' };

    mockUseAuth.mockReturnValue(mockAuthContext);
    (jwtDecode as jest.Mock).mockReturnValue(mockDecodedToken);

    const { findByText } = render(
      <Router>
        <AuthenticatedRoute>
          <div>Authenticated Content</div>
        </AuthenticatedRoute>
      </Router>
    );

    await findByText('Authenticated Content');
  });

  it('should navigate to /login if the token is expired', async () => {
    const mockAuthContext = {
      storedToken: 'Bearer expired.token',
      setToken: jest.fn(),
      setIsAuthenticated: jest.fn(),
      setUsername: jest.fn(),
    };
    const mockDecodedToken = { exp: Date.now() / 1000 - 1000, sub: 'user' };

    mockUseAuth.mockReturnValue(mockAuthContext);
    (jwtDecode as jest.Mock).mockReturnValue(mockDecodedToken);

    render(
      <Router>
        <AuthenticatedRoute>
          <div>Authenticated Content</div>
        </AuthenticatedRoute>
      </Router>
    );

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/login'));
  });
});
