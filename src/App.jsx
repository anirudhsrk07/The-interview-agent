import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Bot,
  Mic,
  Play,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Code,
  Cpu,
  Award,
  Users,
  Star,
  BarChart3,
  Clock,
  Check,
  X,
  RefreshCw,
  ChevronRight,
  Briefcase,
  Sliders,
  Volume2,
  TrendingUp,
  Terminal,
  Brain,
  Video,
  FileText,
  Lightbulb,
  Layers,
  Flame,
  RotateCcw,
  MicOff,
  User,
  LogOut,
  ChevronDown,
  Settings as SettingsIcon
} from "lucide-react";
import ProfilePage from "./components/Profile";
import InterviewModules from "./components/InterviewModules";
import Chatbot from "./components/Chatbot";
import Login from "./components/Login";
import Signup from "./components/Signup";
import SettingsPage from "./components/Settings";
import { getCurrentUser, logout } from "./services/authService";
import "./App.css";

// Sample Job Roles for Quick Selection
const POPULAR_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Architect",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager"
];

// Interactive Simulator Categories
const SIMULATOR_MODES = [
  {
    id: "technical",
    label: "Technical Depth",
    icon: Code,
    question: "Explain how React 19 handles concurrency and how server components differ from traditional SSR.",
    sampleResponse: "React 19 introduces automatic batching and Server Components that render on the server, eliminating client-side bundle weight while preserving interactive state via hydration islands.",
    difficulty: "Hard",
    scores: { comm: 94, depth: 98, logic: 92, speed: 90 },
    feedback: ["Flawless explanation of Hydration", "Accurate Server Component breakdown", "Great clarity"]
  },
  {
    id: "system-design",
    label: "System Design",
    icon: Cpu,
    question: "Design a high-throughput URL shortening service like Bitly that handles 10,000 requests/sec with low latency.",
    sampleResponse: "I'd implement an active-active Redis caching layer for reads backed by Cassandra distributed DB for base62 encoded key storage with consistent hashing.",
    difficulty: "Hard",
    scores: { comm: 96, depth: 92, logic: 95, speed: 88 },
    feedback: ["Strong caching strategy", "Base62 encoding choice noted", "Mentioned consistent hashing"]
  },
  {
    id: "behavioral",
    label: "Behavioral & Leadership",
    icon: Brain,
    question: "Tell me about a time you had a major architectural conflict with a teammate and how you resolved it.",
    sampleResponse: "I set up a benchmark sandbox to measure latency metrics directly, allowing objective data to drive our consensus rather than opinions.",
    difficulty: "Medium",
    scores: { comm: 98, depth: 90, logic: 94, speed: 95 },
    feedback: ["Ideal STAR method structure", "Data-driven approach highlighted", "High emotional intelligence"]
  },
  {
    id: "coding",
    label: "Live Algorithm Test",
    icon: Terminal,
    question: "Optimize a function to find the lowest common ancestor in a Binary Search Tree in O(1) space.",
    sampleResponse: "Iteratively compare node values with p and q: if both are smaller move left, if larger move right, otherwise return current node.",
    difficulty: "Medium",
    scores: { comm: 90, depth: 96, logic: 98, speed: 94 },
    feedback: ["Optimal O(1) space complexity", "Clean edge-case handling", "Fast time complexity"]
  }
];

// Features List
const FEATURES = [
  {
    icon: Bot,
    title: "AI Voice & Video Evaluator",
    desc: "Engage with lifelike conversational AI that speaks naturally, adapts questions to your answers, and assesses voice clarity."
  },
  {
    icon: Zap,
    title: "Instant Audio & Transcript Analytics",
    desc: "Get sub-second feedback on filler word frequency, technical accuracy, speech speed, and confidence scores."
  },
  {
    icon: ShieldCheck,
    title: "Anti-Hallucination Guardrails",
    desc: "Our verified benchmark evaluation engine tests exact industry standards for top tier companies like Google & Meta."
  },
  {
    icon: Sliders,
    title: "Tailored Experience Scaling",
    desc: "Customize interview pressure from intern level to Senior Staff Architect with company-specific question rubrics."
  },
  {
    icon: Code,
    title: "Integrated Live IDE & Sandbox",
    desc: "Write, run, and debug code live during technical rounds with real-time AI code review and complexity analysis."
  },
  {
    icon: TrendingUp,
    title: "Personalized Growth Matrix",
    desc: "Track your improvement over time with detailed skill radar graphs and custom study recommendations."
  }
];

