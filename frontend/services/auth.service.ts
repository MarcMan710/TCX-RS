import { api } from "./api";

/**
 * Data structures matching Go authentication models & responses
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Key name used for persisting JWT token in LocalStorage
 */
const TOKEN_KEY = "auth_token";

export const authService = {
  /**
   * Register a new user account
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const data = await api.post<AuthResponse>("/auth/register", payload);
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  /**
   * Log in an existing user and save JWT token
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const data = await api.post<AuthResponse>("/auth/login", payload);
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  /**
   * Retrieve current authenticated user profile using token
   */
  async getCurrentUser(): Promise<User> {
    return await api.get<User>("/auth/me");
  },

  /**
   * Log out the user, invalidate backend session (if supported), and clear token
   */
  async logout(): Promise<void> {
    try {
      // Optional: notify backend to invalidate token session
      await api.post("/auth/logout");
    } catch {
      // Ignore network/server errors during logout cleanup
    } finally {
      this.removeToken();
    }
  },

  /**
   * Helper: Save JWT Token to local storage
   */
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  /**
   * Helper: Retrieve stored JWT Token
   */
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  /**
   * Helper: Clear token from storage
   */
  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  /**
   * Helper: Quick check if auth token exists
   */
  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },
};

export default authService;