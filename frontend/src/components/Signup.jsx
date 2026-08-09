import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Bot,
  BarChart3,
  Rocket,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Mail,
  Lock,
  Briefcase,
  Sliders,
  AlertCircle,
  Zap
} from "lucide-react";
import { signup, loginDemoUser } from "../services/authService";

const POPULAR_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Architect",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager"
];

export default function Signup({ onSignupSuccess, onNavigateLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Software Engineer");
  const [experience, setExperience] = useState("Fresher");
  const [isLoading, setIsLoading] = useState(false);

  // Validation Error States
  const [errors, setErrors] = useState({});

  // Validate Sign Up Form
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Please enter your full name.";
    }

    if (!email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email.";
    }

    if (!password) {
      newErrors.password = "Please enter a password.";
    } else if (password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters.";
    }

    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Sign Up
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const newUser = await signup(name, email, password, role, experience);
      setIsLoading(false);
      if (onSignupSuccess) onSignupSuccess(newUser);
    } catch (err) {
      setIsLoading(false);
      setErrors({ general: err.message || "Failed to create account." });
    }
  };

  // Demo Account Login
  const handleDemoLogin = () => {
    const user = loginDemoUser();
    if (onSignupSuccess) onSignupSuccess(user);
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

            <span className="branding-tagline">Start Your Journey Toward Interview Success</span>
            <h2 className="branding-heading">
              Build confidence. <br />
              Master technical rounds. <br />
              <span className="text-gradient-gold">Land your dream role.</span>
            </h2>
          </div>

          <div className="branding-features-list">
            <div className="bfeature-item">
              <div className="bfeature-icon gold">
                <Bot size={20} />
              </div>
              <div>
                <h4>Interactive AI Evaluator</h4>
                <p>Adaptive mock interviews matching senior engineering rubrics.</p>
              </div>
            </div>

            <div className="bfeature-item">
              <div className="bfeature-icon emerald">
                <BarChart3 size={20} />
              </div>
              <div>
                <h4>Readiness Analytics</h4>
                <p>Track your score progression across technical and behavioral rounds.</p>
              </div>
            </div>

            <div className="bfeature-item">
              <div className="bfeature-icon purple">
                <Rocket size={20} />
              </div>
              <div>
                <h4>Live Coding Sandbox</h4>
                <p>Solve algorithm challenges in JS, Python, or Java with instant test evaluation.</p>
              </div>
            </div>
          </div>

          <div className="branding-footer">
            <span>© {new Date().getFullYear()} Mockify AI Platform. All rights reserved.</span>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: SIGNUP FORM */}
        <motion.div
          className="auth-form-panel glass-panel"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="auth-form-header">
            <h3>Create your Mockify account 🚀</h3>
            <p>Start your journey toward interview success.</p>
          </div>

          {errors.general && (
            <div className="auth-error-banner">
              <AlertCircle size={16} /> {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Full Name */}
            <div className="auth-input-group">
              <label>Full Name</label>
              <div className={`auth-input-wrapper ${errors.name ? "error" : ""}`}>
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  placeholder="Anirudh Kulkarni"
                  required
                />
              </div>
              {errors.name && <span className="input-error-msg">{errors.name}</span>}
            </div>

            {/* Email Address */}
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
                  placeholder="anirudh@example.com"
                  required
                />
              </div>
              {errors.email && <span className="input-error-msg">{errors.email}</span>}
            </div>

            {/* Password Grid (Password & Confirm Password) */}
            <div className="form-row-grid">
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
                    placeholder="Min 8 chars"
                    required
                  />
                  <button
                    type="button"
                    className="pw-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <span className="input-error-msg">{errors.password}</span>}
              </div>

              <div className="auth-input-group">
                <label>Confirm Password</label>
                <div className={`auth-input-wrapper ${errors.confirmPassword ? "error" : ""}`}>
                  <Lock size={18} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                    }}
                    placeholder="Re-enter password"
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <span className="input-error-msg">{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            {/* Target Job Role & Experience Level */}
            <div className="form-row-grid">
              <div className="auth-input-group">
                <label>Target Job Role</label>
                <div className="auth-input-wrapper">
                  <Briefcase size={18} className="input-icon" />
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    {POPULAR_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="auth-input-group">
                <label>Experience Level</label>
                <div className="auth-input-wrapper">
                  <Sliders size={18} className="input-icon" />
                  <select value={experience} onChange={(e) => setExperience(e.target.value)}>
                    <option value="Fresher">Fresher (0-1 Years)</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years">5+ Years (Senior / Lead)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Primary Submit Button */}
            <button type="submit" className="btn-primary auth-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>Creating account...</>
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="auth-divider">
              <span>OR</span>
            </div>

            {/* Google Social Signup */}
            <button
              type="button"
              className="social-auth-btn"
              onClick={handleDemoLogin}
              title="Sign up with Google"
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

          {/* Switch to Login */}
          <div className="auth-switch-prompt">
            <span>Already have an account?</span>
            <button type="button" className="switch-link-btn" onClick={onNavigateLogin}>
              Sign in
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
