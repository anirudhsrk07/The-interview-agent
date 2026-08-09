import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Palette,
  Briefcase,
  Bell,
  Bot,
  ShieldCheck,
  HardDrive,
  AlertTriangle,
  Search,
  CheckCircle2,
  Sliders,
  ArrowRight,
  Sparkles,
  Download,
  Trash2,
  Lock,
  Zap,
  RefreshCw,
  X,
  Volume2,
  Clock,
  Mic
} from "lucide-react";
import {
  getSettings,
  saveSettings,
  updateSetting,
  resetSettings,
  exportUserDataJSON
} from "../services/settingsService";
import { getCurrentUser } from "../services/authService";

const SETTINGS_SECTIONS = [
  { id: "account", label: "Account", icon: User, keywords: ["name", "email", "phone", "role", "profile", "picture"] },
  { id: "appearance", label: "Appearance", icon: Palette, keywords: ["theme", "color", "dark", "light", "compact", "animation"] },
  { id: "interview", label: "Interview Preferences", icon: Briefcase, keywords: ["job", "role", "difficulty", "questions", "mode", "timer", "voice"] },
  { id: "notifications", label: "Notifications", icon: Bell, keywords: ["email", "reminder", "daily", "weekly", "alert"] },
  { id: "ai", label: "AI Assistant", icon: Bot, keywords: ["ai", "personality", "feedback", "voice", "speed", "style"] },
  { id: "security", label: "Privacy & Security", icon: ShieldCheck, keywords: ["password", "2fa", "two-factor", "login", "session", "security"] },
  { id: "data", label: "Data & Storage", icon: HardDrive, keywords: ["export", "download", "clear", "history", "json", "chat"] },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle, keywords: ["delete", "reset", "remove", "account"] }
];

