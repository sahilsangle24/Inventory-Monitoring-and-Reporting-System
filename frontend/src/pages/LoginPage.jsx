import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { ValidationUtils } from "../utilities/ValidationUtils";
import "../styles/login.css";

function LiveInventoryAnimation() {
  return (
    <div className="login-live-visual">
      <div className="live-visual-header">
        <div>
          <span className="live-status-dot" />
          LIVE INVENTORY ACTIVITY
        </div>
        <span className="live-status-text">● REAL TIME</span>
      </div>

      <svg
        className="live-chart"
        viewBox="0 0 700 260"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="inventoryGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="inventoryArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {Array.from({ length: 8 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={30 + i * 30}
            x2="700"
            y2={30 + i * 30}
            stroke="#818cf8"
            strokeOpacity="0.12"
            strokeDasharray="4 8"
          />
        ))}

        <path
          className="chart-area"
          d="M0 180 C55 160 65 205 120 150 S205 180 250 115 S330 160 380 105 S460 145 510 75 S600 125 700 45 L700 260 L0 260 Z"
          fill="url(#inventoryArea)"
        />

        <path
          className="chart-line chart-line-main"
          d="M0 180 C55 160 65 205 120 150 S205 180 250 115 S330 160 380 105 S460 145 510 75 S600 125 700 45"
          fill="none"
          stroke="url(#inventoryGradient)"
          strokeWidth="3"
        />

        <path
          className="chart-line chart-line-secondary"
          d="M0 215 C70 195 90 225 150 190 S250 215 310 175 S400 210 465 160 S570 190 700 125"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
        />

        <path
          className="chart-line chart-line-tertiary"
          d="M0 125 C70 145 90 100 155 125 S255 85 320 115 S420 65 480 100 S590 55 700 80"
          fill="none"
          stroke="#c084fc"
          strokeWidth="2"
        />

        <circle className="chart-pulse" cx="250" cy="115" r="5" />
        <circle className="chart-pulse pulse-two" cx="510" cy="75" r="5" />
        <circle className="chart-pulse pulse-three" cx="380" cy="105" r="4" />
      </svg>

      <div className="live-visual-footer">
        <span>STOCK MOVEMENT</span>
        <span>SUPPLY MONITORING</span>
        <span>ANALYTICS</span>
      </div>
    </div>
  );
}

function LoginParticles() {
  return (
    <div className="login-particles" aria-hidden="true">
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          className="login-particle"
          style={{
            "--i": i,
            "--x": `${(i * 37 + 11) % 100}%`,
            "--duration": `${9 + (i % 8) * 1.5}s`,
            "--delay": `${-(i % 9) * 1.7}s`,
            "--size": `${2 + (i % 3)}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { theme, toggle } = useTheme();

  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiErr, setApiErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = ValidationUtils.validateLogin(form);

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setApiErr("");

    try {
      const result = await login(form.username, form.password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setApiErr("Invalid username or password. Please try again.");
      }
    } catch {
      setApiErr("Unable to sign in. Please try again.");
    }
  };

  return (
    <div className={`login-root login-theme-${theme}`}>
      <LoginParticles />

      <button
        className="login-theme-toggle"
        onClick={toggle}
        title="Toggle theme"
        type="button"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? "☀" : "☾"}
      </button>

      {/* Branding panel */}
      <div className="login-brand">
        <div className="login-brand-logo">
          <div className="login-brand-dot" />
          InvenTrack
          <span className="brand-version">INVENTORY PRO</span>
        </div>

        <div className="login-brand-content">
          <span className="login-eyebrow">SMART INVENTORY PLATFORM</span>

          <h1>
            Smart <em>Inventory</em>
            <br />
            Management
          </h1>

          <p>
            Monitor stock levels, generate insightful reports, and keep your
            supply chain running smoothly — all from one dashboard.
          </p>

          <LiveInventoryAnimation />

          <div className="login-brand-stats">
            <div>
              <div className="login-stat-value">Real-time</div>
              <div className="login-stat-label">Monitoring</div>
            </div>
            <div>
              <div className="login-stat-value">Auto</div>
              <div className="login-stat-label">Alerts</div>
            </div>
            <div>
              <div className="login-stat-value">Full</div>
              <div className="login-stat-label">Reports</div>
            </div>
          </div>
        </div>

        <div className="login-brand-footer">
          © {new Date().getFullYear()} InvenTrack · Inventory Management
        </div>
      </div>

      {/* Login panel */}
      <div className="login-form-panel">
        <div className="login-glass-card">
          <div className="login-card-icon">
            <span>↗</span>
          </div>

          <span className="login-eyebrow">WELCOME BACK</span>
          <h2>Sign in to InvenTrack</h2>
          <p className="sub">
            Enter your credentials to access your dashboard.
          </p>

          {apiErr && (
            <div className="login-error" role="alert">
              <span>⚠</span> {apiErr}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-username">Username</label>
              <input
                id="login-username"
                type="text"
                value={form.username}
                onChange={set("username")}
                placeholder="Enter your username"
                autoComplete="username"
                autoFocus
              />
              {errors.username && (
                <div className="error-msg">{errors.username}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>

              <div className="password-input-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <div className="error-msg">{errors.password}</div>
              )}
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="login-links">
            <span>Don't have an account?</span>
            <button
              type="button"
              className="login-link"
              onClick={() => navigate("/register")}
            >
              Create account
            </button>
          </div>

          <div className="login-secure-note">
            <span>✦</span> Secure access to your inventory workspace
          </div>
        </div>
      </div>
    </div>
  );
}
