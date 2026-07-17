import api, { tokenStore } from "./api";

export type CurrentUser = { id: number; username: string; email: string; phone_number?: string; role?: { id: number; name: string } | null; is_approved: boolean; is_active: boolean };
type LoginResponse = { access: string; refresh: string; user: CurrentUser; message: string };

function requireText(value: string, field: string, minLength = 1) {
  if (value.trim().length < minLength) throw new Error(`${field} must contain at least ${minLength} characters.`);
}

export const authApi = {
  async login(payload: { username: string; password: string }) {
    requireText(payload.username, "Username"); requireText(payload.password, "Password", 6);
    const { data } = await api.post<LoginResponse>("/auth/login/", payload);
    tokenStore.set(data); localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },
  async logout() { await api.post("/auth/logout/", { refresh: tokenStore.getRefresh() }); tokenStore.clear(); },
  me: async () => (await api.get<CurrentUser>("/auth/me/")).data,
  updateProfile: async (payload: { email?: string; phone_number?: string; profile_picture?: File | null }) => {
    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) throw new Error("Enter a valid email address.");
    return (await api.put<{ user: CurrentUser }>("/auth/profile/", payload)).data;
  },
  changePassword: async (payload: { old_password: string; new_password: string }) => {
    requireText(payload.old_password, "Current password"); requireText(payload.new_password, "New password", 8);
    return api.post("/auth/change-password/", payload);
  },
};
