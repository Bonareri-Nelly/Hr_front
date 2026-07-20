import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Building2,
  Eye,
  EyeOff,
  Lock,
  LoaderCircle,
  Mail,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/services/authService";
import { getDefaultRouteForRole } from "../services/permissions";

type LoginErrors = {
  email?: string;
  password?: string;
  general?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const canSubmit = useMemo(
    () =>
      email.trim().length > 0 &&
      password.trim().length > 0 &&
      !isLoading,
    [email, password, isLoading]
  );

  function validateField(field: "email" | "password") {
    const value = field === "email" ? email.trim() : password;
    let message = "";
    if (!value) message = field === "email" ? "Enter your username or work email." : "Enter your password.";
    else if (field === "email" && value.includes("@") && !emailPattern.test(value)) message = "Enter a valid work email address.";
    else if (field === "password" && value.length < 6) message = "Password must be at least 6 characters.";
    setErrors((current) => ({ ...current, [field]: message || undefined }));
    return !message;
  }

  function validate() {
    const validEmail = validateField("email");
    const validPassword = validateField("password");
    return validEmail && validPassword;
  }

  function clearGeneralError() {
    setErrors((current) => current.general ? { ...current, general: undefined } : current);
  }

  function describeLoginError(error: unknown) {
    const response = (error as { response?: { status?: number; data?: { message?: string; detail?: string } }; status?: number; message?: string })?.response;
    const status = response?.status ?? (error as { status?: number })?.status;
    const message = (response?.data?.message ?? response?.data?.detail ?? (error as Error)?.message ?? "").toLowerCase();
    if (status === 401 && (message.includes("email") || message.includes("account") || message.includes("not found"))) return "We couldn't find an account with that email.";
    if (status === 401) return "Incorrect password. Try again or reset it.";
    if (status === 403 || message.includes("inactive") || message.includes("pending approval") || message.includes("locked")) return "This account is inactive. Contact your HR admin.";
    return "Something went wrong on our end. Please try again.";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await login({
        username: email,
        password,
      });

      // Tokens and the documented user object are persisted by the auth API.
      localStorage.setItem("rememberMe", String(rememberMe));

      navigate(getDefaultRouteForRole());

    } catch (error: unknown) {
      setErrors({ general: describeLoginError(error) });

    } finally {
      setIsLoading(false);
    }
  }

  function requestPasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!emailPattern.test(resetEmail.trim())) return;
    setResetMessage("If an account exists for this email, password reset instructions will be sent shortly.");
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
          <p className="page-kicker">Secure workforce operations</p>

          <h1>
            Run payroll, approvals, and <span>people operations</span> from one command center.
          </h1>

          <p>
            A focused workspace for HR teams managing branch payroll,
            employee records, statutory compliance, attendance, benefits,
            and approvals.
          </p>
        </div>

        <div className="login-command-preview" aria-hidden="true">
          <div className="command-preview-topline"><span>OPERATIONS OVERVIEW</span><Sparkles size={14} /></div>
          <div className="command-preview-metrics">
            <div><Activity size={17} /><span>Workforce</span><strong>In sync</strong></div>
            <div><BarChart3 size={17} /><span>Reporting</span><strong>Ready</strong></div>
          </div>
          <div className="command-preview-line"><i /><i /><i /></div>
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


      <section className="login-form-panel" aria-label="Sign in">

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


        <form className="login-form" onSubmit={handleSubmit} noValidate>

          {errors.general && <div className="login-error-banner" role="alert"><AlertCircle size={18} /><span>{errors.general}</span><button type="button" aria-label="Dismiss error" onClick={() => setErrors((current) => ({ ...current, general: undefined }))}><X size={16} /></button></div>}


          <label className="field-group" htmlFor="email">

            <span>Username or email</span>

            <div
              className={`input-shell${
                errors.email ? " input-shell-error" : ""
              }`}
            >

              <Mail aria-hidden="true" size={18} />

              <input
                id="email"
                autoComplete="username"
                onBlur={() => validateField("email")}
                onChange={(event) => { setEmail(event.target.value); clearGeneralError(); }}
                placeholder="Username or hr@company.com"
                type="text"
                value={email}
              />

            </div>

            {errors.email && <small>{errors.email}</small>}

          </label>



          <label className="field-group" htmlFor="password">

            <span>Password</span>

            <div
              className={`input-shell${
                errors.password ? " input-shell-error" : ""
              }`}
            >

              <Lock aria-hidden="true" size={18} />

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                placeholder="Enter password"
                onBlur={() => validateField("password")}
                onChange={(e) => { setPassword(e.target.value); clearGeneralError(); }}
              />


              <button
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                className="input-icon-button"
                onClick={() =>
                  setShowPassword((visible) => !visible)
                }
                type="button"
              >

                {showPassword ? (
                  <EyeOff aria-hidden="true" size={17} />
                ) : (
                  <Eye aria-hidden="true" size={17} />
                )}

              </button>

            </div>


            {errors.password && <small>{errors.password}</small>}

          </label>



          <div className="login-options">

            <label className="checkbox-row" htmlFor="remember-me">

              <input
                type="checkbox"
                checked={rememberMe}
                id="remember-me"
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
              />

              <span>Remember me</span>

            </label>


            <button className="text-button" type="button" onClick={() => { setResetEmail(email.includes("@") ? email : ""); setResetMessage(""); setShowReset(true); }}>
              Reset password
            </button>

          </div>



          <button
            className="button button-primary login-submit"
            disabled={!canSubmit}
            type="submit"
          >

            {isLoading ? <><LoaderCircle aria-hidden="true" className="login-spinner" size={17} /> Signing in…</> : <>Sign in <ArrowRight aria-hidden="true" size={16} /></>}

          </button>

          <div className="login-security-note"><ShieldCheck size={15} /> Your session is protected with secure token authentication.</div>


        </form>

      </section>

      {showReset && <div className="reset-modal-backdrop" role="presentation" onMouseDown={() => setShowReset(false)}><section className="reset-modal" role="dialog" aria-modal="true" aria-labelledby="reset-title" onMouseDown={(event) => event.stopPropagation()}><button className="reset-modal-close" type="button" aria-label="Close reset password dialog" onClick={() => setShowReset(false)}><X size={18} /></button><div className="login-form-icon"><Lock size={21} /></div><h2 id="reset-title">Reset your password</h2>{resetMessage ? <div className="reset-confirmation"><ShieldCheck size={19} /><p>{resetMessage}</p><button className="button button-primary" type="button" onClick={() => setShowReset(false)}>Back to sign in</button></div> : <><p>Enter your work email and we’ll send password reset instructions.</p><form onSubmit={requestPasswordReset}><label className="field-group" htmlFor="reset-email"><span>Work email</span><div className="input-shell"><Mail aria-hidden="true" size={18} /><input id="reset-email" type="email" autoComplete="email" value={resetEmail} onChange={(event) => setResetEmail(event.target.value)} placeholder="hr@company.com" autoFocus /></div></label><button className="button button-primary login-submit" type="submit" disabled={!emailPattern.test(resetEmail.trim())}>Send reset instructions <ArrowRight size={16} /></button></form></>}</section></div>}

      <footer className="login-footer">
        <span>© {new Date().getFullYear()} Optimum HR. All rights reserved.</span>
        <span>Privacy Policy <i /> Terms of Service</span>
      </footer>
    </main>
  );
}
