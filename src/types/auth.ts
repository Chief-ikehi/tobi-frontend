export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginResponse {
  login: AuthResponse;
}

export interface RegisterResponse {
  register: AuthResponse;
}

export interface GoogleAuthInput {
  email: string;
  name: string;
  image?: string;
}

export interface GoogleAuthResponse {
  googleAuth: AuthResponse;
} 