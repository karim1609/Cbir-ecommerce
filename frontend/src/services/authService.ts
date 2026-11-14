import type { User, LoginCredentials, RegisterData } from '../types';
import { mockUser } from '../utils/mockData';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  // TODO: Replace with real API call: POST /api/auth/login/
  await delay(800);
  if (!credentials.email || !credentials.password) {
    throw new Error('Invalid credentials');
  }
  if (credentials.password.length < 3) {
    throw new Error('Invalid email or password');
  }
  const token = 'mock-jwt-token-' + Date.now();
  localStorage.setItem('cbir_token', token);
  localStorage.setItem('cbir_user', JSON.stringify(mockUser));
  return { user: mockUser, token };
}

export async function register(data: RegisterData): Promise<{ user: User; token: string }> {
  // TODO: Replace with real API call: POST /api/auth/register/
  await delay(1000);
  if (data.password !== data.confirmPassword) {
    throw new Error('Passwords do not match');
  }
  const newUser: User = {
    ...mockUser,
    id: Date.now(),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    createdAt: new Date().toISOString(),
  };
  const token = 'mock-jwt-token-' + Date.now();
  localStorage.setItem('cbir_token', token);
  localStorage.setItem('cbir_user', JSON.stringify(newUser));
  return { user: newUser, token };
}

export async function logout(): Promise<void> {
  // TODO: Replace with real API call: POST /api/auth/logout/
  await delay(200);
  localStorage.removeItem('cbir_token');
  localStorage.removeItem('cbir_user');
}

export async function getCurrentUser(): Promise<User> {
  // TODO: Replace with real API call: GET /api/auth/me/
  await delay(200);
  const stored = localStorage.getItem('cbir_user');
  if (!stored) throw new Error('Not authenticated');
  return JSON.parse(stored) as User;
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  // TODO: Replace with real API call: PATCH /api/auth/profile/
  await delay(600);
  const stored = localStorage.getItem('cbir_user');
  const current: User = stored ? (JSON.parse(stored) as User) : mockUser;
  const updated = { ...current, ...data };
  localStorage.setItem('cbir_user', JSON.stringify(updated));
  return updated;
}
