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
  RotateCcw
} from "lucide-react";
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

// Testimonials Data
const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Senior Software Engineer @ Google",
    company: "Google",
    text: "Mockify gave me the exact confidence boost I needed. The AI's system design questions were scarily close to my actual Google onsite rounds!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "Priya Sharma",
    role: "Fullstack Engineer @ Meta",
    company: "Meta",
    text: "The real-time voice feedback on my communication speed helped me eliminate filler words. Landed 3 offers in a single month!",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "David Chen",
    role: "Lead Architect @ Stripe",
    company: "Stripe",
    text: "As someone who gets interview anxiety, practicing with Mockify's AI avatar in realistic environments completely eliminated my stress.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  }
];

function App() {
  // Motion Intro Overlay State (Name comes from up and stays in center for 2.5 seconds)
  const [showIntro, setShowIntro] = useState(true);

  // Form State
  const [jobRole, setJobRole] = useState("Software Engineer");
  const [experience, setExperience] = useState("3-5 Years");
  
  // Interactive Simulator State
  const [activeTab, setActiveTab] = useState("technical");
  const [userSimAnswer, setUserSimAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Pricing toggle state
  const [isAnnual, setIsAnnual] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);

  // Automatic 2.6-second timer to hold Intro in center and then hide
  useEffect(() => {
    if (showIntro) {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  // Replay Intro trigger
  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  // Sync simulator answer when tab changes
  const activeModeData = SIMULATOR_MODES.find((m) => m.id === activeTab) || SIMULATOR_MODES[0];
  
  useEffect(() => {
    setUserSimAnswer(activeModeData.sampleResponse);
  }, [activeTab]);

  // Handle Form Submit / Start Interview
  const handleStartInterview = (e) => {
    if (e) e.preventDefault();
    setIsModalOpen(true);
    setModalStep(1);
    
    // Simulate AI environment initialization sequence
    setTimeout(() => setModalStep(2), 1200);
    setTimeout(() => {
      setModalStep(3);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 2500);
  };

  // Simulate Instant AI Re-evaluation
  const handleReevaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
    }, 800);
  };

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
            <motion.div
              className="intro-content"
              initial={{ y: -90, opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 140,
                damping: 16,
                delay: 0
              }}
            >
              <div className="intro-icon-ring">
                <Sparkles size={44} color="#d4af37" />
              </div>

              <h1 className="intro-brand-name">
                Mockify
              </h1>

              <div className="intro-subtitle">
                 AI INTERVIEW INTELLIGENCE
              </div>

              <div className="intro-loader-line">
                <div className="intro-loader-bar"></div>
              </div>
            </motion.div>
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
        <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="brand-icon-box">
            <Sparkles size={22} color="#06070a" />
          </div>
          <span className="text-gradient-gold">Mockify</span>
        </div>

        <ul className="nav-links">
          <li><a href="#simulator">Live Demo</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How it Works</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>

        <div className="nav-actions">
          <button className="replay-intro-btn" onClick={handleReplayIntro} title="Replay Motion Intro">
            <RotateCcw size={14} /> Intro
          </button>
          
          <div className="status-badge">
            <span className="pulse-dot"></span>
            AI Core Active
          </div>
          
          <button className="btn-primary" onClick={handleStartInterview}>
            Start Session <ArrowRight size={16} />
          </button>
        </div>
      </nav>

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

            <form onSubmit={handleStartInterview}>
              <div className="input-group">
                <label>Job Role Target</label>
                <div className="input-wrapper">
                  <Briefcase size={18} className="input-icon" />
                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    placeholder="Enter Job Role (e.g. Software Engineer)"
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
                <label>Experience Tier</label>
                <div className="input-wrapper">
                  <Sliders size={18} className="input-icon" />
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    <option>Fresher (0-1 Years)</option>
                    <option>1-2 Years</option>
                    <option>3-5 Years</option>
                    <option>5+ Years (Senior / Lead)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-primary hero-submit-btn">
                <Play size={18} fill="currentColor" /> Launch Practice Chamber
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

      {/* Testimonials */}
      <section className="section-wrapper">
        <div className="section-header">
          <div className="section-subtitle">Track Record</div>
          <h2 className="section-title">Trusted by Candidates at <span className="text-gradient-gold">Premier Tech Firms</span></h2>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((test, idx) => (
            <motion.div
              key={idx}
              className="glass-panel testimonial-card"
              whileHover={{ y: -6 }}
            >
              <div style={{ display: "flex", gap: "4px", color: "#d4af37" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              <p style={{ fontSize: "0.95rem", color: "#cbd5e1", fontStyle: "italic", lineHeight: 1.6 }}>
                "{test.text}"
              </p>

              <div className="test-user">
                <img src={test.avatar} alt={test.name} className="test-avatar" />
                <div className="test-info">
                  <h4>{test.name}</h4>
                  <p>{test.role}</p>
                </div>
                <span className="company-badge" style={{ marginLeft: "auto" }}>{test.company}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="section-wrapper">
        <div className="section-header">
          <div className="section-subtitle">Membership Plans</div>
          <h2 className="section-title">Invest in Your <span className="text-gradient-gold">Future Offer</span></h2>
          <p className="section-desc">
            Flexible membership tailored for active job seekers.
          </p>
        </div>

        <div className="pricing-toggle-wrapper">
          <span style={{ fontWeight: isAnnual ? 500 : 700, color: isAnnual ? "#94a3b8" : "#ffffff" }}>Monthly</span>
          <div className={`toggle-switch ${isAnnual ? "active" : ""}`} onClick={() => setIsAnnual(!isAnnual)}>
            <div className="switch-knob"></div>
          </div>
          <span style={{ fontWeight: isAnnual ? 700 : 500, color: isAnnual ? "#ffffff" : "#94a3b8" }}>
            Annual <span style={{ color: "#d4af37", fontSize: "0.8rem", marginLeft: "4px" }}>(Save 30%)</span>
          </span>
        </div>

        <div className="pricing-grid">
          {/* Starter Plan */}
          <div className="glass-panel price-card">
            <div>
              <div className="price-header">
                <h3>Starter</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Ideal for focused preparation</p>
              </div>
              <div className="price-amount">
                {isAnnual ? "$19" : "$29"} <span>/ month</span>
              </div>
              <ul className="price-features">
                <li><Check size={16} /> 5 AI Mock Sessions / mo</li>
                <li><Check size={16} /> Technical & Behavioral Modes</li>
                <li><Check size={16} /> Standard Speech Feedback</li>
                <li><Check size={16} /> Performance Summary</li>
              </ul>
            </div>
            <button className="btn-secondary" style={{ width: "100%" }} onClick={handleStartInterview}>
              Select Starter
            </button>
          </div>

          {/* Pro Plan (Popular) */}
          <div className="glass-panel price-card popular">
            <div className="popular-ribbon">Recommended</div>
            <div>
              <div className="price-header">
                <h3>Pro Candidate</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Unlimited practice for active job hunts</p>
              </div>
              <div className="price-amount">
                {isAnnual ? "$39" : "$49"} <span>/ month</span>
              </div>
              <ul className="price-features">
                <li><Check size={16} /> Unlimited AI Mock Interviews</li>
                <li><Check size={16} /> Real-time Speech & Video Avatar</li>
                <li><Check size={16} /> Code Sandbox & Complexity Analytics</li>
                <li><Check size={16} /> FAANG Question Bank Access</li>
                <li><Check size={16} /> Sub-second AI Evaluation Reports</li>
              </ul>
            </div>
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleStartInterview}>
              Start 7-Day Free Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-panel price-card">
            <div>
              <div className="price-header">
                <h3>Bootcamps & Teams</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>For universities & placement cells</p>
              </div>
              <div className="price-amount">
                {isAnnual ? "$99" : "$129"} <span>/ month</span>
              </div>
              <ul className="price-features">
                <li><Check size={16} /> Everything in Pro Tier</li>
                <li><Check size={16} /> Cohort Analytics Dashboard</li>
                <li><Check size={16} /> Custom Rubric Builder</li>
                <li><Check size={16} /> Priority Technical Support</li>
              </ul>
            </div>
            <button className="btn-secondary" style={{ width: "100%" }} onClick={handleStartInterview}>
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="section-wrapper">
        <div className="cta-banner">
          <h2>Prepare with Distinction. <br /><span className="text-gradient-gold">Land Your Dream Offer.</span></h2>
          <p style={{ maxWidth: "600px", color: "#94a3b8", fontSize: "1.1rem" }}>
            Join thousands of software engineers and architects who leveled up their interview performance with Mockify.
          </p>
          <button className="btn-primary" style={{ padding: "16px 36px", fontSize: "1.1rem" }} onClick={handleStartInterview}>
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
                  Preparing AI Chamber
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "24px" }}>
                  Generating customized rubric for <strong>{jobRole}</strong> ({experience})
                </p>

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
                    <h4 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>Interview Environment Ready</h4>
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "24px" }}>
                      Your AI Senior Lead is ready to conduct your session.
                    </p>

                    <button
                      className="btn-primary"
                      style={{ width: "100%", justifyContent: "center", padding: "16px" }}
                      onClick={() => setIsModalOpen(false)}
                    >
                      Enter Live Interview Chamber <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;