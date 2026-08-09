import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Terminal,
  Mic,
  Brain,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
  RotateCcw,
  Volume2,
  Award,
  ChevronRight,
  Cpu,
  FileText,
  Sliders,
  Send,
  Zap,
  Star,
  Layers,
  ArrowLeft,
  X,
  RefreshCw,
  Video
} from "lucide-react";

// Mock Coding Problems
const MOCK_CODING_PROBLEMS = [
  {
    id: "two-sum",
    title: "Two Sum Target Indices",
    difficulty: "Easy",
    category: "Arrays & Hash Maps",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    initialCode: {
      javascript: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}",
      python: "def twoSum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []",
      java: "public int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int diff = target - nums[i];\n        if (map.containsKey(diff)) {\n            return new int[] { map.get(diff), i };\n        }\n        map.put(nums[i], i);\n    }\n    return new int[]{};\n}"
    },
    testCases: [
      { input: "nums = [2, 7, 11, 15], target = 9", expected: "[0, 1]", passed: true },
      { input: "nums = [3, 2, 4], target = 6", expected: "[1, 2]", passed: true }
    ]
  },
  {
    id: "valid-anagram",
    title: "Valid Anagram String",
    difficulty: "Easy",
    category: "Strings",
    description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
    initialCode: {
      javascript: "function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = {};\n  for (let char of s) count[char] = (count[char] || 0) + 1;\n  for (let char of t) {\n    if (!count[char]) return false;\n    count[char]--;\n  }\n  return true;\n}",
      python: "def isAnagram(s: str, t: str) -> bool:\n    return sorted(s) == sorted(t)",
      java: "public boolean isAnagram(String s, String t) {\n    if (s.length() != t.length()) return false;\n    int[] counts = new int[26];\n    for (char c : s.toCharArray()) counts[c - 'a']++;\n    for (char c : t.toCharArray()) {\n        if (--counts[c - 'a'] < 0) return false;\n    }\n    return true;\n}"
    },
    testCases: [
      { input: "s = \"anagram\", t = \"nagaram\"", expected: "true", passed: true },
      { input: "s = \"rat\", t = \"car\"", expected: "false", passed: true }
    ]
  }
];

// Technical Round Questions
const TECHNICAL_QUESTIONS = [
  {
    id: 1,
    question: "Explain the event loop in JavaScript and how asynchronous I/O operations are handled in Node.js.",
    difficulty: "Medium",
    sampleAnswer: "The event loop manages execution of synchronous scripts, microtasks (Promises), and macrotasks (setTimeout, I/O) using a single thread backed by libuv thread pool."
  },
  {
    id: 2,
    question: "How do React 19 Server Components eliminate client bundle size while supporting hydration?",
    difficulty: "Hard",
    sampleAnswer: "Server Components render exclusively on the server, sending pre-rendered HTML and light JSON payloads without bundling dependencies on the client."
  },
  {
    id: 3,
    question: "What is the difference between SQL database sharding and vertical partitioning?",
    difficulty: "Medium",
    sampleAnswer: "Sharding distributes rows horizontally across nodes via shard keys, while vertical partitioning splits tables by columns into isolated storage engines."
  }
];

// Behavioural Questions
const BEHAVIOURAL_QUESTIONS = [
  "Tell me about yourself and your journey in software architecture.",
  "Tell me about a time you solved a complex, production-critical problem under high pressure.",
  "Describe a significant architectural conflict you had with a teammate and how you reached consensus.",
  "Tell me about a project failure or outage you experienced and what key engineering lessons you learned.",
  "Why should our team hire you for this senior engineering position?"
];

