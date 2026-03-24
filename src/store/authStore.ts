import { create } from 'zustand';

type AuthStatus = 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  userEmail: string | null;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  status: 'unauthenticated',
  userEmail: null,
  signIn: (email, password) => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password.trim()) {
      return;
    }

    set({
      status: 'authenticated',
      userEmail: trimmedEmail,
    });
  },
  signOut: () => {
    set({
      status: 'unauthenticated',
      userEmail: null,
    });
  },
}));
