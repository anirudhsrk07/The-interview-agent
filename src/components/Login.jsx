import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  BarChart3,
  Rocket,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Zap,
  X,
  Send,
  AlertCircle
} from "lucide-react";
import { login, loginDemoUser } from "../services/authService";

export default function Login({ onLoginSuccess, onNavigateSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Validation Error States
  const [errors, setErrors] = useState({});

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSubmitted, setResetSubmitted] = useState(false);

  // Validate Login Form
  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!password) {
      newErrors.password = "Please enter your password.";
    } else if (password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const user = await login(email, password);
      setIsLoading(false);
      if (onLoginSuccess) onLoginSuccess(user);
    } catch (err) {
      setIsLoading(false);
      setErrors({ general: err.message || "Failed to sign in. Please try again." });
    }
  };

  // Instant Demo Account Login
  const handleDemoLogin = () => {
    const user = loginDemoUser();
    if (onLoginSuccess) onLoginSuccess(user);
  };

  // Password Reset Submit
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) return;
    setResetSubmitted(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setResetSubmitted(false);
      setResetEmail("");
    }, 2200);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        {/* LEFT COLUMN: BRANDING & FEATURES */}
        <motion.div
          className="auth-branding-panel glass-panel"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="branding-top">
            <div className="brand-logo-group">
              <div className="brand-icon-box">
                <Sparkles size={24} color="#06070a" />
              </div>
              <span className="brand-name text-gradient-gold">MOCKIFY</span>
            </div>

            <span className="branding-tagline">Your AI-Powered Interview Coach</span>
            <h2 className="branding-heading">
              Practice smarter. <br />
              Interview better. <br />
              <span className="text-gradient-gold">Get hired.</span>
            </h2>
          </div>

          <div className="branding-features-list">
            <div className="bfeature-item">
              <div className="bfeature-icon gold">
                <Bot size={20} />
              </div>
              <div>
                <h4>AI-Powered Interviews</h4>
                <p>Real-time speech & logic evaluation tailored to your target job role.</p>
              </div>
            </div>

            <div className="bfeature-item">
              <div className="bfeature-icon emerald">
                <BarChart3 size={20} />
              </div>
              <div>
                <h4>Personalized Feedback</h4>
                <p>Instant scoring breakdowns for technical depth, tone, and STAR method.</p>
              </div>
            </div>

            <div className="bfeature-item">
              <div className="bfeature-icon purple">
                <Rocket size={20} />
              </div>
              <div>
                <h4>Track Readiness</h4>
                <p>Visualize your progress ring and FAANG candidate benchmarks.</p>
              </div>
            </div>
          </div>

          <div className="branding-footer">
            <span>© {new Date().getFullYear()} Mockify AI Platform. All rights reserved.</span>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: LOGIN FORM */}
        <motion.div
          className="auth-form-panel glass-panel"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="auth-form-header">
            <h3>Welcome back 👋</h3>
            <p>Sign in to continue your interview preparation.</p>
          </div>

          {errors.general && (
            <div className="auth-error-banner">
              <AlertCircle size={16} /> {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Email Field */}
            <div className="auth-input-group">
              <label>Email Address</label>
              <div className={`auth-input-wrapper ${errors.email ? "error" : ""}`}>
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  placeholder="Enter your email"
                  required
                />
              </div>
              {errors.email && <span className="input-error-msg">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="auth-input-group">
              <label>Password</label>
              <div className={`auth-input-wrapper ${errors.password ? "error" : ""}`}>
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="pw-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="input-error-msg">{errors.password}</span>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="auth-row-between">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-pw-btn"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot Password?
              </button>
            </div>

            {/* Primary Submit Button */}
            <button type="submit" className="btn-primary auth-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>Signing in...</>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="auth-divider">
              <span>OR</span>
            </div>

            {/* Google Social Login */}
            <button
              type="button"
              className="social-auth-btn"
              onClick={handleDemoLogin}
              title="Sign in with Google"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.28v3.15C3.26 21.3 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.28C.46 8.21 0 10.05 0 12s.46 3.79 1.28 5.42l4-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.7 1.28 6.58l4 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* HACKATHON DEMO ACCOUNT BUTTON */}
            <div className="demo-account-box">
              <button type="button" className="btn-secondary demo-login-btn" onClick={handleDemoLogin}>
                <Zap size={16} color="#d4af37" /> Try Demo Account (Instant Login)
              </button>
            </div>
          </form>

          {/* Switch to Signup */}
          <div className="auth-switch-prompt">
            <span>Don't have an account?</span>
            <button type="button" className="switch-link-btn" onClick={onNavigateSignup}>
              Create an account
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="auth-trust-footer">
            <span className="trust-title">Your interview preparation, all in one place:</span>
            <div className="trust-pills">
              <span>✓ AI-powered practice</span>
              <span>✓ Personalized feedback</span>
              <span>✓ Progress tracking</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content auth-reset-modal glass-panel"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Lock size={20} color="#d4af37" />
                  <h4>Reset your password</h4>
                </div>
                <button className="modal-close-btn" onClick={() => setShowForgotModal(false)}>
                  <X size={18} />
                </button>
              </div>

              {!resetSubmitted ? (
                <form onSubmit={handleResetPasswordSubmit} style={{ marginTop: "16px" }}>
                  <p className="reset-modal-desc">
                    Enter your registered email address below and we'll send you a password reset link.
                  </p>

                  <div className="auth-input-group">
                    <label>Email Address</label>
                    <div className="auth-input-wrapper">
                      <Mail size={18} className="input-icon" />
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "20px" }}>
                    <Send size={16} /> Send Reset Link
                  </button>
                </form>
              ) : (
                <div className="reset-success-box">
                  <CheckCircle2 size={40} color="#34d399" />
                  <h4>Reset Link Sent!</h4>
                  <p>Check <strong>{resetEmail}</strong> for instructions to reset your password.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