export default function InterviewModules({ onBack, onOpenChamber }) {
  // Active Module View state ("dashboard" | "technical" | "coding" | "virtual" | "behavioural" | "feedback")
  const [activeModule, setActiveModule] = useState("dashboard");

  // Module Progress State (Persisted in localStorage)
  const [moduleProgress, setModuleProgress] = useState(() => {
    const saved = localStorage.getItem("mockify_module_progress");
    return saved
      ? JSON.parse(saved)
      : {
          technical: { completed: true, score: 86, total: 3 },
          coding: { completed: true, score: 92, total: 2 },
          virtual: { completed: false, score: 78, total: 5 },
          behavioural: { completed: true, score: 88, total: 5 },
          feedback: { ready: true }
        };
  });

  useEffect(() => {
    localStorage.setItem("mockify_module_progress", JSON.stringify(moduleProgress));
  }, [moduleProgress]);

  // Technical Round State
  const [techQuestionIdx, setTechQuestionIdx] = useState(0);
  const [techUserAnswer, setTechUserAnswer] = useState("");
  const [techSubmitted, setTechSubmitted] = useState(false);
  const [techScore, setTechScore] = useState(null);

  // Coding Challenge State
  const [selectedProblemIdx, setSelectedProblemIdx] = useState(0);
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [userCode, setUserCode] = useState(
    MOCK_CODING_PROBLEMS[0].initialCode.javascript
  );
  const [codeOutput, setCodeOutput] = useState(null);
  const [isRunningCode, setIsRunningCode] = useState(false);

  // Virtual Interview State
  const [virtQuestionIdx, setVirtQuestionIdx] = useState(0);
  const [virtUserAnswer, setVirtUserAnswer] = useState("");
  const [isRecordingVirt, setIsRecordingVirt] = useState(false);
  const [virtSubmitted, setVirtSubmitted] = useState(false);

  // Behavioural Interview State
  const [behavQuestionIdx, setBehavQuestionIdx] = useState(0);
  const [behavUserAnswer, setBehavUserAnswer] = useState("");
  const [isRecordingBehav, setIsRecordingBehav] = useState(false);
  const [behavSubmitted, setBehavSubmitted] = useState(false);

  // Handle Code Language Change
  const handleLangChange = (lang) => {
    setCodeLanguage(lang);
    setUserCode(MOCK_CODING_PROBLEMS[selectedProblemIdx].initialCode[lang] || "");
  };

  // Handle Run Code Execution
  const handleRunCode = () => {
    setIsRunningCode(true);
    setTimeout(() => {
      setIsRunningCode(false);
      setCodeOutput({
        status: "Success",
        passed: 2,
        total: 2,
        runtime: "42ms",
        memory: "14.2 MB",
        message: "All test cases passed cleanly! Time complexity: O(N), Space: O(N)."
      });
    }, 1000);
  };

  // Handle Submit Technical Answer
  const handleSubmitTech = (e) => {
    e.preventDefault();
    setTechSubmitted(true);
    setTechScore(88);
    setModuleProgress((prev) => ({
      ...prev,
      technical: { ...prev.technical, completed: true, score: 88 }
    }));
  };

  // Handle Next Technical Question
  const handleNextTech = () => {
    if (techQuestionIdx < TECHNICAL_QUESTIONS.length - 1) {
      setTechQuestionIdx(techQuestionIdx + 1);
      setTechUserAnswer("");
      setTechSubmitted(false);
    } else {
      setActiveModule("feedback");
    }
  };

  // Module Cards Config
  const MODULE_CARDS = [
    {
      id: "technical",
      icon: Code,
      title: "Technical Round",
      desc: "Test your technical knowledge and deep conceptual understanding related to your target engineering role.",
      difficulty: "Medium / Hard",
      status: moduleProgress.technical.completed ? "Completed (86%)" : "Ready",
      actionText: "Start Technical Round →",
      colorClass: "gold"
    },
    {
      id: "coding",
      icon: Terminal,
      title: "Coding Challenge",
      desc: "Solve real-world programming problems and demonstrate your algorithmic optimization and problem-solving skills.",
      difficulty: "Easy / Hard",
      status: moduleProgress.coding.completed ? "Completed (92%)" : "In Progress",
      actionText: "Start Coding →",
      colorClass: "emerald"
    },
    {
      id: "virtual",
      icon: Mic,
      title: "Virtual Interview",
      desc: "Experience a realistic AI-powered interview with questions tailored dynamically to your selected job role.",
      difficulty: "Adaptive",
      status: moduleProgress.virtual.completed ? "Completed (78%)" : "In Progress",
      actionText: "Start Virtual Interview →",
      colorClass: "purple"
    },
    {
      id: "behavioural",
      icon: Brain,
      title: "Behavioural Interview",
      desc: "Practice common STAR method questions to level up your communication, structural leadership, and confidence.",
      difficulty: "Medium",
      status: moduleProgress.behavioural.completed ? "Completed (88%)" : "Ready",
      actionText: "Start Behavioural Round →",
      colorClass: "blue"
    },
    {
      id: "feedback",
      icon: BarChart3,
      title: "Interview Feedback",
      desc: "Review your comprehensive performance report and receive personalized AI insights to master your onsite.",
      difficulty: "Analytics",
      status: "Report Ready",
      actionText: "View Full Feedback →",
      colorClass: "gold"
    }
  ];

  return (
    <motion.div
      className="modules-page-wrapper"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top Header & Breadcrumb */}
      <div className="modules-top-nav">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div className="modules-page-tag">
          <Layers size={16} color="#d4af37" />
          <span>Interactive Preparation Modules</span>
        </div>
      </div>

      {/* DASHBOARD VIEW */}
      {activeModule === "dashboard" && (
        <>
          {/* READINESS PROGRESS HEADER WITH SVG RING */}
          <div className="glass-panel readiness-banner-card">
            <div className="readiness-left">
              <div className="svg-ring-wrapper">
                <svg className="progress-ring-svg" viewBox="0 0 120 120">
                  <circle
                    className="ring-bg"
                    cx="60"
                    cy="60"
                    r="50"
                  />
                  <circle
                    className="ring-fill"
                    cx="60"
                    cy="60"
                    r="50"
                    style={{ strokeDashoffset: 314 - (314 * 0.78) }}
                  />
                </svg>
                <div className="ring-center-text">
                  <span className="ring-perc text-gradient-gold">78%</span>
                  <span className="ring-sub">Readiness</span>
                </div>
              </div>

              <div className="readiness-title-group">
                <div className="readiness-badge">
                  <Award size={15} /> FAANG Benchmark Status
                </div>
                <h2>Your Interview Readiness</h2>
                <p>
                  Based on your completed mock sessions, technical precision, and speech confidence.
                </p>
              </div>
            </div>

            {/* Skill Breakdown Bars */}
            <div className="readiness-bars-column">
              <div className="readiness-bar-item">
                <div className="rbar-meta">
                  <span>Technical</span>
                  <span className="gold-text">80%</span>
                </div>
                <div className="rbar-track">
                  <div className="rbar-fill gold" style={{ width: "80%" }}></div>
                </div>
              </div>

              <div className="readiness-bar-item">
                <div className="rbar-meta">
                  <span>Coding</span>
                  <span className="emerald-text">60%</span>
                </div>
                <div className="rbar-track">
                  <div className="rbar-fill emerald" style={{ width: "60%" }}></div>
                </div>
              </div>

              <div className="readiness-bar-item">
                <div className="rbar-meta">
                  <span>Behavioural</span>
                  <span className="purple-text">80%</span>
                </div>
                <div className="rbar-track">
                  <div className="rbar-fill purple" style={{ width: "80%" }}></div>
                </div>
              </div>

              <div className="readiness-bar-item">
                <div className="rbar-meta">
                  <span>Communication</span>
                  <span className="blue-text">70%</span>
                </div>
                <div className="rbar-track">
                  <div className="rbar-fill blue" style={{ width: "70%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* DASHBOARD HEADER TITLE */}
          <div className="section-header" style={{ marginBottom: "28px" }}>
            <div className="section-subtitle">INTERVIEW MODULES</div>
            <h2 className="section-title">
              Choose How You Want to <span className="text-gradient-gold">Prepare Today</span>
            </h2>
            <p className="section-desc">
              Select a specialized module below to practice technical depth, coding challenges, behavioral STAR responses, or review full analytics.
            </p>
          </div>

          {/* MODULE CARDS GRID (2 Columns Desktop/Tablet, 1 Column Mobile) */}
          <div className="modules-cards-grid">
            {MODULE_CARDS.map((card) => {
              const IconComp = card.icon;
              return (
                <motion.div
                  key={card.id}
                  className={`glass-panel module-card ${card.colorClass}`}
                  whileHover={{ y: -6, borderColor: "rgba(212, 175, 55, 0.4)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="module-card-top">
                    <div className={`module-icon-box ${card.colorClass}`}>
                      <IconComp size={26} />
                    </div>
                    <span className="module-status-pill">{card.status}</span>
                  </div>

                  <h3>{card.title}</h3>
                  <p className="module-desc">{card.desc}</p>

                  <div className="module-card-footer">
                    <span className="module-diff-pill">Difficulty: {card.difficulty}</span>
                    <button
                      className="btn-primary module-action-btn"
                      onClick={() => setActiveModule(card.id)}
                    >
                      {card.actionText}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* MODULE 1: TECHNICAL ROUND */}
      {activeModule === "technical" && (
        <motion.div
          className="glass-panel module-workspace-card"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="workspace-header">
            <button className="back-btn sm" onClick={() => setActiveModule("dashboard")}>
              <ArrowLeft size={16} /> All Modules
            </button>
            <div className="workspace-title-badge">
              <Code size={18} color="#d4af37" /> Technical Round
            </div>
            <span className="q-counter">
              Question {techQuestionIdx + 1} of {TECHNICAL_QUESTIONS.length}
            </span>
          </div>

          <div className="question-display-box">
            <span className="difficulty-tag">
              {TECHNICAL_QUESTIONS[techQuestionIdx].difficulty}
            </span>
            <h3>{TECHNICAL_QUESTIONS[techQuestionIdx].question}</h3>
          </div>

          {!techSubmitted ? (
            <form onSubmit={handleSubmitTech} className="answer-form">
              <label>Your Technical Explanation:</label>
              <textarea
                value={techUserAnswer}
                onChange={(e) => setTechUserAnswer(e.target.value)}
                placeholder="Type your structured technical breakdown here (e.g. explain architecture, memory usage, algorithm step-by-step)..."
                required
              />
              <div className="form-actions-bar">
                <button type="submit" className="btn-primary">
                  Submit Technical Explanation <Send size={16} />
                </button>
              </div>
            </form>
          ) : (
            <div className="submitted-feedback-box">
              <div className="eval-score-header">
                <Award size={24} color="#d4af37" />
                <div>
                  <h4>Technical Evaluation Score: <span className="text-gradient-gold">{techScore}%</span></h4>
                  <p>AI Evaluator: Excellent structural accuracy and precise terminology.</p>
                </div>
              </div>

              <div className="sample-comparison">
                <h5>Optimal Reference Breakdown:</h5>
                <p>{TECHNICAL_QUESTIONS[techQuestionIdx].sampleAnswer}</p>
              </div>

              <button className="btn-primary" onClick={handleNextTech} style={{ marginTop: "16px" }}>
                {techQuestionIdx < TECHNICAL_QUESTIONS.length - 1 ? "Next Technical Question →" : "View Feedback Report →"}
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* MODULE 2: CODING CHALLENGE */}
      {activeModule === "coding" && (
        <motion.div
          className="glass-panel module-workspace-card coding-workspace"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="workspace-header">
            <button className="back-btn sm" onClick={() => setActiveModule("dashboard")}>
              <ArrowLeft size={16} /> All Modules
            </button>
            <div className="workspace-title-badge">
              <Terminal size={18} color="#10b981" /> Live Coding Challenge Sandbox
            </div>
            <div className="problem-selector-dropdown">
              <select
                value={selectedProblemIdx}
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  setSelectedProblemIdx(idx);
                  setUserCode(MOCK_CODING_PROBLEMS[idx].initialCode[codeLanguage]);
                  setCodeOutput(null);
                }}
              >
                {MOCK_CODING_PROBLEMS.map((prob, i) => (
                  <option key={prob.id} value={i}>
                    {prob.title} ({prob.difficulty})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="coding-layout-grid">
            {/* Left Problem Spec Panel */}
            <div className="problem-spec-panel">
              <span className="diff-tag-green">
                {MOCK_CODING_PROBLEMS[selectedProblemIdx].difficulty}
              </span>
              <h3>{MOCK_CODING_PROBLEMS[selectedProblemIdx].title}</h3>
              <p className="prob-desc">
                {MOCK_CODING_PROBLEMS[selectedProblemIdx].description}
              </p>

              <div className="test-cases-preview">
                <h5>Sample Test Cases</h5>
                {MOCK_CODING_PROBLEMS[selectedProblemIdx].testCases.map((tc, idx) => (
                  <div key={idx} className="tc-box">
                    <div><strong>Input:</strong> {tc.input}</div>
                    <div><strong>Expected:</strong> {tc.expected}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Editor & Controls Panel */}
            <div className="code-editor-panel">
              <div className="editor-controls-bar">
                <div className="lang-buttons-group">
                  {["javascript", "python", "java"].map((lang) => (
                    <button
                      key={lang}
                      className={`lang-btn ${codeLanguage === lang ? "active" : ""}`}
                      onClick={() => handleLangChange(lang)}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="editor-actions">
                  <button
                    className="btn-secondary sm"
                    onClick={handleRunCode}
                    disabled={isRunningCode}
                  >
                    {isRunningCode ? <RefreshCw size={14} className="spin" /> : <Play size={14} />} Run Code
                  </button>
                  <button
                    className="btn-primary sm"
                    onClick={handleRunCode}
                    disabled={isRunningCode}
                  >
                    <CheckCircle2 size={14} /> Submit Solution
                  </button>
                </div>
              </div>

              <textarea
                className="code-textarea"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                spellCheck="false"
              />

              {codeOutput && (
                <div className="code-output-console">
                  <div className="console-header">
                    <CheckCircle2 size={16} color="#34d399" /> {codeOutput.status} — {codeOutput.passed}/{codeOutput.total} Passed
                  </div>
                  <p>{codeOutput.message}</p>
                  <div className="console-meta">
                    <span>Runtime: {codeOutput.runtime}</span> • <span>Memory: {codeOutput.memory}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* MODULE 3: VIRTUAL INTERVIEW */}
      {activeModule === "virtual" && (
        <motion.div
          className="glass-panel module-workspace-card"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="workspace-header">
            <button className="back-btn sm" onClick={() => setActiveModule("dashboard")}>
              <ArrowLeft size={16} /> All Modules
            </button>
            <div className="workspace-title-badge">
              <Mic size={18} color="#c084fc" /> Virtual AI Interviewer
            </div>
            <span className="q-counter">
              Progress: {virtQuestionIdx + 1} / 5
            </span>
          </div>

          {/* AI Avatar Simulator Header */}
          <div className="ai-avatar-chamber-box">
            <div className="avatar-video-mock">
              <div className="ai-pulse-ring"></div>
              <Video size={48} color="#d4af37" />
              <div className="ai-status-label">AI Avatar Speaking...</div>
            </div>
            <div className="ai-question-bubble">
              <h4>Senior Architect Interview Round</h4>
              <p>
                "How do you design a zero-downtime database migration strategy for high-throughput microservices?"
              </p>
            </div>
          </div>

          <div className="virt-answer-section">
            <div className="virt-input-tabs">
              <label>Your Response (Voice / Text):</label>
              <button
                type="button"
                className={`mic-toggle-btn ${isRecordingVirt ? "recording" : ""}`}
                onClick={() => setIsRecordingVirt(!isRecordingVirt)}
              >
                <Mic size={16} /> {isRecordingVirt ? "Listening (Recording...)" : "Click to Speak"}
              </button>
            </div>

            <textarea
              value={virtUserAnswer}
              onChange={(e) => setVirtUserAnswer(e.target.value)}
              placeholder="Or type your response here..."
            />

            <div className="form-actions-bar">
              <button
                className="btn-secondary"
                onClick={() => setVirtQuestionIdx((prev) => (prev + 1) % 5)}
              >
                Next Question →
              </button>
              <button
                className="btn-primary"
                onClick={() => setActiveModule("feedback")}
              >
                End & View Score Report
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* MODULE 4: BEHAVIOURAL INTERVIEW */}
      {activeModule === "behavioural" && (
        <motion.div
          className="glass-panel module-workspace-card"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="workspace-header">
            <button className="back-btn sm" onClick={() => setActiveModule("dashboard")}>
              <ArrowLeft size={16} /> All Modules
            </button>
            <div className="workspace-title-badge">
              <Brain size={18} color="#60a5fa" /> Behavioural STAR Round
            </div>
            <span className="q-counter">
              Question {behavQuestionIdx + 1} of {BEHAVIOURAL_QUESTIONS.length}
            </span>
          </div>

          <div className="question-display-box">
            <span className="difficulty-tag blue">STAR Method Focus</span>
            <h3>"{BEHAVIOURAL_QUESTIONS[behavQuestionIdx]}"</h3>
          </div>

          <div className="star-method-hint">
            <Sparkles size={16} color="#d4af37" />
            <span>Structure your response: <strong>Situation</strong> → <strong>Task</strong> → <strong>Action</strong> → <strong>Result</strong>.</span>
          </div>

          <div className="virt-answer-section">
            <div className="virt-input-tabs">
              <label>Your Story / Explanation:</label>
              <button
                type="button"
                className={`mic-toggle-btn ${isRecordingBehav ? "recording" : ""}`}
                onClick={() => setIsRecordingBehav(!isRecordingBehav)}
              >
                <Mic size={16} /> {isRecordingBehav ? "Recording Audio..." : "Record Speech"}
              </button>
            </div>

            <textarea
              value={behavUserAnswer}
              onChange={(e) => setBehavUserAnswer(e.target.value)}
              placeholder="Describe the situation, your specific role, actions taken, and quantitative metrics/outcomes achieved..."
            />

            <div className="form-actions-bar">
              <button
                className="btn-primary"
                onClick={() => {
                  if (behavQuestionIdx < BEHAVIOURAL_QUESTIONS.length - 1) {
                    setBehavQuestionIdx(behavQuestionIdx + 1);
                    setBehavUserAnswer("");
                  } else {
                    setActiveModule("feedback");
                  }
                }}
              >
                {behavQuestionIdx < BEHAVIOURAL_QUESTIONS.length - 1 ? "Next Behavioural Question →" : "Finish & View Analytics →"}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* MODULE 5: FEEDBACK & ANALYTICS */}
      {activeModule === "feedback" && (
        <motion.div
          className="glass-panel module-workspace-card"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="workspace-header">
            <button className="back-btn sm" onClick={() => setActiveModule("dashboard")}>
              <ArrowLeft size={16} /> All Modules
            </button>
            <div className="workspace-title-badge">
              <BarChart3 size={18} color="#d4af37" /> AI Comprehensive Feedback Report
            </div>
          </div>

          {/* Feedback Main Summary Grid */}
          <div className="feedback-summary-grid">
            <div className="glass-panel main-score-box">
              <div className="score-circle-lg text-gradient-gold">86%</div>
              <h4>Overall Readiness Score</h4>
              <p>Performance meets top 10% candidate benchmark for Senior Architecture roles.</p>
            </div>

            <div className="subscores-column">
              <div className="subscore-item">
                <span>Technical Precision</span>
                <span className="val gold">88%</span>
              </div>
              <div className="subscore-item">
                <span>Communication & STAR Method</span>
                <span className="val emerald">84%</span>
              </div>
              <div className="subscore-item">
                <span>Tone Confidence & Delivery</span>
                <span className="val purple">90%</span>
              </div>
              <div className="subscore-item">
                <span>Problem Solving & Code Quality</span>
                <span className="val blue">86%</span>
              </div>
            </div>
          </div>

          {/* Strengths & Areas for Improvement */}
          <div className="feedback-insights-grid">
            <div className="glass-panel insight-box green">
              <h4><CheckCircle2 size={18} color="#34d399" /> Key Strengths</h4>
              <ul>
                <li>Flawless architectural breakdown of event loops and concurrent rendering.</li>
                <li>Data-driven STAR method execution for conflict resolution questions.</li>
                <li>Optimal space/time complexity intuition on coding challenges.</li>
              </ul>
            </div>

            <div className="glass-panel insight-box gold">
              <h4><Sparkles size={18} color="#d4af37" /> AI Suggested Improvements</h4>
              <ul>
                <li>Reduce filler word frequency ("um", "like") during initial question parsing.</li>
                <li>State space complexity trade-offs upfront before coding implementation.</li>
                <li>Elaborate more on database shard key selection in system design.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
