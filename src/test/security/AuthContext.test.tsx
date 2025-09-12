import React from 'react';
import AuthProvider, { useAuth } from '../../components/security/AuthContext';
import { executeJwtAuthenticationService } from '../../components/api/AuthenticationApiService';
import {jwtDecode} from 'jwt-decode';
import { act, renderHook } from '@testing-library/react';

// Mock executeJwtAuthenticationService and jwtDecode
jest.mock('../../components/api/AuthenticationApiService');
jest.mock('jwt-decode');

describe('AuthContext', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('should provide auth context values', () => {
    const wrapper: React.FC = ({ children }:any) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.username).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAdmin).toBe(false);
  });

  // it('should login successfully and set context values', async () => {
  //   const mockResponse = {
  //     status: 200,
  //     data: { token: 'mock.jwt.token', isAdmin: true },
  //   };
  //   (executeJwtAuthenticationService as jest.Mock).mockResolvedValue(mockResponse);
  //   (jwtDecode as jest.Mock).mockReturnValue({ exp: Date.now() / 1000 + 1000, sub: 'user', isAdmin: true });

  //   const wrapper: React.FC = ({ children }:any) => (
  //     <AuthProvider>{children}</AuthProvider>
  //   );

  //   const { result } = renderHook(() => useAuth(), { wrapper });

  //   await act(async () => {
  //     const success = await result.current.login('user', 'pass');
  //     expect(success).toBe(true);
  //   });

  //   expect(result.current.isAuthenticated).toBe(true);
  //   expect(result.current.username).toBe('user');
  //   expect(result.current.token).toBe('Bearer mock.jwt.token');
  //   expect(result.current.isAdmin).toBe(true);
  //   expect(sessionStorage.getItem('token')).toBe('Bearer mock.jwt.token');
  // });

  it('should logout and clear context values', async () => {
    const wrapper: React.FC = ({ children }:any) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('user', 'pass');
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.username).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAdmin).toBe(false);
    expect(sessionStorage.getItem('token')).toBeNull();
  });
});
