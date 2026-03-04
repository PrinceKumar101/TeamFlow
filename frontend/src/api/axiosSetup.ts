import axios from "axios";
import store from "@/store/store";
import { clearUser } from "@/store/slices/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/")
    ) {
      // Clear Redux auth state — route guards will handle the redirect
      store.dispatch(clearUser());
    }
    return Promise.reject(error);
  },
);

export default api;
