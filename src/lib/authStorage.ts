const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";
const AUTH_CHANGE_EVENT = "auth-storage-change";

export interface AuthUser {
  id: string;
  google_user_id: string;
  name: string;
  email: string;
  roles: string[];
  account_status: string;
  requires_action?: string;
  pendingUserConfigId?: string;
}

export const authStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getUser: (): AuthUser | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setTokens: (accessToken: string, refreshToken: string, user: AuthUser) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: { accessToken, refreshToken, user } }));
  },

  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: null }));
  },

  hasValidToken: (): boolean => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  subscribeToAuthChanges: (callback: (event: CustomEvent) => void) => {
    window.addEventListener(AUTH_CHANGE_EVENT, callback as EventListener);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, callback as EventListener);
  }
};
