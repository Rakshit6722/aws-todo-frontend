import { ReactNode } from 'react';

export interface DecodedToken {
    exp: number;
    sub: string;
    isAdmin: boolean;
}

export interface AuthenticationRouteProps {
    children: ReactNode;
}

export interface AuthContextType {
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


export interface ErrorProps{
    message: string;
    status: number;
}

export interface ProfileFormValues{
    password: string;
    password2: string;
}

export interface SignUpFormValues{
    username: string;
    password:string;
    // admin:string;
}

export interface TodoFormValues{
    description: string;
    targetDate: string;
}

export interface Todo{
    id:number;
    username: string;
    description:string;
    done:boolean;
    targetDate:string;
}

export interface UserValues{
    username:string;
    password:string;
    admin: string;
}

export interface User{
    id:number;
    username:string;
    password:string;
    admin:boolean;
}