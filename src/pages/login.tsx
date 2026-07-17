import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, login } from "../services/api/auth";
import { getDefaultRouteForRole } from "../services/permissions";

type LoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};

const trustedSignals = [
  "Payroll approvals",
  "Branch operations",
  "Compliance reporting",
];

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const canSubmit = useMemo(
    () =>
      email.trim().length > 0 &&
      password.trim().length > 0 &&
      !isLoading,
    [email, password, isLoading]
  );

  function validate() {
    const nextErrors: LoginErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const username = email.trim();
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("current_user");

      const response = await login({
        username,
        password,
      });

      localStorage.setItem("access_token", response.access);
      localStorage.setItem("refresh_token", response.refresh);

      let signedInUser = response.user;

      if (!signedInUser) {
        try {
          signedInUser = await getCurrentUser();
        } catch {
          signedInUser = { id: 0, username };
        }
      }

      const rawUser = signedInUser as unknown as Record<string, unknown>;
      const roleValue = rawUser.role ?? rawUser.role_name ?? rawUser.user_role ?? null;
      const normalizedUser = {
        ...signedInUser,
        role: typeof roleValue === "object" && roleValue !== null && "name" in roleValue ? (roleValue as { name?: string }).name : roleValue,
        role_name: typeof roleValue === "object" && roleValue !== null && "name" in roleValue ? (roleValue as { name?: string }).name : roleValue,
      };

      localStorage.setItem("current_user", JSON.stringify(normalizedUser));

      if (signedInUser.employee_id) {
        localStorage.setItem("employee_id", String(signedInUser.employee_id));
      }

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      navigate(getDefaultRouteForRole(), { replace: true });
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Unable to sign in right now. Please try again.";

      setErrors({
        form: backendMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-screen">
      <section className="login-hero">
        <div className="login-brand-row">
          <span className="brand-mark">N</span>

          <div>
            <div className="brand-name">OPTIMUM</div>
            <div className="brand-subtitle">HR & Payroll</div>
          </div>
        </div>

        <div className="login-hero-copy">
          <p className="page-kicker">
            Secure workforce operations
          </p>

          <h1>
            Run payroll, approvals, and people operations
            from one command center.
          </h1>

          <p>
            A focused workspace for HR teams managing
            branch payroll, employee records,
            statutory compliance, attendance,
            benefits, and approvals.
          </p>
        </div>

        <div className="login-signal-grid">
          {trustedSignals.map((signal) => (
            <div
              className="login-signal"
              key={signal}
            >
              <ShieldCheck size={18} />

              <span>{signal}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-mobile-brand">
          <span className="brand-mark">N</span>

          <div>
            <div className="login-mobile-title">
              OPTIMUM
            </div>

            <div className="brand-subtitle">
              HR & Payroll
            </div>
          </div>
        </div>

        <div className="login-form-heading">
          <div className="login-form-icon">
            <Building2 size={21} />
          </div>

          <div>
            <h2>Welcome back</h2>

            <p>
              Sign in to continue to your HR
              workspace.
            </p>
          </div>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <label
            className="field-group"
            htmlFor="email"
          >
            <span>Email / Username</span>

            <div
              className={`input-shell${
                errors.email
                  ? " input-shell-error"
                  : ""
              }`}
            >
              <Mail size={18} />

              <input
                id="email"
                type="text"
                placeholder="admin"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            {errors.email && (
              <small>{errors.email}</small>
            )}
          </label>

          <label
            className="field-group"
            htmlFor="password"
          >
            <span>Password</span>

            <div
              className={`input-shell${
                errors.password
                  ? " input-shell-error"
                  : ""
              }`}
            >
              <Lock size={18} />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                placeholder="Enter password"
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button
                type="button"
                className="input-icon-button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>

            {errors.password && (
              <small>{errors.password}</small>
            )}
          </label>

          <div className="login-options">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(
                    e.target.checked
                  )
                }
              />

              <span>Remember me</span>
            </label>

            <button
              className="text-button"
              type="button"
            >
              Reset password
            </button>
          </div>
          {errors.form && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errors.form}
            </div>
          )}

          <button
            type="submit"
            className="button button-primary login-submit"
            disabled ={!canSubmit}
          >
            {isLoading
              ? "Signing in..."
              : "Sign in"}

            <ArrowRight size={16} />
          </button>
        </form>
      </section>
    </main>
  );
}