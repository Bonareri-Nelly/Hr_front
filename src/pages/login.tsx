import { ArrowRight, Building2, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type LoginErrors = {
  email?: string;
  password?: string;
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
    () => email.trim().length > 0 && password.trim().length > 0 && !isLoading,
    [email, isLoading, password],
  );

  function validate() {
    const nextErrors: LoginErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid work email.";
    }

    if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      localStorage.setItem("token", "nexus-auth-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          email,
          name: "Angela Njeri",
          rememberMe,
          role: "Payroll Admin",
        }),
      );
      navigate("/dashboard");
    }, 650);
  }

  return (
    <main className="login-screen">
      <section className="login-hero" aria-label="Nexus HR and Payroll">
        <div className="login-brand-row">
          <span className="brand-mark">N</span>
          <div>
            <div className="brand-name">Nexus</div>
            <div className="brand-subtitle">HR &amp; Payroll</div>
          </div>
        </div>

        <div className="login-hero-copy">
          <p className="page-kicker">Secure workforce operations</p>
          <h1>Run payroll, approvals, and people operations from one command center.</h1>
          <p>
            A focused workspace for HR teams managing branch payroll, employee records,
            statutory compliance, attendance, benefits, and approvals.
          </p>
        </div>

        <div className="login-signal-grid" aria-label="Platform focus areas">
          {trustedSignals.map((signal) => (
            <div className="login-signal" key={signal}>
              <ShieldCheck aria-hidden="true" size={18} />
              <span>{signal}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="login-form-panel" aria-label="Sign in">
        <div className="login-mobile-brand">
          <span className="brand-mark">N</span>
          <div>
            <div className="login-mobile-title">Nexus</div>
            <div className="brand-subtitle">HR &amp; Payroll</div>
          </div>
        </div>

        <div className="login-form-heading">
          <div className="login-form-icon">
            <Building2 aria-hidden="true" size={21} />
          </div>
          <div>
            <h2>Welcome back</h2>
            <p>Sign in to continue to your HR workspace.</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label className="field-group" htmlFor="email">
            <span>Email address</span>
            <div className={`input-shell${errors.email ? " input-shell-error" : ""}`}>
              <Mail aria-hidden="true" size={18} />
              <input
                id="email"
                autoComplete="email"
                inputMode="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="hr@company.com"
                type="email"
                value={email}
              />
            </div>
            {errors.email ? <small>{errors.email}</small> : null}
          </label>

          <label className="field-group" htmlFor="password">
            <span>Password</span>
            <div className={`input-shell${errors.password ? " input-shell-error" : ""}`}>
              <Lock aria-hidden="true" size={18} />
              <input
                id="password"
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="input-icon-button"
                onClick={() => setShowPassword((visible) => !visible)}
                type="button"
              >
                {showPassword ? <EyeOff aria-hidden="true" size={17} /> : <Eye aria-hidden="true" size={17} />}
              </button>
            </div>
            {errors.password ? <small>{errors.password}</small> : null}
          </label>

          <div className="login-options">
            <label className="checkbox-row" htmlFor="remember-me">
              <input
                checked={rememberMe}
                id="remember-me"
                onChange={(event) => setRememberMe(event.target.checked)}
                type="checkbox"
              />
              <span>Remember me</span>
            </label>
            <button className="text-button" type="button">
              Reset password
            </button>
          </div>

          <button className="button button-primary login-submit" disabled={!canSubmit} type="submit">
            {isLoading ? "Signing in..." : "Sign in"}
            <ArrowRight aria-hidden="true" size={16} />
          </button>
        </form>
      </section>
    </main>
  );
}
