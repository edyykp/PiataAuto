import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  return { user, logout, isAuthenticated: Boolean(user) };
};