// Hackathon Presentation Specs & Key Innovations
const HACKATHON_SPECS = [
  {
    icon: Cpu,
    tag: "Real-Time AI Core",
    title: "Multimodal Voice & Avatar Pipeline",
    desc: "Sub-100ms bidirectional speech parsing, emotion analysis, and natural visual avatar synchronization.",
    highlights: ["Gemini 2.0 Flash Core", "Web Audio API Analyzer", "Low-Latency Speech Stream"]
  },
  {
    icon: ShieldCheck,
    tag: "FAANG Benchmark",
    title: "Deterministic Rubric Engine",
    desc: "Grounded evaluation matrix assessing technical depth, architectural clarity, and problem-solving without hallucinations.",
    highlights: ["Zero-Hallucination Rules", "FAANG Rubric Alignment", "Multi-Dimensional Score Graph"]
  },
  {
    icon: Terminal,
    tag: "Execution Engine",
    title: "Live Code Sandbox & Complexity Profiler",
    desc: "In-browser live algorithm evaluation with instant space/time complexity bounds analysis and test case validation.",
    highlights: ["Isolated Web Worker", "AST Complexity Parser", "Sub-second Execution"]
  },
  {
    icon: Mic,
    tag: "Audio NLP Stream",
    title: "Real-Time Pace & Filler-Word Coach",
    desc: "Streamed audio sentiment processing flagging hesitation words ('um', 'like') and computing real-time speech WPM.",
    highlights: ["Filler-Word Counter", "Speech WPM Analytics", "Confidence Score Index"]
  }
];

const HACKATHON_METRICS = [
  { value: "< 150ms", label: "Speech Evaluation Latency", icon: Zap },
  { value: "98.4%", label: "Scoring Accuracy & Depth", icon: Award },
  { value: "4-in-1", label: "Specialized Interview Modes", icon: Layers },
  { value: "100%", label: "Live Interactive Demo Ready", icon: Flame }
];

