import { create } from "zustand";
import { UserProfile } from "@/types/models";
import { authService } from "@/services/authService";

type AuthState = {
  user: UserProfile | null;
  isBootstrapping: boolean;
  setUser: (user: UserProfile | null) => void;
  updateUser: (patch: Partial<UserProfile>) => void;
  bootstrap: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isBootstrapping: true,
  setUser: (user) => set({ user }),
  updateUser: (patch) => set((state) => ({ user: state.user ? { ...state.user, ...patch } : null })),
  bootstrap: async () => {
    const user = await authService.restoreSession();
    set({ user, isBootstrapping: false });
  },
  logout: async () => {
    await authService.logout();
    set({ user: null });
  },
}));
