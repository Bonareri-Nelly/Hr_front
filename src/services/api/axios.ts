// Compatibility module: older features import this path. Keep all requests on
// the shared authenticated client defined in api.ts.
export { default } from "./api";
/*

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    const refreshToken = localStorage.getItem("refresh_token");

    const requestUrl = originalRequest?.url ?? "";
    const isAuthRequest = requestUrl.includes("auth/login/") || requestUrl.includes("auth/register/") || requestUrl.includes("auth/token/refresh/");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      refreshToken &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post<{ access: string }>(
          `${api.defaults.baseURL}auth/token/refresh/`,
          { refresh: refreshToken },
        );

        localStorage.setItem("access_token", response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("rememberMe");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
*/