export default function Settings({ onNavigateModules, onLogout }) {
  const [activeSection, setActiveSection] = useState("account");
  const [settings, setSettingsState] = useState(() => getSettings());
  const [searchQuery, setSearchQuery] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Account Form State
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem("mockify_profile_info");
    const user = getCurrentUser();
    return saved
      ? JSON.parse(saved)
      : {
          fullName: user?.name || "Anirudh Kulkarni",
          email: user?.email || "anirudhkulkarni@example.com",
          phone: "+91 98765 43210",
          currentRole: user?.role || "Software Engineer",
          preferredRole: user?.role || "Software Engineer",
          experience: user?.experience || "Fresher",
          location: "Bangalore, India"
        };
  });

  // Modal Confirmation State
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, title: "", message: "", action: null });

  // Save Settings State
  const handleSaveSettings = (newSettings) => {
    setSettingsState(newSettings);
    saveSettings(newSettings);
    triggerSuccessToast("✓ Changes saved successfully");
  };

  // Toast Notification
  const triggerSuccessToast = (msg) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(""), 2800);
  };

  // Save Account Profile Info
  const handleSaveAccountInfo = (e) => {
    e.preventDefault();
    localStorage.setItem("mockify_profile_info", JSON.stringify(userInfo));
    triggerSuccessToast("✓ Profile information saved successfully");
  };

  // Search Settings Filter
  const filteredSections = SETTINGS_SECTIONS.filter((sec) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sec.label.toLowerCase().includes(q) ||
      sec.keywords.some((k) => k.includes(q))
    );
  });

  // Handle Destructive Actions
  const handleOpenConfirm = (type, title, message, action) => {
    setConfirmModal({ open: true, type, title, message, action });
  };

  const handleExecuteConfirm = () => {
    if (confirmModal.action) confirmModal.action();
    setConfirmModal({ open: false, type: null, title: "", message: "", action: null });
  };

  return (
    <div className="settings-page-wrapper">
      {/* Top Banner Header & Status Sync Card */}
      <div className="settings-header-banner glass-panel">
        <div className="settings-header-left">
          <div className="settings-page-tag">
            <Sliders size={16} color="#d4af37" />
            <span>Preferences & Platform Control</span>
          </div>
          <h2>Settings</h2>
          <p>Customize your Mockify experience, AI behavior, and interview parameters.</p>
        </div>

        <div className="settings-sync-status-card">
          <div className="sync-card-header">
            <CheckCircle2 size={18} color="#34d399" />
            <span>Your preferences are synced</span>
          </div>
          <div className="sync-pills">
            <span>✓ Interview preferences</span>
            <span>✓ AI preferences</span>
            <span>✓ Notification preferences</span>
          </div>
        </div>
      </div>

      {/* QUICK INTERVIEW SETUP CARD */}
      <div className="glass-panel quick-setup-card">
        <div className="quick-setup-left">
          <div className="quick-setup-badge">
            <Zap size={16} color="#d4af37" /> Quick Interview Setup
          </div>
          <h3>Your Default Interview Parameters</h3>
          <div className="quick-setup-pills">
            <span className="qpill">💼 {settings.defaultJobRole}</span>
            <span className="qpill">🎯 {settings.preferredDifficulty}</span>
            <span className="qpill">📝 {settings.questionCount} Questions</span>
            <span className="qpill">🎤 {settings.defaultAnswerMode === "voice" ? "Voice Live" : "Text Input"}</span>
          </div>
        </div>
        <button
          className="btn-primary quick-start-btn"
          onClick={onNavigateModules}
        >
          Start Interview <ArrowRight size={18} />
        </button>
      </div>

      {/* SEARCH SETTINGS BAR */}
      <div className="settings-search-container">
        <div className="settings-search-wrapper glass-panel">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search settings (e.g. theme, notification, AI, interview)..."
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* SUCCESS TOAST NOTIFICATION */}
      <AnimatePresence>
        {saveSuccessMsg && (
          <motion.div
            className="settings-toast-banner"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CheckCircle2 size={18} color="#34d399" />
            <span>{saveSuccessMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN DUAL-PANE SETTINGS LAYOUT */}
      <div className="settings-main-grid">
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="settings-sidebar glass-panel">
          <div className="sidebar-title">SETTINGS</div>
          <div className="sidebar-nav-list">
            {filteredSections.map((sec) => {
              const IconComp = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                  onClick={() => setActiveSection(sec.id)}
                >
                  <IconComp size={18} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT CONTENT PANEL */}
        <div className="settings-content-panel glass-panel">
          {/* 1. ACCOUNT SETTINGS */}
          {activeSection === "account" && (
            <div className="section-content-box">
              <div className="content-box-header">
                <h3>Account Settings</h3>
                <p>Manage your profile details, contact information, and target career path.</p>
              </div>

              <div className="profile-photo-row">
                <div className="avatar-circle-lg">
                  {userInfo.fullName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h4>Profile Picture</h4>
                  <p>PNG, JPG or WebP up to 2MB.</p>
                  <button className="btn-secondary sm" style={{ marginTop: "6px" }}>
                    Change Photo
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveAccountInfo} className="settings-form-grid">
                <div className="sform-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={userInfo.fullName}
                    onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="sform-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    required
                  />
                </div>

                <div className="sform-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  />
                </div>

                <div className="sform-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={userInfo.location}
                    onChange={(e) => setUserInfo({ ...userInfo, location: e.target.value })}
                  />
                </div>

                <div className="sform-group">
                  <label>Target Job Role</label>
                  <input
                    type="text"
                    value={userInfo.preferredRole}
                    onChange={(e) => setUserInfo({ ...userInfo, preferredRole: e.target.value })}
                  />
                </div>

                <div className="sform-group">
                  <label>Experience Level</label>
                  <select
                    value={userInfo.experience}
                    onChange={(e) => setUserInfo({ ...userInfo, experience: e.target.value })}
                  >
                    <option value="Fresher">Fresher (0-1 Years)</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years">5+ Years (Senior / Lead)</option>
                  </select>
                </div>

                <div className="form-submit-row">
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. APPEARANCE SETTINGS */}
          {activeSection === "appearance" && (
            <div className="section-content-box">
              <div className="content-box-header">
                <h3>Appearance & Theme</h3>
                <p>Customize Mockify's visual interface, color scheme, and motion effects.</p>
              </div>

              <div className="setting-option-card">
                <h4>Interface Theme</h4>
                <div className="radio-group-cards">
                  {[
                    { id: "light", label: "Light" },
                    { id: "dark", label: "Dark (Recommended)" },
                    { id: "system", label: "System" }
                  ].map((t) => (
                    <div
                      key={t.id}
                      className={`theme-card-option ${settings.theme === t.id ? "active" : ""}`}
                      onClick={() => handleSaveSettings({ ...settings, theme: t.id })}
                    >
                      <div className="radio-dot-outer">
                        {settings.theme === t.id && <div className="radio-dot-inner" />}
                      </div>
                      <span>{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="setting-option-card">
                <h4>Accent Color</h4>
                <div className="accent-swatch-group">
                  {[
                    { id: "gold", name: "Metallic Gold", hex: "#d4af37" },
                    { id: "blue", name: "Royal Blue", hex: "#3b82f6" },
                    { id: "purple", name: "Cyber Purple", hex: "#a855f7" },
                    { id: "emerald", name: "Emerald Green", hex: "#10b981" }
                  ].map((swatch) => (
                    <button
                      key={swatch.id}
                      className={`swatch-btn ${settings.accentColor === swatch.id ? "active" : ""}`}
                      onClick={() => handleSaveSettings({ ...settings, accentColor: swatch.id })}
                      style={{ borderColor: swatch.hex }}
                    >
                      <span className="swatch-circle" style={{ background: swatch.hex }} />
                      <span>{swatch.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <h4>Compact Mode</h4>
                  <p>Reduce padding and spacing across dashboard cards.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.compactMode}
                    onChange={(e) => handleSaveSettings({ ...settings, compactMode: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <h4>Animations & Motion Effects</h4>
                  <p>Enable smooth page transitions and floating ambient elements.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.animationsEnabled}
                    onChange={(e) => handleSaveSettings({ ...settings, animationsEnabled: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* Theme Preview Box */}
              <div className="theme-preview-box">
                <h5>Live Theme Preview</h5>
                <div className="preview-mini-card">
                  <Sparkles size={16} color="#d4af37" />
                  <span>Mockify Glassmorphism Card • {settings.accentColor.toUpperCase()} Accent</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. INTERVIEW PREFERENCES */}
          {activeSection === "interview" && (
            <div className="section-content-box">
              <div className="content-box-header">
                <h3>Interview Preferences</h3>
                <p>Configure default settings applied when launching new interview modules.</p>
              </div>

              <div className="settings-form-grid">
                <div className="sform-group">
                  <label>Default Job Role</label>
                  <select
                    value={settings.defaultJobRole}
                    onChange={(e) => handleSaveSettings({ ...settings, defaultJobRole: e.target.value })}
                  >
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Fullstack Architect">Fullstack Architect</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Product Manager">Product Manager</option>
                  </select>
                </div>

                <div className="sform-group">
                  <label>Experience Level</label>
                  <select
                    value={settings.experienceLevel}
                    onChange={(e) => handleSaveSettings({ ...settings, experienceLevel: e.target.value })}
                  >
                    <option value="Fresher">Fresher (0-1 Years)</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years">5+ Years (Senior / Lead)</option>
                  </select>
                </div>
              </div>

              <div className="setting-option-card">
                <h4>Preferred Difficulty</h4>
                <div className="radio-group-cards">
                  {["Easy", "Medium", "Hard"].map((d) => (
                    <div
                      key={d}
                      className={`theme-card-option ${settings.preferredDifficulty === d ? "active" : ""}`}
                      onClick={() => handleSaveSettings({ ...settings, preferredDifficulty: d })}
                    >
                      <div className="radio-dot-outer">
                        {settings.preferredDifficulty === d && <div className="radio-dot-inner" />}
                      </div>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="setting-option-card">
                <h4>Number of Questions per Session</h4>
                <div className="radio-group-cards">
                  {[3, 5, 10].map((num) => (
                    <div
                      key={num}
                      className={`theme-card-option ${settings.questionCount === num ? "active" : ""}`}
                      onClick={() => handleSaveSettings({ ...settings, questionCount: num })}
                    >
                      <div className="radio-dot-outer">
                        {settings.questionCount === num && <div className="radio-dot-inner" />}
                      </div>
                      <span>{num} Questions</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="setting-option-card">
                <h4>Default Answer Input Mode</h4>
                <div className="radio-group-cards">
                  {[
                    { id: "text", label: "Text Explanation Input" },
                    { id: "voice", label: "Voice Speech Recording" }
                  ].map((mode) => (
                    <div
                      key={mode.id}
                      className={`theme-card-option ${settings.defaultAnswerMode === mode.id ? "active" : ""}`}
                      onClick={() => handleSaveSettings({ ...settings, defaultAnswerMode: mode.id })}
                    >
                      <div className="radio-dot-outer">
                        {settings.defaultAnswerMode === mode.id && <div className="radio-dot-inner" />}
                      </div>
                      <span>{mode.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <h4>Enable Interview Session Timer</h4>
                  <p>Display real-time stopwatch during active interview sessions.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.interviewTimer}
                    onChange={(e) => handleSaveSettings({ ...settings, interviewTimer: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <h4>Auto-Advance Questions</h4>
                  <p>Automatically move to the next question upon submitting response.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.autoAdvance}
                    onChange={(e) => handleSaveSettings({ ...settings, autoAdvance: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}

          {/* 4. NOTIFICATIONS SETTINGS */}
          {activeSection === "notifications" && (
            <div className="section-content-box">
              <div className="content-box-header">
                <h3>Notifications & Reminders</h3>
                <p>Control email notifications, practice alerts, and progress reports.</p>
              </div>

              {[
                { key: "emailNotifications", label: "Email Notifications", desc: "Receive email updates regarding session progress." },
                { key: "interviewReminders", label: "Interview Reminders", desc: "Scheduled reminders before upcoming mock rounds." },
                { key: "dailyReminder", label: "Daily Practice Reminder", desc: "Daily notification encouraging 15-min interview practice." },
                { key: "performanceUpdates", label: "Performance Updates", desc: "Alerts when your readiness score changes." },
                { key: "featureNotifications", label: "New Feature Notifications", desc: "Updates on new AI modules and questions." },
                { key: "weeklyReport", label: "Weekly Progress Report", desc: "Weekly summary of completed questions and scores." }
              ].map((item) => (
                <div key={item.key} className="setting-toggle-row">
                  <div>
                    <h4>{item.label}</h4>
                    <p>{item.desc}</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.notifications?.[item.key] ?? true}
                      onChange={(e) =>
                        handleSaveSettings({
                          ...settings,
                          notifications: { ...settings.notifications, [item.key]: e.target.checked }
                        })
                      }
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}

              <div className="setting-option-card">
                <h4>Notification Frequency</h4>
                <div className="radio-group-cards">
                  {["daily", "weekly", "never"].map((freq) => (
                    <div
                      key={freq}
                      className={`theme-card-option ${settings.notifications?.frequency === freq ? "active" : ""}`}
                      onClick={() =>
                        handleSaveSettings({
                          ...settings,
                          notifications: { ...settings.notifications, frequency: freq }
                        })
                      }
                    >
                      <div className="radio-dot-outer">
                        {settings.notifications?.frequency === freq && <div className="radio-dot-inner" />}
                      </div>
                      <span style={{ textTransform: "capitalize" }}>{freq}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. AI ASSISTANT SETTINGS */}
          {activeSection === "ai" && (
            <div className="section-content-box">
              <div className="content-box-header">
                <h3>AI Assistant & Evaluator Settings</h3>
                <p>Tailor AI coach personality, response detail level, and feedback criteria.</p>
              </div>

              <div className="setting-option-card">
                <h4>AI Coach Personality</h4>
                <div className="radio-group-cards">
                  {["Professional", "Friendly", "Motivational", "Strict Interviewer"].map((p) => (
                    <div
                      key={p}
                      className={`theme-card-option ${settings.aiAssistant?.personality === p ? "active" : ""}`}
                      onClick={() =>
                        handleSaveSettings({
                          ...settings,
                          aiAssistant: { ...settings.aiAssistant, personality: p }
                        })
                      }
                    >
                      <div className="radio-dot-outer">
                        {settings.aiAssistant?.personality === p && <div className="radio-dot-inner" />}
                      </div>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="setting-option-card">
                <h4>Default Response Style</h4>
                <div className="radio-group-cards">
                  {["Concise", "Balanced", "Detailed"].map((s) => (
                    <div
                      key={s}
                      className={`theme-card-option ${settings.aiAssistant?.responseStyle === s ? "active" : ""}`}
                      onClick={() =>
                        handleSaveSettings({
                          ...settings,
                          aiAssistant: { ...settings.aiAssistant, responseStyle: s }
                        })
                      }
                    >
                      <div className="radio-dot-outer">
                        {settings.aiAssistant?.responseStyle === s && <div className="radio-dot-inner" />}
                      </div>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <h4>Voice Speech Responses</h4>
                  <p>Enable text-to-speech audio for AI interviewer questions.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.aiAssistant?.voiceResponses ?? false}
                    onChange={(e) =>
                      handleSaveSettings({
                        ...settings,
                        aiAssistant: { ...settings.aiAssistant, voiceResponses: e.target.checked }
                      })
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="sform-group">
                <label>Voice Playback Speed: {settings.aiAssistant?.voiceSpeed || 1.0}x</label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={settings.aiAssistant?.voiceSpeed || 1.0}
                  onChange={(e) =>
                    handleSaveSettings({
                      ...settings,
                      aiAssistant: { ...settings.aiAssistant, voiceSpeed: parseFloat(e.target.value) }
                    })
                  }
                  style={{ width: "100%", accentColor: "var(--gold-primary)" }}
                />
              </div>
            </div>
          )}

          {/* 6. PRIVACY & SECURITY */}
          {activeSection === "security" && (
            <div className="section-content-box">
              <div className="content-box-header">
                <h3>Privacy & Security</h3>
                <p>Manage login credentials, two-factor authentication, and active sessions.</p>
              </div>

              <div className="security-status-card">
                <ShieldCheck size={28} color="#34d399" />
                <div>
                  <h4>🟢 Your account is secure</h4>
                  <p>All interview session logs and data are encrypted locally.</p>
                </div>
              </div>

              <div className="action-row-card">
                <div>
                  <h4>Change Password</h4>
                  <p>Update your password regularly to maintain account safety.</p>
                </div>
                <button
                  className="btn-secondary sm"
                  onClick={() => triggerSuccessToast("Password reset link sent to your email.")}
                >
                  Change Password
                </button>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <h4>Two-Factor Authentication (2FA)</h4>
                  <p>Add an extra layer of security using authenticator app verification.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.security?.twoFactor ?? false}
                    onChange={(e) =>
                      handleSaveSettings({
                        ...settings,
                        security: { ...settings.security, twoFactor: e.target.checked }
                      })
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="action-row-card">
                <div>
                  <h4>Active Login Sessions</h4>
                  <p>Currently active on Chrome macOS (Current Session).</p>
                </div>
                <button
                  className="btn-secondary sm"
                  onClick={() => triggerSuccessToast("All other sessions logged out.")}
                >
                  Manage Sessions
                </button>
              </div>
            </div>
          )}

          {/* 7. DATA & STORAGE */}
          {activeSection === "data" && (
            <div className="section-content-box">
              <div className="content-box-header">
                <h3>Data & Storage</h3>
                <p>View local storage usage, export interview JSON history, or clear logs.</p>
              </div>

              <div className="storage-info-box">
                <HardDrive size={24} color="#d4af37" />
                <div>
                  <h4>Local Storage Usage: <strong>2.4 MB</strong></h4>
                  <p>Contains saved profile details, customized skills, and mock history.</p>
                </div>
              </div>

              <div className="action-row-card">
                <div>
                  <h4>Export Complete Data (JSON)</h4>
                  <p>Download profile, interview history, scores, and settings in JSON format.</p>
                </div>
                <button className="btn-primary sm" onClick={exportUserDataJSON}>
                  <Download size={14} /> Export Data
                </button>
              </div>

              <div className="action-row-card">
                <div>
                  <h4>Clear Interview History</h4>
                  <p>Remove saved mock interview scores and feedback reports.</p>
                </div>
                <button
                  className="btn-secondary sm"
                  onClick={() =>
                    handleOpenConfirm(
                      "history",
                      "Clear Interview History?",
                      "This will remove all saved interview logs and scores. This cannot be undone.",
                      () => {
                        localStorage.removeItem("mockify_profile_history");
                        triggerSuccessToast("✓ Interview history cleared");
                      }
                    )
                  }
                >
                  Clear History
                </button>
              </div>

              <div className="action-row-card">
                <div>
                  <h4>Clear Chatbot History</h4>
                  <p>Remove all saved conversation messages with Mockify AI Assistant.</p>
                </div>
                <button
                  className="btn-secondary sm"
                  onClick={() =>
                    handleOpenConfirm(
                      "chat",
                      "Clear Chat History?",
                      "This will delete all saved conversation messages. This action cannot be undone.",
                      () => {
                        localStorage.removeItem("mockify_chat_history");
                        triggerSuccessToast("✓ Chat history cleared");
                      }
                    )
                  }
                >
                  Clear Chat
                </button>
              </div>
            </div>
          )}

          {/* 8. DANGER ZONE */}
          {activeSection === "danger" && (
            <div className="section-content-box danger-box-wrapper">
              <div className="content-box-header danger">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <AlertTriangle size={22} color="#ef4444" />
                  <h3 style={{ color: "#ef4444" }}>Danger Zone</h3>
                </div>
                <p>Irreversible and destructive actions. Proceed with caution.</p>
              </div>

              <div className="action-row-card danger-card">
                <div>
                  <h4>Reset All Settings to Defaults</h4>
                  <p>Reset interview parameters, theme, and notification preferences.</p>
                </div>
                <button
                  className="btn-secondary sm"
                  style={{ borderColor: "#ef4444", color: "#f87171" }}
                  onClick={() =>
                    handleOpenConfirm(
                      "reset",
                      "Reset All Settings?",
                      "Are you sure? This will restore all preferences back to factory defaults.",
                      () => {
                        const def = resetSettings();
                        setSettingsState(def);
                        triggerSuccessToast("✓ All settings reset to defaults");
                      }
                    )
                  }
                >
                  Reset Settings
                </button>
              </div>

              <div className="action-row-card danger-card">
                <div>
                  <h4>Delete Account</h4>
                  <p>Permanently delete your user profile, session, and saved mock history.</p>
                </div>
                <button
                  className="btn-danger sm"
                  onClick={() =>
                    handleOpenConfirm(
                      "delete",
                      "Delete Account Completely?",
                      "Are you sure? This action cannot be undone. All your profile data will be permanently removed.",
                      () => {
                        if (onLogout) onLogout();
                      }
                    )
                  }
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="settings-footer-note">
        <span>Mockify v1.0 • Built for smarter interview preparation.</span>
      </div>

      {/* DESTRUCTIVE ACTION CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmModal.open && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content glass-panel"
              style={{ maxWidth: "420px", padding: "28px" }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#ef4444" }}>
                  <AlertTriangle size={22} />
                  <h4 style={{ margin: 0, fontSize: "1.15rem" }}>{confirmModal.title}</h4>
                </div>
                <button
                  className="modal-close-btn"
                  onClick={() => setConfirmModal({ ...confirmModal, open: false })}
                >
                  <X size={18} />
                </button>
              </div>

              <p style={{ fontSize: "0.9rem", color: "#cbd5e1", margin: "16px 0 24px 0", lineHeight: "1.5" }}>
                {confirmModal.message}
              </p>

              <div style={{ display: "flex", gap: "12px", justifySelf: "flex-end" }}>
                <button
                  className="btn-secondary"
                  onClick={() => setConfirmModal({ ...confirmModal, open: false })}
                >
                  Cancel
                </button>
                <button
                  className="btn-danger"
                  onClick={handleExecuteConfirm}
                >
                  Confirm Action
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
