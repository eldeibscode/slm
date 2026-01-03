export enum Role {
  USER = 'USER',
  REPORTER = 'REPORTER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: number;
  email: string;
  name?: string;
  role: Role;
  isArchived: boolean;
  createdAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
