import api from "./axios";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  employee_id?: number;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user?: AuthUser;
}

export interface RegisterRequest extends LoginRequest {
  email: string;
  phone_number?: string;
}

export const login = async (credentials: LoginRequest) => {
  const response = await api.post<LoginResponse>("auth/login/", credentials);

  return response.data;
};

export const register = async (payload: RegisterRequest) => {
  const response = await api.post<AuthUser>("auth/register/", payload);

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get<AuthUser>("auth/me/");

  return response.data;
};

export const refreshAccessToken = async (refresh: string) => {
  const response = await api.post<{ access: string }>("auth/token/refresh/", { refresh });

  return response.data;
};

export const logout = async () => {
  const refresh = localStorage.getItem("refresh_token");

  if (refresh) {
    await api.post("auth/logout/", { refresh });
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("rememberMe");
};
