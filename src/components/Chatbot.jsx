import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Sparkles,
  Send,
  X,
  Minus,
  Trash2,
  Play,
  Award,
  MessageSquare,
  RefreshCw,
  Check,
  Zap
} from "lucide-react";
import { sendMessageToAI } from "../services/aiService";

const DEFAULT_WELCOME_MSG = {
  id: "welcome-1",
  sender: "ai",
  text: `Hi! 👋 I'm **Mockify AI**, your personal interview coach.\n\nI can help you prepare for interviews, improve your answers, practice technical questions, and analyze your performance.\n\nWhat would you like help with?`,
  quickActions: [
    "🎯 Prepare for an interview",
    "💻 Practice technical questions",
    "🧠 Practice behavioural questions",
    "📄 Improve my resume",
    "📊 Analyze my performance"
  ],
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
};

export default function Chatbot({ isOpen, onToggle, userContext = {} }) {
  // Chat Messages State (persisted in localStorage)
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("mockify_chat_history");
    return saved ? JSON.parse(saved) : [DEFAULT_WELCOME_MSG];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceStep, setPracticeStep] = useState(0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("mockify_chat_history", JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen, isTyping]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onToggle(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onToggle]);

  // Handle Sending Message
  const handleSend = async (customText = null) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput("");
    setIsTyping(true);

    try {
      // Build current user context from localStorage + props
      const contextData = {
        ...userContext,
        isPracticeMode,
        practiceStep,
        jobRole: localStorage.getItem("mockify_profile_info")
          ? JSON.parse(localStorage.getItem("mockify_profile_info")).preferredRole || "Software Engineer"
          : "Software Engineer",
        stats: {
          readiness: 82,
          technical: 88,
          communication: 71,
          confidence: 90
        }
      };

      const aiResponse = await sendMessageToAI(textToSend, contextData);

      if (aiResponse.isPractice) {
        setIsPracticeMode(true);
        setPracticeStep(aiResponse.nextStep);
      }

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponse.text,
        quickActions: aiResponse.quickActions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Response error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  // Trigger Mini Practice Mode
  const handleStartPracticeMode = () => {
    setIsPracticeMode(true);
    setPracticeStep(0);
    handleSend("Practice with AI");
  };

  // Clear Chat History
  const handleClearChat = () => {
    setMessages([DEFAULT_WELCOME_MSG]);
    setIsPracticeMode(false);
    setPracticeStep(0);
    localStorage.removeItem("mockify_chat_history");
    setShowClearConfirm(false);
  };

  return (
    <>
      {/* Floating Action Button (Bottom Right) */}
      <motion.button
        className={`floating-chatbot-btn ${isOpen ? "active" : ""}`}
        onClick={() => onToggle(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        title="Ask Mockify AI Assistant"
      >
        <div className="btn-glow-ring"></div>
        {isOpen ? <X size={22} color="#06070a" /> : <Bot size={24} color="#06070a" />}
        {!isOpen && <span className="chatbot-online-dot"></span>}
      </motion.button>

      {/* Floating Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window-card glass-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-left">
                <div className="chatbot-avatar-box">
                  <Bot size={20} color="#06070a" />
                </div>
                <div>
                  <h4>🤖 Mockify AI</h4>
                  <p>Your personal interview coach</p>
                </div>
              </div>

              <div className="chatbot-header-actions">
                <button
                  className="chat-action-btn practice-badge"
                  onClick={handleStartPracticeMode}
                  title="Start Mini Mock Practice"
                >
                  <Sparkles size={13} /> Practice
                </button>
                <button
                  className="chat-action-btn"
                  onClick={() => setShowClearConfirm(true)}
                  title="Clear Chat History"
                >
                  <Trash2 size={15} />
                </button>
                <button
                  className="chat-action-btn"
                  onClick={() => onToggle(false)}
                  title="Close Chatbot"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Clear Confirm Overlay */}
            {showClearConfirm && (
              <div className="clear-confirm-bar">
                <span>Clear entire chat history?</span>
                <button className="confirm-btn sm" onClick={handleClearChat}>
                  Yes, Clear
                </button>
                <button className="cancel-btn sm" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </button>
              </div>
            )}

            {/* Messages Area */}
            <div className="chatbot-messages-body">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}
                >
                  {msg.sender === "ai" && (
                    <div className="msg-avatar-icon">
                      <Bot size={14} color="#d4af37" />
                    </div>
                  )}

                  <div className="msg-bubble-container">
                    <div className="msg-bubble">
                      <div className="msg-text-content">
                        {msg.text.split("\n").map((line, idx) => {
                          // Simple bold formatting parser
                          const parts = line.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={idx} style={{ margin: "3px 0" }}>
                              {parts.map((part, pIdx) => {
                                if (part.startsWith("**") && part.endsWith("**")) {
                                  return (
                                    <strong key={pIdx} style={{ color: "#f3e5ab" }}>
                                      {part.slice(2, -2)}
                                    </strong>
                                  );
                                }
                                return part;
                              })}
                            </p>
                          );
                        })}
                      </div>
                      <span className="msg-timestamp">{msg.timestamp}</span>
                    </div>

                    {/* Quick Action Chips */}
                    {msg.quickActions && msg.quickActions.length > 0 && (
                      <div className="quick-chips-wrapper">
                        {msg.quickActions.map((action, aIdx) => (
                          <button
                            key={aIdx}
                            className="quick-chip-btn"
                            onClick={() => handleSend(action)}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="message-row ai-row">
                  <div className="msg-avatar-icon">
                    <Bot size={14} color="#d4af37" />
                  </div>
                  <div className="msg-bubble typing-bubble">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              className="chatbot-input-bar"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about interviews..."
              />
              <button
                type="submit"
                className="chatbot-send-btn"
                disabled={!input.trim() || isTyping}
                title="Send Message"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
