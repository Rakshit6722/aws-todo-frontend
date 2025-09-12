import { executeJwtAuthenticationService } from "../api/AuthenticationApiService";
import { apiClient } from "../api/ApiClient";
import { jwtDecode } from "jwt-decode";
import { AuthenticationRouteProps } from "../../types";
import React, { createContext, useState, useContext, useEffect } from "react"; // Use ES6 import syntax

interface DecodedToken {
  exp: number;
  sub: string;
  isAdmin: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  storedToken: string | null;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider: React.FC<AuthenticationRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const storedToken = sessionStorage.getItem("token");

  useEffect(() => {
    if (storedToken) {
      const decodedToken = jwtDecode<DecodedToken>(
        storedToken.replace("Bearer ", "")
      );
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp > currentTime) {
        setToken(storedToken);
        setIsAuthenticated(true);
        setUsername(decodedToken.sub);
        setIsAdmin(decodedToken.isAdmin);

        apiClient.interceptors.request.use((config) => {
          config.headers!.Authorization = storedToken;
          return config;
        });
      } else {
        sessionStorage.removeItem("token");
      }
    }
  }, [storedToken]);

  async function login(username: string, password: string): Promise<boolean> {
    try {
      const response = await executeJwtAuthenticationService(
        username,
        password
      );

      if (response.status === 200) {
        const jwtToken = "Bearer " + response.data.token;
        setIsAuthenticated(true);
        setUsername(username);
        setToken(jwtToken);
        setIsAdmin(response.data.token.isAdmin);

        sessionStorage.setItem("token", jwtToken);

        // Intercept all URLs and request an auth token
        apiClient.interceptors.request.use((config) => {
          config.headers!.Authorization = jwtToken;
          return config;
        });

        return true;
      } else {
        logout();
        return false;
      }
    } catch (err) {
      logout();
      return false;
    }
  }

  function logout(): void {
    setIsAuthenticated(false);
    setToken(null);
    setUsername(null);
    sessionStorage.removeItem("token");
  }

  const valueToBeShared: AuthContextType = {
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
    username,
    setUsername,
    token,
    setToken,
    storedToken,
    isAdmin,
    setIsAdmin,
  };

  return (
    <AuthContext.Provider value={valueToBeShared}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
