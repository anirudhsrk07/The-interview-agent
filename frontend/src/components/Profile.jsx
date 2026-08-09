import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Plus,
  Trash2,
  Edit3,
  Save,
  Bell,
  Moon,
  Activity,
  CheckCircle2,
  Eye,
  AlertTriangle,
  TrendingUp,
  Star,
  Award,
  FileText,
  Brain,
  Check,
  X,
  ArrowLeft,
  Sparkles,
  Zap,
  Sliders,
  ShieldCheck,
  Code,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { fetchCurrentUser } from "../services/authService";

// Default Initial Profile State
const DEFAULT_PROFILE = {
  fullName: "Anirudh Kulkarni",
  email: "anirudhkulkarni@example.com",
  phone: "+1 (555) 234-5678",
  location: "San Francisco, CA",
  education: "B.S. in Computer Science",
  currentRole: "Fullstack Software Engineer",
  experienceYears: "4+ Years",
  preferredRole: "Senior Fullstack Architect"
};

// Default Initial Skills
const DEFAULT_SKILLS = [
  "React",
  "JavaScript",
  "Python",
  "Java",
  "SQL",
  "Machine Learning",
  "System Design",
  "Node.js",
  "TypeScript",
  "Docker"
];

// Sample Interview History Data
const DEFAULT_INTERVIEWS = [
  {
    id: "int-101",
    jobRole: "Senior Software Engineer",
    date: "August 8, 2026",
    score: 86,
    difficulty: "Medium",
    status: "Completed",
    mode: "Technical Depth",
    details: {
      technicalAccuracy: 88,
      communication: 84,
      confidence: 90,
      speechPace: "142 WPM (Optimal)",
      fillerWords: 3,
      feedback: [
        "Strong structural breakdown of React 19 concurrent rendering.",
        "Clear distinction between Server Components and SSR hydration.",
        "Slight hesitation when discussing memory optimization algorithms."
      ]
    }
  },
  {
    id: "int-102",
    jobRole: "Frontend Developer",
    date: "August 6, 2026",
    score: 78,
    difficulty: "Easy",
    status: "Completed",
    mode: "Live Algorithm Test",
    details: {
      technicalAccuracy: 76,
      communication: 82,
      confidence: 75,
      speechPace: "155 WPM (Slightly Fast)",
      fillerWords: 7,
      feedback: [
        "Good intuitive approach to binary search tree traversal.",
        "Consider explaining space complexity trade-offs upfront.",
        "Great clarity in code comments."
      ]
    }
  },
  {
    id: "int-103",
    jobRole: "System Design Architect",
    date: "August 3, 2026",
    score: 94,
    difficulty: "Hard",
    status: "Completed",
    mode: "System Design",
    details: {
      technicalAccuracy: 96,
      communication: 92,
      confidence: 95,
      speechPace: "138 WPM (Optimal)",
      fillerWords: 1,
      feedback: [
        "Masterclass breakdown of distributed caching using Redis and Cassandra.",
        "Excellent explanation of consistent hashing algorithm.",
        "Fault isolation strategy was top tier."
      ]
    }
  },
  {
    id: "int-104",
    jobRole: "Backend Engineer",
    date: "July 28, 2026",
    score: 82,
    difficulty: "Medium",
    status: "Completed",
    mode: "Technical Depth",
    details: {
      technicalAccuracy: 84,
      communication: 80,
      confidence: 83,
      speechPace: "140 WPM (Optimal)",
      fillerWords: 4,
      feedback: [
        "Accurate overview of database indexing techniques (B+ Trees).",
        "Clear explanation of ACID transactions.",
        "Can expand more on connection pool tuning."
      ]
    }
  },
  {
    id: "int-105",
    jobRole: "Behavioral & Tech Lead",
    date: "July 22, 2026",
    score: 90,
    difficulty: "Medium",
    status: "Completed",
    mode: "Behavioral & Leadership",
    details: {
      technicalAccuracy: 92,
      communication: 94,
      confidence: 88,
      speechPace: "135 WPM (Optimal)",
      fillerWords: 2,
      feedback: [
        "Flawless STAR method execution when describing architectural conflict.",
        "Data-driven resolution approach demonstrated leadership maturity.",
        "Strong empathy and team coordination."
      ]
    }
  }
];

