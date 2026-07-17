export { authApi as default, authApi } from "./api/auth";
export const login = (credentials: { username: string; password: string }) => import("./api/auth").then(({ authApi }) => authApi.login(credentials));