function App() {
  // Motion Intro Overlay State (Name comes from up and stays in center for 2.5 seconds)
  const [showIntro, setShowIntro] = useState(true);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  // View Navigation State ("home" | "login" | "signup" | "profile" | "modules" | "dashboard")
  const [currentView, setCurrentView] = useState(() => (getCurrentUser() ? "home" : "login"));
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Global Chatbot State
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setShowUserDropdown(false);
    setCurrentView("login");
  };

  const navigateToView = (viewName) => {
    const protectedViews = ["modules", "profile", "feedback", "dashboard", "settings"];
    if (protectedViews.includes(viewName) && !currentUser) {
      setCurrentView("login");
    } else {
      setCurrentView(viewName);
    }
  };

  // Form State
  const [jobRole, setJobRole] = useState("Software Engineer");
  const [experience, setExperience] = useState("Fresher");
  const [difficulty, setDifficulty] = useState("Medium");

  // Active Session Room State
  const [inActiveSession, setInActiveSession] = useState(false);
  const [sessionQuestionIndex, setSessionQuestionIndex] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [liveResponse, setLiveResponse] = useState(
    "For high availability and fault isolation, I decouple services using Apache Kafka and implement circuit breakers with Redis caching."
  );
  const [activeSessionTab, setActiveSessionTab] = useState("live");
  // Interactive Simulator State
  const [activeTab, setActiveTab] = useState("technical");
  const [userSimAnswer, setUserSimAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);



  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);

  // Active Session Timer Effect
  useEffect(() => {
    let interval = null;
    if (inActiveSession) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    } else {
      setSessionTime(0);
    }
    return () => clearInterval(interval);
  }, [inActiveSession]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Enter Live Interview Chamber
  const handleEnterLiveChamber = () => {
    setIsModalOpen(false);
    setInActiveSession(true);
    setSessionQuestionIndex(0);
    setSessionEvaluated(false);
  };

  // Exit Session back to landing page
  const handleEndSession = () => {
    setInActiveSession(false);
  };

  // Submit Answer in Live Room
  const handleSubmitLiveAnswer = () => {
    setIsSessionEvaluating(true);
    setTimeout(() => {
      setIsSessionEvaluating(false);
      setSessionEvaluated(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 }
      });
    }, 900);
  };

  // Automatic 2.6-second timer to hold Intro in center and then hide
  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  // Reload Application Page
  const handleReload = () => {
    window.location.reload();
  };

  // Sync simulator answer when tab changes
  const activeModeData = SIMULATOR_MODES.find((m) => m.id === activeTab) || SIMULATOR_MODES[0];

  useEffect(() => {
    setUserSimAnswer(activeModeData.sampleResponse);
  }, [activeTab]);

  // Open Modal Setup Form
  const handleOpenModal = (e) => {
    if (e) e.preventDefault();
    setIsModalOpen(true);
    setModalStep(0);
  };

  // Submit Form & Launch AI Chamber Simulation
  const handleLaunchChamber = (e) => {
    if (e) e.preventDefault();
    setModalStep(1);

    // Simulate AI environment initialization sequence
    setTimeout(() => setModalStep(2), 1200);
    setTimeout(() => {
      setModalStep(3);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 2400);
  };

  // Simulate Instant AI Re-evaluation
  const handleReevaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
    }, 800);
  };

  // Render Full-Screen Active Interview Chamber Room when inActiveSession is true
  if (inActiveSession) {
    return (
      <div className="active-session-container">
        {/* Session Top Navbar */}
        <div className="session-navbar">
          <div className="nav-brand" onClick={handleEndSession}>
            <div className="brand-icon-box" style={{ width: 32, height: 32 }}>
              <Sparkles size={16} color="#06070a" />
            </div>
            <span className="text-gradient-gold">Mockify Live</span>
          </div>

          <div className="session-meta-pills">
            <span className="meta-pill">Role: {jobRole}</span>
            <span className="meta-pill">Level: {experience}</span>
            <span className="meta-pill" style={{ borderColor: "#d4af37", color: "#f3e5ab" }}>
              Difficulty: {difficulty}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className={`profile-nav-btn ${activeSessionTab === "live" ? "active" : ""}`}
                onClick={() => setActiveSessionTab("live")}
              >
                <Video size={14} /> Live Chamber
              </button>
              <button
                className={`profile-nav-btn ${activeSessionTab === "modules" ? "active" : ""}`}
                onClick={() => setActiveSessionTab("modules")}
              >
                <Layers size={14} /> Interview Modules
              </button>
            </div>

            <div className="session-timer">
              <Clock size={18} color="#10b981" /> {formatTimer(sessionTime)}
            </div>
            <button className="btn-danger" onClick={handleEndSession}>
              <X size={16} /> End Session & Exit
            </button>
          </div>
        </div>

        {activeSessionTab === "modules" ? (
          <InterviewModules
            onBack={() => setActiveSessionTab("live")}
            onOpenChamber={() => setActiveSessionTab("live")}
          />
        ) : (
          /* Live Session Body */
          <div className="session-body">
          {/* Left Column: AI Avatar & Question */}
          <div className="session-card">
            <div className="ai-evaluator-box">
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div className="ai-avatar" style={{ width: 48, height: 48 }}>
                  <Bot size={26} color="#06070a" />
                </div>
                <div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700 }}>AI Lead Evaluator</h4>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Session Active • Speech Evaluation Stream</p>
                </div>
              </div>
              <div className="sound-waves">
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#d4af37", textTransform: "uppercase", marginBottom: "8px" }}>
                Question {sessionQuestionIndex + 1} of 3
              </div>
              <div className="session-question-card">
                {sessionQuestionIndex === 0 && (
                  <span>
                    "Welcome! Target set for <strong>{jobRole}</strong> ({experience} • {difficulty} Difficulty). Explain how you would design a high-throughput microservices system handling 50,000 requests/sec with zero single points of failure."
                  </span>
                )}
                {sessionQuestionIndex === 1 && (
                  <span>
                    "Excellent structure. Now, how do you handle database migration, rollback strategies, and data consistency during high write traffic spikes?"
                  </span>
                )}
                {sessionQuestionIndex === 2 && (
                  <span>
                    "Tell me about a time you had to resolve a major architectural bottleneck or technical conflict with team members under tight deadlines."
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginTop: "auto", display: "flex", gap: "12px" }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  setSessionQuestionIndex((prev) => (prev + 1) % 3);
                  setSessionEvaluated(false);
                }}
                style={{ width: "100%", justifyContent: "center" }}
              >
                Next Question <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Candidate Workspace & Real-time Evaluation */}
          <div className="session-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                <Mic size={18} color="#d4af37" /> Candidate Speech Input
              </h4>
              <button
                className={`btn-secondary ${isMicMuted ? "" : "active"}`}
                style={{ padding: "6px 14px", fontSize: "0.8rem" }}
                onClick={() => setIsMicMuted(!isMicMuted)}
              >
                {isMicMuted ? <MicOff size={14} /> : <Mic size={14} color="#10b981" />}
                {isMicMuted ? "Mic Muted" : "Mic Live"}
              </button>
            </div>

            <textarea
              className="session-textarea"
              value={liveResponse}
              onChange={(e) => setLiveResponse(e.target.value)}
              placeholder="Speak or type your response here..."
            />

            <button
              className="btn-primary"
              style={{ justifyContent: "center", padding: "14px" }}
              onClick={handleSubmitLiveAnswer}
              disabled={isSessionEvaluating}
            >
              {isSessionEvaluating ? (
                <>
                  <RefreshCw size={18} className="spin" /> Evaluating Speech & Logic...
                </>
              ) : (
                <>
                  <Play size={18} fill="currentColor" /> Submit Response to AI Evaluator
                </>
              )}
            </button>

            {/* Evaluation Score Card */}
            {sessionEvaluated && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "20px",
                  background: "rgba(8, 9, 13, 0.8)",
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                  borderRadius: "16px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Real-time Evaluation Report:</span>
                  <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#d4af37" }}>95 / 100</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", textAlign: "center", fontSize: "0.8rem" }}>
                  <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px", borderRadius: "8px" }}>
                    <div style={{ color: "#10b981", fontWeight: 800, fontSize: "1.1rem" }}>96%</div>
                    <div style={{ color: "#94a3b8" }}>Speech Clarity</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px", borderRadius: "8px" }}>
                    <div style={{ color: "#d4af37", fontWeight: 800, fontSize: "1.1rem" }}>94%</div>
                    <div style={{ color: "#94a3b8" }}>Technical Depth</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.04)", padding: "10px", borderRadius: "8px" }}>
                    <div style={{ color: "#c5a059", fontWeight: 800, fontSize: "1.1rem" }}>95%</div>
                    <div style={{ color: "#94a3b8" }}>Structure</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* 
        ========================================================================
        MOTION INTRO INTERFACE (Name "Mockify" comes from top & stays in center 2-3 sec)
        ========================================================================
      */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.96 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="intro-content">
              <div className="intro-icon-ring">
                <Sparkles size={44} color="#d4af37" />
              </div>

              <h1 className="intro-brand-name">
                Mockify
              </h1>

              <div className="intro-subtitle">
                Your AI-powered interview coach.
              </div>

              <div className="intro-loader-line">
                <div className="intro-loader-bar"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Subtle Ambient Orbs & Mesh Overlay */}
      <div className="bg-ambient-wrapper">
        <div className="ambient-blob blob-1"></div>
        <div className="ambient-blob blob-2"></div>
        <div className="ambient-blob blob-3"></div>
      </div>
      <div className="grid-overlay"></div>

      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => { setCurrentView("home"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="brand-icon-box">
            <Sparkles size={22} color="#06070a" />
          </div>
          <span className="text-gradient-gold">Mockify</span>
        </div>

        <ul className="nav-links">
          <li>
            <a
              href="#home"
              style={{ color: currentView === "home" ? "var(--gold-light)" : "var(--text-muted)", fontWeight: currentView === "home" ? 700 : 500 }}
              onClick={(e) => { e.preventDefault(); navigateToView("home"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              {currentUser ? "Dashboard" : "Home"}
            </a>
          </li>
          <li>
            <a
              href="#modules"
              style={{ color: currentView === "modules" ? "var(--gold-light)" : "var(--text-muted)", fontWeight: currentView === "modules" ? 700 : 500 }}
              onClick={(e) => { e.preventDefault(); navigateToView("modules"); }}
            >
              Interview Modules
            </a>
          </li>
          <li>
            <a
              href="#profile"
              style={{ color: currentView === "profile" ? "var(--gold-light)" : "var(--text-muted)", fontWeight: currentView === "profile" ? 700 : 500 }}
              onClick={(e) => { e.preventDefault(); navigateToView("profile"); }}
            >
              Profile
            </a>
          </li>
          <li>
            <a
              href="#feedback"
              style={{ color: "var(--text-muted)" }}
              onClick={(e) => { e.preventDefault(); navigateToView("modules"); }}
            >
              Feedback
            </a>
          </li>
        </ul>

        <div className="nav-actions">
          {currentUser ? (
            <div style={{ position: "relative" }}>
              <button
                className="user-avatar-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                title="User Menu"
              >
                <User size={15} /> {currentUser.name ? currentUser.name.split(" ")[0] : "User"} <ChevronDown size={14} />
              </button>

              {showUserDropdown && (
                <div className="user-dropdown-menu">
                  <button
                    className="dropdown-item-btn"
                    onClick={() => { setShowUserDropdown(false); navigateToView("profile"); }}
                  >
                    <User size={14} /> Profile
                  </button>
                  <button
                    className="dropdown-item-btn"
                    onClick={() => { setShowUserDropdown(false); navigateToView("settings"); }}
                  >
                    <SettingsIcon size={14} /> Settings
                  </button>
                  <button
                    className="dropdown-item-btn logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                className="profile-nav-btn"
                onClick={() => setCurrentView("login")}
              >
                Login
              </button>
              <button
                className="btn-primary"
                onClick={() => setCurrentView("signup")}
                style={{ padding: "8px 18px", fontSize: "0.85rem" }}
              >
                Get Started <ArrowRight size={14} />
              </button>
            </>
          )}

          <button className="replay-intro-btn" onClick={handleReload} title="Reload Page">
            <RotateCcw size={14} /> Reload
          </button>

          <button
            className="navbar-ai-assistant-btn"
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
            title="Open Mockify AI Assistant"
          >
            <span className="pulse-dot-gold"></span>
            <Bot size={15} color="#d4af37" /> AI Assistant
          </button>

          <button className="btn-primary" onClick={handleOpenModal}>
            Start Session <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* View Routing */}
      {currentView === "login" ? (
        <Login
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setCurrentView("home");
          }}
          onNavigateSignup={() => setCurrentView("signup")}
        />
      ) : currentView === "signup" ? (
        <Signup
          onSignupSuccess={(user) => {
            setCurrentUser(user);
            setCurrentView("home");
          }}
          onNavigateLogin={() => setCurrentView("login")}
        />
      ) : currentView === "modules" ? (
        <InterviewModules
          onBack={() => {
            setCurrentView("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onOpenChamber={handleOpenModal}
        />
      ) : currentView === "profile" ? (
        <ProfilePage
          onBack={() => {
            setCurrentView("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onLaunchChamber={handleOpenModal}
        />
      ) : currentView === "settings" ? (
        <SettingsPage
          onNavigateModules={() => {
            setCurrentView("modules");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onLogout={handleLogout}
        />
      ) : (
        <>
          {/* Hero Section */}
          <section className="hero-section">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="hero-tagline-badge">
                <Bot size={16} color="#d4af37" />
                <span>AI-Powered Precision Interviewing</span>
              </div>

              <h1 className="hero-title">
                Master Every Question. <br />
                <span className="text-gradient-gold">Perform With Distinction.</span>
              </h1>

              <p className="hero-description">
                Practice technical, behavioral, and system design interviews powered by realistic AI models. Receive instant analytical feedback on speech, logic, and structure.
              </p>

              {/* Interactive Setup Form */}
              <div className="hero-form-card">
                <div className="form-header">
                  <h3>
                    <Briefcase size={20} color="#d4af37" /> Configure Your Interview
                  </h3>
                </div>

                <form onSubmit={handleLaunchChamber}>
              <div className="input-group">
                <label>Job Role</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="Software Engineer"
                    required
                  />
                </div>
                {/* Quick suggestions */}
                <div className="quick-roles">
                  {POPULAR_ROLES.slice(0, 4).map((role) => (
                    <span
                      key={role}
                      className={`role-pill ${jobRole === role ? "active" : ""}`}
                      onClick={() => setJobRole(role)}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label>Experience</label>
                <div className="input-wrapper">
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    <option value="Fresher">Fresher (0-1 Years)</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="3-5 Years">3-5 Years</option>
                    <option value="5+ Years">5+ Years (Senior / Lead)</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>Difficulty</label>
                <div className="difficulty-radio-group">
                  {["Easy", "Medium", "Hard"].map((level) => (
                    <div
                      key={level}
                      className={`radio-label ${difficulty === level ? "active" : ""}`}
                      onClick={() => setDifficulty(level)}
                    >
                      <div className="radio-circle">
                        {difficulty === level && <div className="radio-dot" />}
                      </div>
                      <span>{level}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary hero-submit-btn">
                Start Interview <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </motion.div>

        {/* Hero Interactive Visual Container */}
        <motion.div
          className="hero-visual-container"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Floating Badges */}
          <div className="floating-badge floating-badge-1">
            <Award size={20} color="#d4af37" />
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#f8fafc" }}>98.4% Offer Rate</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>12,000+ Candidates Placed</div>
            </div>
          </div>

          <div className="floating-badge floating-badge-2">
            <Zap size={20} color="#d4af37" />
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "#f8fafc" }}>&lt; 120ms Response</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Sub-second Speech Stream</div>
            </div>
          </div>

          {/* Main Visual Screen Card */}
          <div className="visual-main-card">
            <div className="avatar-badge-row">
              <div className="ai-interviewer-tag">
                <div className="ai-avatar">
                  <Bot size={26} color="#06070a" />
                </div>
                <div className="ai-meta">
                  <h4>AI Lead Evaluator</h4>
                  <p>Simulation Chamber • {jobRole}</p>
                </div>
              </div>
              <div className="sound-waves">
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
              </div>
            </div>

            <div className="speech-bubble">
              <span style={{ color: "#d4af37", fontWeight: 700 }}>AI Evaluator: </span>
              "Welcome! Target set for <strong>{jobRole}</strong> ({experience}). Let me evaluate your architectural trade-offs for high-scale distributed caching."
            </div>

            <div className="candidate-response-preview">
              <div className="response-tag">
                <Mic size={14} /> Candidate Voice Input Stream
              </div>
              <p style={{ fontStyle: "italic", fontSize: "0.9rem", color: "#e2e8f0" }}>
                "I recommend an active-active Redis cluster backed by Cassandra for event log persistence to achieve sub-10ms response times..."
              </p>
            </div>

            <div className="realtime-metrics">
              <div className="metric-box">
                <div className="metric-val">96%</div>
                <div className="metric-lbl">Confidence</div>
              </div>
              <div className="metric-box">
                <div className="metric-val">142</div>
                <div className="metric-lbl">WPM Pace</div>
              </div>
              <div className="metric-box">
                <div className="metric-val">0</div>
                <div className="metric-lbl">Fillers</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Simulator Section */}
      <section id="simulator" className="section-wrapper">
        <div className="section-header">
          <div className="section-subtitle">Interactive Sandbox</div>
          <h2 className="section-title">Experience <span className="text-gradient-gold">Real-Time AI Grading</span></h2>
          <p className="section-desc">
            Test a sample prompt below. Switch tracks to experience how Mockify evaluates technical depth and behavioral structure.
          </p>
        </div>

        <div className="simulator-card">
          <div className="simulator-tabs">
            {SIMULATOR_MODES.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <button
                  key={mode.id}
                  className={`tab-btn ${activeTab === mode.id ? "active" : ""}`}
                  onClick={() => setActiveTab(mode.id)}
                >
                  <IconComponent size={18} />
                  {mode.label}
                </button>
              );
            })}
          </div>

          <div className="simulator-body">
            <div className="sim-question-pane">
              <div className="question-badge-row">
                <span className={`diff-badge ${activeModeData.difficulty.toLowerCase()}`}>
                  {activeModeData.difficulty} Tier
                </span>
                <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Target: {jobRole}</span>
              </div>

              <h3 className="sim-question-title">{activeModeData.question}</h3>

              <div style={{ marginTop: "10px" }}>
                <label style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600, display: "block", marginBottom: "8px" }}>
                  Your Response (Editable Demo):
                </label>
                <textarea
                  className="sim-answer-area"
                  value={userSimAnswer}
                  onChange={(e) => setUserSimAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                />
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <button className="btn-secondary" onClick={handleReevaluate} disabled={isEvaluating}>
                  <RefreshCw size={16} className={isEvaluating ? "spin" : ""} /> Re-Evaluate Response
                </button>
                <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                  {isEvaluating ? "Analyzing reasoning and structure..." : "Click to recalculate score matrix"}
                </span>
              </div>
            </div>

            <div className="sim-feedback-pane">
              <div className="feedback-header">
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>AI Performance Score</h4>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Analyzed in 0.12 seconds</p>
                </div>
                <div className="score-circle-large">
                  {Math.round(
                    (activeModeData.scores.comm +
                      activeModeData.scores.depth +
                      activeModeData.scores.logic +
                      activeModeData.scores.speed) / 4
                  )}
                </div>
              </div>

              <div className="score-bar-group">
                <div className="score-bar-item">
                  <div className="bar-label-row">
                    <span>Communication & Clarity</span>
                    <span style={{ color: "#d4af37" }}>{activeModeData.scores.comm}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${activeModeData.scores.comm}%`, background: "linear-gradient(90deg, #d4af37, #f3e5ab)" }}
                    ></div>
                  </div>
                </div>

                <div className="score-bar-item">
                  <div className="bar-label-row">
                    <span>Technical Depth</span>
                    <span style={{ color: "#c5a059" }}>{activeModeData.scores.depth}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${activeModeData.scores.depth}%`, background: "linear-gradient(90deg, #c5a059, #e2e8f0)" }}
                    ></div>
                  </div>
                </div>

                <div className="score-bar-item">
                  <div className="bar-label-row">
                    <span>Logical Reasoning</span>
                    <span style={{ color: "#10b981" }}>{activeModeData.scores.logic}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${activeModeData.scores.logic}%`, background: "linear-gradient(90deg, #10b981, #34d399)" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "10px" }}>
                <h5 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", marginBottom: "8px" }}>
                  KEY EVALUATION HIGHLIGHTS
                </h5>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {activeModeData.feedback.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "#e2e8f0" }}>
                      <CheckCircle2 size={16} color="#d4af37" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="section-wrapper">
        <div className="section-header">
          <div className="section-subtitle">Core Capabilities</div>
          <h2 className="section-title">Designed for <span className="text-gradient-gold">Peak Performance</span></h2>
          <p className="section-desc">
            Everything required to master high-stakes interviews with calm confidence and structural mastery.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <motion.div
                key={idx}
                className="glass-panel feature-card"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="feature-icon-wrapper">
                  <IconComp size={28} />
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How it Works Workflow Steps */}
      <section id="how-it-works" className="section-wrapper">
        <div className="section-header">
          <div className="section-subtitle">The Process</div>
          <h2 className="section-title">How <span className="text-gradient-gold">Mockify</span> Refines Your Edge</h2>
          <p className="section-desc">
            A seamless, structured 4-step path to interview excellence.
          </p>
        </div>

        <div className="workflow-steps">
          <div className="glass-panel step-card">
            <div className="step-number">01</div>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Define Role Target</h4>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Select position title and seniority level to generate customized question sets.
            </p>
          </div>

          <div className="glass-panel step-card">
            <div className="step-number">02</div>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Interactive AI Session</h4>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Converse with our speech-enabled AI avatar in realistic interview rounds.
            </p>
          </div>

          <div className="glass-panel step-card">
            <div className="step-number">03</div>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Real-Time Analysis</h4>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Receive instant feedback on technical precision, filler word usage, and structure.
            </p>
          </div>

          <div className="glass-panel step-card">
            <div className="step-number">04</div>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Refine & Elevate</h4>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Review comprehensive rubrics and target weak spots before your actual onsite.
            </p>
          </div>
        </div>
      </section>

      {/* Hackathon Pitch & System Architecture Section */}
      <section id="architecture" className="section-wrapper">
        <div className="section-header">
          <div className="section-subtitle">Hackathon Presentation</div>
          <h2 className="section-title">
            System Architecture & <span className="text-gradient-gold">Core Innovations</span>
          </h2>
          <p className="section-desc">
            Engineered specifically for high-speed responsiveness, multimodal voice feedback, and zero-hallucination interview scoring.
          </p>
        </div>

        {/* Hackathon Highlights Grid */}
        <div className="hackathon-grid">
          {HACKATHON_SPECS.map((spec, idx) => {
            const IconComp = spec.icon;
            return (
              <motion.div
                key={idx}
                className="glass-panel hackathon-card"
                whileHover={{ y: -6, borderColor: "rgba(212, 175, 55, 0.4)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="hackathon-card-header">
                  <div className="hackathon-icon-box">
                    <IconComp size={24} color="#d4af37" />
                  </div>
                  <span className="hackathon-badge">{spec.tag}</span>
                </div>
                <h3>{spec.title}</h3>
                <p className="hackathon-card-desc">{spec.desc}</p>
                <div className="hackathon-tech-pills">
                  {spec.highlights.map((item, i) => (
                    <span key={i} className="tech-pill">
                      <CheckCircle2 size={12} color="#d4af37" /> {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hackathon Pitch Metrics Banner */}
        <div className="glass-panel hackathon-metrics-banner">
          {HACKATHON_METRICS.map((metric, i) => {
            const MIcon = metric.icon;
            return (
              <div key={i} className="metric-item">
                <div className="metric-icon-wrap">
                  <MIcon size={20} color="#d4af37" />
                </div>
                <div className="metric-val text-gradient-gold">{metric.value}</div>
                <div className="metric-label">{metric.label}</div>
              </div>
            );
          })}
        </div>

        {/* Hackathon Project Roadmap / Vision Panel */}
        <div className="glass-panel hackathon-roadmap-panel">
          <div className="roadmap-header">
            <Award size={24} color="#d4af37" />
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Project Vision & Roadmap</h3>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "4px 0 0 0" }}>
                Built for Hackathon 2026 • Scalable for Enterprise Deployment
              </p>
            </div>
          </div>
          <div className="roadmap-steps">
            <div className="roadmap-step active">
              <div className="step-tag">Phase 1 • Live Demo</div>
              <h4>Multimodal AI Chamber</h4>
              <p>Speech & Video avatar, real-time code sandbox, resume analysis engine.</p>
            </div>
            <div className="roadmap-step">
              <div className="step-tag">Phase 2 • Next Step</div>
              <h4>Multi-Agent Panel</h4>
              <p>Dual AI interviewers (System Architect + HR Director) conducting joint rounds.</p>
            </div>
            <div className="roadmap-step">
              <div className="step-tag">Phase 3 • Scaling</div>
              <h4>Enterprise Cohort Analytics</h4>
              <p>Placement cell analytics dashboards & WebXR immersive interview rooms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="section-wrapper">
        <div className="cta-banner">
          <h2>Experience Next-Gen Preparation. <br /><span className="text-gradient-gold">Interactive AI Presentation Ready.</span></h2>
          <p style={{ maxWidth: "600px", color: "#94a3b8", fontSize: "1.1rem" }}>
            Demonstrating sub-second real-time evaluation, multimodal voice interaction, and instant performance metrics.
          </p>
          <button className="btn-primary" style={{ padding: "16px 36px", fontSize: "1.1rem" }} onClick={handleOpenModal}>
            <Sparkles size={20} /> Launch AI Interview Chamber
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-icon-box" style={{ width: 32, height: 32 }}>
              <Sparkles size={16} color="#06070a" />
            </div>
            <span className="text-gradient-gold">Mockify</span>
          </div>

          <div className="footer-copy">
            © {new Date().getFullYear()} Mockify AI. All rights reserved. Precision AI Interview Platform.
          </div>

          <div style={{ display: "flex", gap: "20px", color: "#94a3b8", fontSize: "0.85rem" }}>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Support</a>
          </div>
        </div>
      </footer>
        </>
      )}

      {/* Interactive Preparation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
            >
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>

              <div style={{ textAlign: "center" }}>
                <div className="brand-icon-box" style={{ margin: "0 auto 16px auto", width: 50, height: 50 }}>
                  <Bot size={28} color="#06070a" />
                </div>

                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", fontWeight: 800, marginBottom: "8px" }}>
                  {modalStep === 0 ? "Start AI Interview" : "Preparing AI Chamber"}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "20px" }}>
                  {modalStep === 0 ? "Configure session parameters before entering chamber" : `Generating rubric for ${jobRole} (${experience} • ${difficulty})`}
                </p>

                {modalStep === 0 && (
                  <form onSubmit={handleLaunchChamber} style={{ textAlign: "left", marginTop: "12px" }}>
                    <div className="input-group">
                      <label>Job Role</label>
                      <div className="input-wrapper">
                        <Briefcase size={0} className="input-icon" />
                        <input
                          type="text"
                          value={jobRole}
                          onChange={(e) => setJobRole(e.target.value)}
                          placeholder="Software Engineer"
                          required
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Experience</label>
                      <div className="input-wrapper">
                        <Sliders size={0} className="input-icon" />
                        <select
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                        >
                          <option value="Fresher">Fresher (0-1 Years)</option>
                          <option value="1-2 Years">1-2 Years</option>
                          <option value="3-5 Years">3-5 Years</option>
                          <option value="5+ Years">5+ Years (Senior / Lead)</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Difficulty</label>
                      <div className="difficulty-radio-group">
                        {["Easy", "Medium", "Hard"].map((level) => (
                          <div
                            key={level}
                            className={`radio-label ${difficulty === level ? "active" : ""}`}
                            onClick={() => setDifficulty(level)}
                          >
                            <div className="radio-circle">
                              {difficulty === level && <div className="radio-dot" />}
                            </div>
                            <span>{level}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="btn-primary hero-submit-btn" style={{ marginTop: "24px" }}>
                      Start Interview <ArrowRight size={18} />
                    </button>
                  </form>
                )}

                {modalStep === 1 && (
                  <div style={{ padding: "30px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                    <RefreshCw size={36} className="spin" color="#d4af37" />
                    <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>Initializing Speech Neural Network & Evaluation Matrices...</p>
                  </div>
                )}

                {modalStep === 2 && (
                  <div style={{ padding: "30px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                    <Video size={36} color="#c5a059" />
                    <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>Calibrating Microphone & Guardrail Benchmarks...</p>
                  </div>
                )}

                {modalStep === 3 && (
                  <div style={{ padding: "20px 0" }}>
                    <div style={{ display: "inline-flex", padding: "12px", borderRadius: "50%", background: "rgba(212, 175, 55, 0.15)", color: "#d4af37", marginBottom: "16px" }}>
                      <CheckCircle2 size={36} />
                    </div>
                    <h4 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>Interview Chamber Ready</h4>
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "24px" }}>
                      Your AI Senior Evaluator is waiting in the private session chamber for <strong>{jobRole}</strong> ({difficulty} Difficulty).
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <button
                        className="btn-primary"
                        style={{ width: "100%", justifyContent: "center", padding: "14px" }}
                        onClick={handleEnterLiveChamber}
                      >
                        Enter Live Interview Chamber <ChevronRight size={18} />
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ width: "100%", justifyContent: "center", padding: "12px" }}
                        onClick={() => {
                          setIsModalOpen(false);
                          setCurrentView("modules");
                        }}
                      >
                        <Layers size={16} /> Open Interview Modules Dashboard
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Mockify AI Assistant Chatbot */}
      <Chatbot
        isOpen={isChatbotOpen}
        onToggle={setIsChatbotOpen}
        userContext={{ jobRole, experience, difficulty }}
      />
    </div>
  );
}

export default App;