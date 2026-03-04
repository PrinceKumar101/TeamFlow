import { getMe } from "@/api/auth.api";
import type { User } from "@/types/auth";

/**
 * Standalone auth check — useful outside React component tree.
 * Returns the User object when authenticated, null otherwise.
 */
export const checkAuth = async (): Promise<User | null> => {
  try {
    const data = await getMe();
    return data?.data ?? null;
  } catch {
    return null;
  }
};

/** Boolean shorthand */
export const isAuthenticated = async (): Promise<boolean> => {
  return (await checkAuth()) !== null;
};

