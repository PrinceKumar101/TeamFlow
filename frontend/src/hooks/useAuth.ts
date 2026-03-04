import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginUser, registerUser, getMe, logoutUser } from "@/api/auth.api";
import { useAppDispatch } from "./redux";
import { setUser, clearUser } from "@/store/slices/authSlice";
import type { User } from "@/types/auth";

export const authKeys = {
  me: ["auth", "me"] as const,
};

// ─── Login ────────────────────────────────────────────────────────
export const useLoginMutation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const user: User = data.data;
      dispatch(setUser(user));
      queryClient.setQueryData(authKeys.me, user);
    },
  });
};

// ─── Signup ───────────────────────────────────────────────────────
export const useSignupMutation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      const user: User = data.data;
      dispatch(setUser(user));
      queryClient.setQueryData(authKeys.me, user);
    },
  });
};

// ─── Session restoration on app load ──────────────────────────────
export const useAuthInit = () => {
  const dispatch = useAppDispatch();

  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      const data = await getMe();
      const user: User = data.data;
      dispatch(setUser(user));
      return user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Logout ───────────────────────────────────────────────────────
export const useLogoutMutation = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(clearUser());
      queryClient.removeQueries({ queryKey: authKeys.me });
    },
  });
};
