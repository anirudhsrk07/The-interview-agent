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
  Video
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
    title: "AI Voice & Video Interviewer",
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
  // State for original interactive form elements
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
      {/* Background Glowing Ambient Orbs & Mesh Overlay */}
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
            <Sparkles size={22} color="#040817" />
          </div>
          <span className="text-gradient">Mockify</span>
        </div>

        <ul className="nav-links">
          <li><a href="#simulator">Live Demo</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How it Works</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>

        <div className="nav-actions">
          <div className="status-badge">
            <span className="pulse-dot"></span>
            AI Engine Online
          </div>
          <button className="btn-primary" onClick={handleStartInterview}>
            Start Interview <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-tagline-badge">
            <Bot size={16} />
            <span>Next-Gen AI Mock Interview Platform</span>
          </div>

          <h1 className="hero-title">
            Practice AI Mock Interviews. <br />
            <span className="text-gradient">Get Hired 3x Faster.</span>
          </h1>

          <p className="hero-description">
            Practice realistic AI-powered technical, behavioral, and system design interviews. Receive instant real-time feedback on your speech, code, and confidence.
          </p>

          {/* Core Interactive Setup Form (Preserved original inputs enhanced with glassmorphism UI) */}
          <div className="hero-form-card">
            <div className="form-header">
              <h3>
                <Briefcase size={20} className="text-gradient" /> Customize Your Session
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
                <label>Experience Level</label>
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
                <Play size={18} fill="currentColor" /> Start Interview Now
              </button>
            </form>
          </div>
        </motion.div>

        {/* Hero Interactive Visual Container */}
        <motion.div
          className="hero-visual-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Floating Badges */}
          <div className="floating-badge floating-badge-1">
            <Award size={20} color="#00f2fe" />
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>98.4% Offer Rate</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>12k+ Candidates Passed</div>
            </div>
          </div>

          <div className="floating-badge floating-badge-2">
            <Zap size={20} color="#a855f7" />
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>&lt; 120ms Latency</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Real-time Audio Stream</div>
            </div>
          </div>

          {/* Main Visual Screen Card */}
          <div className="visual-main-card">
            <div className="avatar-badge-row">
              <div className="ai-interviewer-tag">
                <div className="ai-avatar">
                  <Bot size={26} color="#040817" />
                </div>
                <div className="ai-meta">
                  <h4>AI Senior Interviewer</h4>
                  <p>Evaluation Mode • {jobRole}</p>
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
              <span style={{ color: "#00f2fe", fontWeight: 700 }}>AI Interviewer: </span>
              "Welcome! I see you're applying for the <strong>{jobRole}</strong> position ({experience}). Let's start with your approach to scalable system architecture."
            </div>

            <div className="candidate-response-preview">
              <div className="response-tag">
                <Mic size={14} /> Live Candidate Speech Stream
              </div>
              <p style={{ fontStyle: "italic", fontSize: "0.9rem", color: "#e2e8f0" }}>
                "For high availability, I split workloads across microservices and use Kafka for event-driven message queuing..."
              </p>
            </div>

            <div className="realtime-metrics">
              <div className="metric-box">
                <div className="metric-val">96%</div>
                <div className="metric-lbl">Confidence</div>
              </div>
              <div className="metric-box">
                <div className="metric-val">142</div>
                <div className="metric-lbl">WPM Speed</div>
              </div>
              <div className="metric-box">
                <div className="metric-val">0</div>
                <div className="metric-lbl">Filler Words</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Simulator Section */}
      <section id="simulator" className="section-wrapper">
        <div className="section-header">
          <div className="section-subtitle">Interactive Demo</div>
          <h2 className="section-title">Test Drive the <span className="text-gradient">AI Simulator</span></h2>
          <p className="section-desc">
            Try a live sample question below. Edit your response or switch interview tracks to see instant real-time AI grading in action.
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
                  {activeModeData.difficulty} Difficulty
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
                  <RefreshCw size={16} className={isEvaluating ? "spin" : ""} /> Re-Evaluate Answer
                </button>
                <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                  {isEvaluating ? "Analyzing speech metrics & logic..." : "Press button to calculate live score"}
                </span>
              </div>
            </div>

            <div className="sim-feedback-pane">
              <div className="feedback-header">
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 700 }}>AI Evaluation Report</h4>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Calculated in 0.12 seconds</p>
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
                    <span style={{ color: "#00f2fe" }}>{activeModeData.scores.comm}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${activeModeData.scores.comm}%`, background: "linear-gradient(90deg, #00f2fe, #4facfe)" }}
                    ></div>
                  </div>
                </div>

                <div className="score-bar-item">
                  <div className="bar-label-row">
                    <span>Technical Depth</span>
                    <span style={{ color: "#a855f7" }}>{activeModeData.scores.depth}%</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${activeModeData.scores.depth}%`, background: "linear-gradient(90deg, #a855f7, #ec4899)" }}
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
                  KEY AI HIGHLIGHTS
                </h5>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {activeModeData.feedback.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "#e2e8f0" }}>
                      <CheckCircle2 size={16} color="#10b981" /> {item}
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
          <h2 className="section-title">Engineered for <span className="text-gradient">Peak Interview Performance</span></h2>
          <p className="section-desc">
            Everything you need to master tough interviews, overcome stage fright, and stand out to top recruiters.
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

      {/* How it Works / Workflow Steps */}
      <section id="how-it-works" className="section-wrapper">
        <div className="section-header">
          <div className="section-subtitle">Simple 4-Step Process</div>
          <h2 className="section-title">How <span className="text-gradient">Mockify</span> Powers Your Preparation</h2>
          <p className="section-desc">
            From role customization to post-interview action plans in under 15 minutes.
          </p>
        </div>

        <div className="workflow-steps">
          <div className="glass-panel step-card">
            <div className="step-number">01</div>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Set Target Role & Level</h4>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Input your desired position (e.g., Software Engineer) and experience tier.
            </p>
          </div>

          <div className="glass-panel step-card">
            <div className="step-number">02</div>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 700 }}>AI Audio Session Launch</h4>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Speak directly with our realistic conversational AI avatar in audio or video mode.
            </p>
          </div>

          <div className="glass-panel step-card">
            <div className="step-number">03</div>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Real-time Deep Analytics</h4>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Receive instant breakdown of speech pace, coding complexity, and answer completeness.
            </p>
          </div>

          <div className="glass-panel step-card">
            <div className="step-number">04</div>
            <h4 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Targeted Improvement Plan</h4>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Get ideal answer blueprints and continuous practice drills to guarantee success.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-wrapper">
        <div className="section-header">
          <div className="section-subtitle">Success Stories</div>
          <h2 className="section-title">Loved by Candidates at <span className="text-gradient">Top Tech Companies</span></h2>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((test, idx) => (
            <motion.div
              key={idx}
              className="glass-panel testimonial-card"
              whileHover={{ y: -6 }}
            >
              <div style={{ display: "flex", gap: "4px", color: "#fbbf24" }}>
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
          <div className="section-subtitle">Flexible Pricing</div>
          <h2 className="section-title">Invest in Your <span className="text-gradient">Career Growth</span></h2>
          <p className="section-desc">
            Choose the plan that fits your job search timeline. Cancel or pause anytime.
          </p>
        </div>

        <div className="pricing-toggle-wrapper">
          <span style={{ fontWeight: isAnnual ? 500 : 700, color: isAnnual ? "#94a3b8" : "#ffffff" }}>Monthly</span>
          <div className={`toggle-switch ${isAnnual ? "active" : ""}`} onClick={() => setIsAnnual(!isAnnual)}>
            <div className="switch-knob"></div>
          </div>
          <span style={{ fontWeight: isAnnual ? 700 : 500, color: isAnnual ? "#ffffff" : "#94a3b8" }}>
            Annual <span style={{ color: "#00f2fe", fontSize: "0.8rem", marginLeft: "4px" }}>(Save 30%)</span>
          </span>
        </div>

        <div className="pricing-grid">
          {/* Starter Plan */}
          <div className="glass-panel price-card">
            <div>
              <div className="price-header">
                <h3>Starter</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Ideal for quick practice sessions</p>
              </div>
              <div className="price-amount">
                {isAnnual ? "$19" : "$29"} <span>/ month</span>
              </div>
              <ul className="price-features">
                <li><Check size={16} /> 5 AI Mock Interviews / mo</li>
                <li><Check size={16} /> Standard Voice & Text Feedback</li>
                <li><Check size={16} /> Technical & Behavioral Modes</li>
                <li><Check size={16} /> basic Score Matrix</li>
              </ul>
            </div>
            <button className="btn-secondary" style={{ width: "100%" }} onClick={handleStartInterview}>
              Get Started
            </button>
          </div>

          {/* Pro Plan (Popular) */}
          <div className="glass-panel price-card popular">
            <div className="popular-ribbon">Most Popular</div>
            <div>
              <div className="price-header">
                <h3>Pro AI Candidate</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Unlimited practice for active job seekers</p>
              </div>
              <div className="price-amount">
                {isAnnual ? "$39" : "$49"} <span>/ month</span>
              </div>
              <ul className="price-features">
                <li><Check size={16} /> Unlimited AI Mock Interviews</li>
                <li><Check size={16} /> Real-time Audio & Video Avatar</li>
                <li><Check size={16} /> Live Code Sandbox & Complexity Check</li>
                <li><Check size={16} /> FAANG Company Question Banks</li>
                <li><Check size={16} /> Sub-second Feedback Reports</li>
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
                <h3>Bootcamp & Teams</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>For universities, bootcamps & teams</p>
              </div>
              <div className="price-amount">
                {isAnnual ? "$99" : "$129"} <span>/ month</span>
              </div>
              <ul className="price-features">
                <li><Check size={16} /> Everything in Pro Plan</li>
                <li><Check size={16} /> Cohort Performance Dashboard</li>
                <li><Check size={16} /> Custom Interview Rubric Builder</li>
                <li><Check size={16} /> Dedicated Account Manager</li>
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
          <h2>Ready to Ace Your Next <br /><span className="text-gradient">Dream Job Interview?</span></h2>
          <p style={{ maxWidth: "600px", color: "#94a3b8", fontSize: "1.1rem" }}>
            Join thousands of software engineers, product managers, and architects who passed their interviews with Mockify.
          </p>
          <button className="btn-primary" style={{ padding: "16px 36px", fontSize: "1.1rem" }} onClick={handleStartInterview}>
            <Sparkles size={20} /> Launch Your AI Interview Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-icon-box" style={{ width: 32, height: 32 }}>
              <Sparkles size={16} color="#040817" />
            </div>
            <span className="text-gradient">Mockify</span>
          </div>

          <div className="footer-copy">
            © {new Date().getFullYear()} Mockify AI Inc. All rights reserved. Practice powered by verified benchmark models.
          </div>

          <div style={{ display: "flex", gap: "20px", color: "#94a3b8", fontSize: "0.85rem" }}>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</a>
            <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Contact Support</a>
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
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
            >
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>

              <div style={{ textAlign: "center" }}>
                <div className="brand-icon-box" style={{ margin: "0 auto 16px auto", width: 50, height: 50 }}>
                  <Bot size={28} color="#040817" />
                </div>

                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", fontWeight: 800, marginBottom: "8px" }}>
                  Preparing AI Interview Room
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "24px" }}>
                  Setting up tailored question matrix for <strong>{jobRole}</strong> ({experience})
                </p>

                {modalStep === 1 && (
                  <div style={{ padding: "30px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                    <RefreshCw size={36} className="spin" color="#00f2fe" />
                    <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>Initializing Audio Neural Engine & Speech Analysis...</p>
                  </div>
                )}

                {modalStep === 2 && (
                  <div style={{ padding: "30px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                    <Video size={36} color="#a855f7" />
                    <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>Testing Microphone & Anti-Hallucination Guardrails...</p>
                  </div>
                )}

                {modalStep === 3 && (
                  <div style={{ padding: "20px 0" }}>
                    <div style={{ display: "inline-flex", padding: "12px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.2)", color: "#10b981", marginBottom: "16px" }}>
                      <CheckCircle2 size={36} />
                    </div>
                    <h4 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>Interview Environment Ready!</h4>
                    <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "24px" }}>
                      Your AI Senior Evaluator is waiting in the private session chamber.
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