import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/$/, "");

const ACCESS_TOKEN_KEY = "hr_payroll_access_token";
const REFRESH_TOKEN_KEY = "hr_payroll_refresh_token";

export class ApiError extends Error {
  readonly status?: number;
  readonly fields?: Record<string, string[]>;

  constructor(message: string, status?: number, fields?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_TOKEN_KEY) ?? localStorage.getItem("access_token"),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY) ?? localStorage.getItem("refresh_token"),
  set: ({ access, refresh }: { access: string; refresh: string }) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("current_user");
  },
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<Record<string, unknown>>) => {
    const request = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    const requestUrl = request?.url ?? "";
    const isAuthRequest =
      requestUrl.includes("/auth/login/") ||
      requestUrl.includes("auth/login/") ||
      requestUrl.includes("/auth/register/") ||
      requestUrl.includes("auth/register/") ||
      requestUrl.includes("/auth/token/refresh/") ||
      requestUrl.includes("auth/token/refresh/");

    if (error.response?.status === 401 && request && !request._retried && !isAuthRequest) {
      request._retried = true;
      refreshPromise ??= axios
        .post<{ access: string }>(`${API_BASE_URL}/auth/token/refresh/`, { refresh: tokenStore.getRefresh() }, { timeout: 5000 })
        .then(({ data }) => {
          localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
          localStorage.setItem("access_token", data.access);
          return data.access;
        })
        .catch(() => {
          tokenStore.clear();
          return null;
        })
        .finally(() => {
          refreshPromise = null;
        });

      const access = await refreshPromise;
      if (access) {
        request.headers.Authorization = `Bearer ${access}`;
        return api(request);
      }
    }

    const data = error.response?.data;
    const message = (data?.detail ?? data?.message ?? (error.code === "ECONNABORTED" ? "The server is taking too long to respond. Make sure the backend is running." : "The request could not be completed.")) as string;
    return Promise.reject(new ApiError(message, error.response?.status, data as Record<string, string[]> | undefined));
  },
);

export default api;
