import api, { tokenStore } from "./api";

export type CurrentUser = {
  id: number;
  username: string;
  email?: string;
  phone_number?: string;
  role?: string | { id: number; name: string } | null;
  user_role?: string;
  role_name?: string;
  group?: string;
  groups?: Array<string | { id?: number; name?: string }>;
  employee_id?: number;
  branch_name?: string;
  department_name?: string;
  is_approved?: boolean;
  is_active?: boolean;
};

type LoginResponse = {
  access: string;
  refresh: string;
  user?: CurrentUser;
  message?: string;
};

function requireText(value: string, field: string, minLength = 1) {
  if (value.trim().length < minLength) {
    throw new Error(`${field} must contain at least ${minLength} characters.`);
  }
}

const persistUser = (user: CurrentUser) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("current_user", JSON.stringify(user));

  if (user.employee_id) {
    localStorage.setItem("employee_id", String(user.employee_id));
  }
};

export const authApi = {
  async login(payload: { username: string; password: string }) {
    requireText(payload.username, "Username");
    requireText(payload.password, "Password", 6);

    tokenStore.clear();
    const { data } = await api.post<LoginResponse>("/auth/login/", payload);
    tokenStore.set(data);

    const user = data.user ?? { id: 0, username: payload.username };
    persistUser(user);

    return { ...data, user };
  },
  async logout() {
    try {
      await api.post("/auth/logout/", { refresh: tokenStore.getRefresh() });
    } finally {
      tokenStore.clear();
    }
  },
  me: async () => {
    const user = (await api.get<CurrentUser>("/auth/me/", { timeout: 3000 })).data;
    persistUser(user);
    return user;
  },
  updateProfile: async (payload: { email?: string; phone_number?: string; profile_picture?: File | null }) => {
    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      throw new Error("Enter a valid email address.");
    }
    return (await api.put<{ user: CurrentUser }>("/auth/profile/", payload)).data;
  },
  changePassword: async (payload: { old_password: string; new_password: string }) => {
    requireText(payload.old_password, "Current password");
    requireText(payload.new_password, "New password", 8);
    return api.post("/auth/change-password/", payload);
  },
};

export const login = authApi.login;
export const logout = authApi.logout;
export const getCurrentUser = authApi.me;