export default function ProfilePage({ onBack, onLaunchChamber }) {
  // Profile Info State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("mockify_profile_info");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  // Sync profile data with authenticated user from GET /api/auth/me
  useEffect(() => {
    async function loadBackendUser() {
      const user = await fetchCurrentUser();
      if (user) {
        setProfile((prev) => ({
          ...prev,
          fullName: user.name || prev.fullName,
          email: user.email || prev.email,
          currentRole: user.role || prev.currentRole,
          preferredRole: user.role || prev.preferredRole,
          experienceYears: user.experience || prev.experienceYears,
        }));
      }
    }
    loadBackendUser();
  }, []);

  // Skills State
  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem("mockify_profile_skills");
    return saved ? JSON.parse(saved) : DEFAULT_SKILLS;
  });
  const [newSkillInput, setNewSkillInput] = useState("");
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);

  // Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("mockify_profile_settings");
    return saved
      ? JSON.parse(saved)
      : {
          emailNotifications: true,
          interviewReminders: true,
          darkMode: true
        };
  });

  // Selected Interview Modal State
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Delete Account Confirmation Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState("");

  // Persist Profile Info
  useEffect(() => {
    localStorage.setItem("mockify_profile_info", JSON.stringify(profile));
  }, [profile]);

  // Persist Skills
  useEffect(() => {
    localStorage.setItem("mockify_profile_skills", JSON.stringify(skills));
  }, [skills]);

  // Persist Settings
  useEffect(() => {
    localStorage.setItem("mockify_profile_settings", JSON.stringify(settings));
  }, [settings]);

  // Handle Save Profile Form
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile(editForm);
    setIsEditingProfile(false);
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setEditForm(profile);
    setIsEditingProfile(false);
  };

  // Handle Add Skill
  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput("");
      setShowAddSkillInput(false);
    }
  };

  // Handle Remove Skill
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Handle Settings Toggle
  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle Reset / Delete Account Data
  const handleConfirmDelete = () => {
    localStorage.removeItem("mockify_profile_info");
    localStorage.removeItem("mockify_profile_skills");
    localStorage.removeItem("mockify_profile_settings");
    setProfile(DEFAULT_PROFILE);
    setSkills(DEFAULT_SKILLS);
    setSettings({
      emailNotifications: true,
      interviewReminders: true,
      darkMode: true
    });
    setShowDeleteModal(false);
    setDeleteSuccessMsg("Account profile data has been reset to defaults.");
    setTimeout(() => setDeleteSuccessMsg(""), 4000);
  };

  // Calculate initials
  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <motion.div
      className="profile-page-wrapper"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top Breadcrumb Header */}
      <div className="profile-top-nav">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div className="profile-page-tag">
          <Sparkles size={16} color="#d4af37" />
          <span>Personal Career Dashboard</span>
        </div>
      </div>

      {deleteSuccessMsg && (
        <motion.div
          className="alert-banner-success"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <CheckCircle2 size={18} /> {deleteSuccessMsg}
        </motion.div>
      )}

      {/* SECTION 1: HEADER BANNER */}
      <div className="glass-panel profile-header-card">
        <div className="profile-header-left">
          <div className="avatar-circle">
            <span>{initials}</span>
            <div className="online-indicator"></div>
          </div>
          <div className="user-details">
            <div className="user-name-row">
              <h2>{profile.fullName}</h2>
              <span className="seniority-badge">{profile.preferredRole}</span>
            </div>
            <p className="user-email">
              <Mail size={14} /> {profile.email}
            </p>
            <p className="user-meta">
              <MapPin size={14} /> {profile.location} • <Briefcase size={14} /> {profile.currentRole}
            </p>
          </div>
        </div>

        <div className="profile-header-actions">
          <button
            className="btn-secondary edit-header-btn"
            onClick={() => setIsEditingProfile(true)}
          >
            <Edit3 size={16} /> Edit Profile
          </button>
          <button className="btn-primary" onClick={onLaunchChamber}>
            <Zap size={16} /> Practice Interview
          </button>
        </div>
      </div>

      {/* SECTION 3: INTERVIEW STATISTICS GRID */}
      <div className="stats-grid">
        <motion.div className="glass-panel stat-card" whileHover={{ y: -4 }}>
          <div className="stat-icon-wrap gold">
            <Award size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value text-gradient-gold">12</div>
            <div className="stat-label">Interviews Completed</div>
          </div>
        </motion.div>

        <motion.div className="glass-panel stat-card" whileHover={{ y: -4 }}>
          <div className="stat-icon-wrap emerald">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">82%</div>
            <div className="stat-label">Average Score</div>
          </div>
        </motion.div>

        <motion.div className="glass-panel stat-card" whileHover={{ y: -4 }}>
          <div className="stat-icon-wrap purple">
            <Star size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value text-gradient-gold">94%</div>
            <div className="stat-label">Best Score</div>
          </div>
        </motion.div>

        <motion.div className="glass-panel stat-card" whileHover={{ y: -4 }}>
          <div className="stat-icon-wrap blue">
            <Brain size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">60</div>
            <div className="stat-label">Questions Answered</div>
          </div>
        </motion.div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD LAYOUT */}
      <div className="profile-layout-grid">
        {/* LEFT COLUMN */}
        <div className="layout-col-left">
          {/* SECTION 2: PROFILE INFORMATION CARD */}
          <div className="glass-panel info-card">
            <div className="card-header-bar">
              <div className="card-header-title">
                <User size={20} color="#d4af37" />
                <h3>Profile Information</h3>
              </div>
              {!isEditingProfile && (
                <button
                  className="btn-icon-text"
                  onClick={() => setIsEditingProfile(true)}
                >
                  <Edit3 size={15} /> Edit
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {isEditingProfile ? (
                <motion.form
                  key="edit"
                  onSubmit={handleSaveProfile}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="profile-edit-form"
                >
                  <div className="form-grid">
                    <div className="field-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, fullName: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="field-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="field-group">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) =>
                          setEditForm({ ...editForm, location: e.target.value })
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>Education</label>
                      <input
                        type="text"
                        value={editForm.education}
                        onChange={(e) =>
                          setEditForm({ ...editForm, education: e.target.value })
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>Current Role</label>
                      <input
                        type="text"
                        value={editForm.currentRole}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            currentRole: e.target.value
                          })
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>Years of Experience</label>
                      <input
                        type="text"
                        value={editForm.experienceYears}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            experienceYears: e.target.value
                          })
                        }
                      />
                    </div>

                    <div className="field-group">
                      <label>Preferred Job Role</label>
                      <input
                        type="text"
                        value={editForm.preferredRole}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            preferredRole: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-actions-row">
                    <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      <Save size={16} /> Save Changes
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="info-display-grid"
                >
                  <div className="info-item">
                    <span className="info-label">Full Name</span>
                    <span className="info-val">{profile.fullName}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Email Address</span>
                    <span className="info-val">{profile.email}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Phone Number</span>
                    <span className="info-val">{profile.phone}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Location</span>
                    <span className="info-val">{profile.location}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Education</span>
                    <span className="info-val">{profile.education}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Current Role</span>
                    <span className="info-val">{profile.currentRole}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Years of Experience</span>
                    <span className="info-val">{profile.experienceYears}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">Preferred Job Role</span>
                    <span className="info-val highlight-gold">{profile.preferredRole}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SECTION 6: PERFORMANCE OVERVIEW */}
          <div className="glass-panel performance-card">
            <div className="card-header-bar">
              <div className="card-header-title">
                <Activity size={20} color="#d4af37" />
                <h3>Performance Overview</h3>
              </div>
              <span className="trend-badge">
                <TrendingUp size={14} /> +14% Improvement
              </span>
            </div>

            <div className="performance-metrics-list">
              <div className="metric-bar-group">
                <div className="metric-meta">
                  <span className="metric-name">Technical Skills</span>
                  <span className="metric-perc">88%</span>
                </div>
                <div className="progress-track">
                  <motion.div
                    className="progress-fill gold"
                    initial={{ width: 0 }}
                    animate={{ width: "88%" }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <span className="metric-subtag">Exceeds FAANG Benchmark</span>
              </div>

              <div className="metric-bar-group">
                <div className="metric-meta">
                  <span className="metric-name">Communication & Structure</span>
                  <span className="metric-perc">84%</span>
                </div>
                <div className="progress-track">
                  <motion.div
                    className="progress-fill emerald"
                    initial={{ width: 0 }}
                    animate={{ width: "84%" }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <span className="metric-subtag">Strong Conciseness & Pace</span>
              </div>

              <div className="metric-bar-group">
                <div className="metric-meta">
                  <span className="metric-name">Confidence & Tone</span>
                  <span className="metric-perc">92%</span>
                </div>
                <div className="progress-track">
                  <motion.div
                    className="progress-fill purple"
                    initial={{ width: 0 }}
                    animate={{ width: "92%" }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
                <span className="metric-subtag">Minimal Filler Words</span>
              </div>

              <div className="metric-bar-group">
                <div className="metric-meta">
                  <span className="metric-name">Problem Solving & Logic</span>
                  <span className="metric-perc">86%</span>
                </div>
                <div className="progress-track">
                  <motion.div
                    className="progress-fill blue"
                    initial={{ width: 0 }}
                    animate={{ width: "86%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <span className="metric-subtag">Optimal Algorithmic Intuition</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="layout-col-right">
          {/* SECTION 4: SKILLS SECTION */}
          <div className="glass-panel skills-card">
            <div className="card-header-bar">
              <div className="card-header-title">
                <Code size={20} color="#d4af37" />
                <h3>Skills & Expertise</h3>
              </div>
              <button
                className="btn-icon-text"
                onClick={() => setShowAddSkillInput(!showAddSkillInput)}
              >
                <Plus size={15} /> Add Skill
              </button>
            </div>

            {showAddSkillInput && (
              <form onSubmit={handleAddSkill} className="add-skill-form">
                <input
                  type="text"
                  placeholder="e.g. System Architecture, Go, AWS..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="btn-primary sm">
                  Add
                </button>
                <button
                  type="button"
                  className="btn-secondary sm"
                  onClick={() => setShowAddSkillInput(false)}
                >
                  <X size={14} />
                </button>
              </form>
            )}

            <div className="skills-tags-container">
              {skills.map((skill) => (
                <div key={skill} className="skill-tag">
                  <span>{skill}</span>
                  <button
                    className="tag-remove-btn"
                    onClick={() => handleRemoveSkill(skill)}
                    title={`Remove ${skill}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: INTERVIEW HISTORY */}
          <div className="glass-panel history-card">
            <div className="card-header-bar">
              <div className="card-header-title">
                <Calendar size={20} color="#d4af37" />
                <h3>Interview History</h3>
              </div>
              <span className="history-count">{DEFAULT_INTERVIEWS.length} Rounds</span>
            </div>

            <div className="history-list">
              {DEFAULT_INTERVIEWS.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-item-top">
                    <div className="history-role-info">
                      <h4>{item.jobRole}</h4>
                      <div className="history-sub-meta">
                        <span>{item.date}</span> • <span className="diff-pill">{item.difficulty}</span>
                      </div>
                    </div>
                    <div className="history-score-badge">
                      <span className="score-num">{item.score}%</span>
                      <span className="status-dot"></span>
                    </div>
                  </div>

                  <div className="history-item-bottom">
                    <span className="mode-tag">{item.mode}</span>
                    <button
                      className="view-details-btn"
                      onClick={() => setSelectedInterview(item)}
                    >
                      <Eye size={14} /> View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7: ACCOUNT SETTINGS */}
          <div className="glass-panel settings-card">
            <div className="card-header-bar">
              <div className="card-header-title">
                <Sliders size={20} color="#d4af37" />
                <h3>Account Settings</h3>
              </div>
            </div>

            <div className="settings-toggle-list">
              <div className="setting-toggle-item">
                <div className="setting-info">
                  <div className="setting-title">
                    <Bell size={16} /> Email Notifications
                  </div>
                  <div className="setting-desc">Receive performance reports via email</div>
                </div>
                <div
                  className={`toggle-switch ${settings.emailNotifications ? "active" : ""}`}
                  onClick={() => toggleSetting("emailNotifications")}
                >
                  <div className="switch-knob"></div>
                </div>
              </div>

              <div className="setting-toggle-item">
                <div className="setting-info">
                  <div className="setting-title">
                    <Calendar size={16} /> Interview Reminders
                  </div>
                  <div className="setting-desc">Daily preparation alerts & goal tracking</div>
                </div>
                <div
                  className={`toggle-switch ${settings.interviewReminders ? "active" : ""}`}
                  onClick={() => toggleSetting("interviewReminders")}
                >
                  <div className="switch-knob"></div>
                </div>
              </div>

              <div className="setting-toggle-item">
                <div className="setting-info">
                  <div className="setting-title">
                    <Moon size={16} /> Dark Mode Aesthetic
                  </div>
                  <div className="setting-desc">Luxury obsidian & metallic gold interface</div>
                </div>
                <div
                  className={`toggle-switch ${settings.darkMode ? "active" : ""}`}
                  onClick={() => toggleSetting("darkMode")}
                >
                  <div className="switch-knob"></div>
                </div>
              </div>
            </div>

            <div className="danger-zone-wrapper">
              <button
                className="btn-danger-outline"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 size={16} /> Reset Account Profile Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: VIEW INTERVIEW DETAILS */}
      <AnimatePresence>
        {selectedInterview && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedInterview(null)}
          >
            <motion.div
              className="modal-content profile-details-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close-btn"
                onClick={() => setSelectedInterview(null)}
              >
                <X size={20} />
              </button>

              <div className="modal-details-header">
                <div className="mode-badge-pill">{selectedInterview.mode}</div>
                <h2>{selectedInterview.jobRole}</h2>
                <p className="modal-date">{selectedInterview.date} • Difficulty: {selectedInterview.difficulty}</p>
              </div>

              <div className="modal-score-banner">
                <div className="score-big text-gradient-gold">{selectedInterview.score}%</div>
                <div className="score-meta">
                  <span>Overall AI Evaluation Score</span>
                  <div className="score-tags">
                    <span>Accuracy: {selectedInterview.details.technicalAccuracy}%</span>
                    <span>Tone: {selectedInterview.details.confidence}%</span>
                  </div>
                </div>
              </div>

              <div className="modal-feedback-section">
                <h4><Brain size={18} color="#d4af37" /> Detailed Evaluation Notes</h4>
                <ul className="feedback-bullets">
                  {selectedInterview.details.feedback.map((item, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={16} color="#d4af37" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-metrics-subgrid">
                <div className="submetric">
                  <span className="lbl">Speech Pace</span>
                  <span className="val">{selectedInterview.details.speechPace}</span>
                </div>
                <div className="submetric">
                  <span className="lbl">Filler Word Spikes</span>
                  <span className="val">{selectedInterview.details.fillerWords} instances</span>
                </div>
              </div>

              <div style={{ marginTop: "24px", textAlign: "right" }}>
                <button
                  className="btn-primary"
                  onClick={() => setSelectedInterview(null)}
                >
                  Close Feedback Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: DELETE ACCOUNT CONFIRMATION */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              className="modal-content delete-confirm-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="warning-icon-box">
                <AlertTriangle size={32} color="#ef4444" />
              </div>

              <h3>Reset Profile Data?</h3>
              <p>
                Are you sure you want to reset your local profile information, customized skills, and account settings back to defaults?
              </p>

              <div className="confirm-actions-row">
                <button
                  className="btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-danger"
                  onClick={handleConfirmDelete}
                >
                  Confirm Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
