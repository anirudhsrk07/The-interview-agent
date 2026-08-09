/**
 * AI Service for Mockify AI Assistant
 * Provides contextual responses, performance analysis, and mini mock interview simulation.
 * Structured for easy future connection to a backend API (Gemini / OpenAI).
 */

export async function sendMessageToAI(userMessage, context = {}) {
  // Simulate network delay for natural AI typing experience
  await new Promise((resolve) => setTimeout(resolve, 800));

  const text = userMessage.toLowerCase().trim();
  const role = context.jobRole || "Software Engineer";
  const exp = context.experience || "Fresher";
  const diff = context.difficulty || "Medium";

  // 1. PRACTICE WITH AI MINI MOCK INTERVIEW MODE
  if (context.isPracticeMode) {
    return handleMiniMockAnswer(userMessage, role, context.practiceStep || 0);
  }

  // 2. ANALYZE PERFORMANCE
  if (
    text.includes("analyze my performance") ||
    text.includes("analyze my interview performance") ||
    text.includes("performance") ||
    text.includes("my score")
  ) {
    const techScore = context.stats?.technical || 88;
    const commScore = context.stats?.communication || 71;
    const readiness = context.stats?.readiness || 82;

    return {
      text: `📊 **Mockify Performance Analysis**\n\n- **Current Interview Readiness:** ${readiness}%\n- **Strongest Domain:** Technical Skills (${techScore}%)\n- **Primary Opportunity Area:** Communication & Structure (${commScore}%)\n\n🎯 **AI Recommendation for ${role} (${exp}):**\nComplete **2 Behavioural STAR Interviews** this week to boost storytelling confidence and reduce hesitation.`,
      quickActions: ["🧠 Practice behavioural questions", "💻 Practice technical questions", "🎯 Practice with AI"]
    };
  }

  // 3. PREPARE FOR INTERVIEW
  if (text.includes("prepare") || text.includes("preparation") || text.includes("how should i prepare")) {
    return {
      text: `🎯 **Structured Interview Plan for ${role} (${exp} Level):**\n\n1. **Technical Foundation:** Master core domain concepts for ${role} at ${diff} difficulty.\n2. **Data Structures & Algorithms:** Focus on Arrays, Hash Maps, Trees, and System Architecture.\n3. **STAR Behavioural Method:** Frame 3-4 key projects highlighting Situation, Task, Action, and Quantitative Results.\n4. **Mock Practice:** Complete at least 2 full sessions in our Virtual AI Chamber.`,
      quickActions: ["💻 Practice technical questions", "🧠 Practice behavioural questions", "📊 Analyze my performance"]
    };
  }

  // 4. JAVASCRIPT / TECHNICAL QUESTIONS
  if (text.includes("javascript") || text.includes("technical question") || text.includes("coding question")) {
    return {
      text: `💻 **${role} Technical Question (${diff} Difficulty):**\n\n*"Explain the difference between microtasks (Promises, process.nextTick) and macrotasks (setTimeout, setInterval) in the JavaScript Event Loop, and how they affect execution order."*\n\nTry answering right here, or click **"Practice with AI"** to start an interactive practice round!`,
      quickActions: ["🎯 Practice with AI", "📄 Improve my resume"]
    };
  }

  // 5. BEHAVIOURAL INTERVIEW
  if (text.includes("behavioural") || text.includes("behavioral") || text.includes("star method")) {
    return {
      text: `🧠 **Key Behavioural Strategy for ${role}:**\n\nAlways structure answers using the **STAR** framework:\n- **S**ituation: Set the context (company/project background)\n- **T**ask: Your specific responsibility\n- **A**ction: The precise engineering decisions you made\n- **R**esult: Measurable impact (e.g. *"reduced latency by 35%"*)\n\nCommon question: *"Tell me about a time you had a technical disagreement with a teammate."*`,
      quickActions: ["🎯 Practice with AI", "🧠 Practice behavioural questions"]
    };
  }

  // 6. RESUME IMPROVEMENT
  if (text.includes("resume") || text.includes("cv") || text.includes("improve my resume")) {
    return {
      text: `📄 **Resume Enhancement Tips for ${role}:**\n\n1. **Action Verbs + Metrics:** Use patterns like *"Optimized SQL query indexing, reducing p99 latency from 450ms to 60ms for 200k daily users."*\n2. **Tech Stack Relevance:** List ${role} keywords prominently (${context.skills?.slice(0, 5).join(", ") || "React, JavaScript, Python, Node.js"}).\n3. **Projects Section:** Include live GitHub repository links and deployment URLs.`,
      quickActions: ["🎯 Prepare for an interview", "📊 Analyze my performance"]
    };
  }

  // 7. COMMUNICATION & CONFIDENCE
  if (text.includes("communication") || text.includes("confidence") || text.includes("nervous")) {
    return {
      text: `🗣️ **Boosting Interview Speech & Confidence:**\n\n- **Pace Control:** Aim for 130-150 words per minute. Pause for 2 seconds before answering complex questions.\n- **Eliminate Fillers:** Replace "um" and "like" with a deliberate silent breath.\n- **Clarity First:** State your top-level conclusion before diving into implementation details.`,
      quickActions: ["🧠 Practice behavioural questions", "🎯 Practice with AI"]
    };
  }

  // DEFAULT / FALLBACK CONTEXTUAL RESPONSE
  return {
    text: `🤖 I'm here to help you excel in your **${role}** interview (${exp} level, ${diff} difficulty).\n\nYou can ask me specific technical questions, request speech & resume tips, analyze your scores, or start a **Practice with AI** mini interview!`,
    quickActions: [
      "🎯 Prepare for an interview",
      "💻 Practice technical questions",
      "🧠 Practice behavioural questions",
      "📊 Analyze my performance"
    ]
  };
}

/**
 * Handle Mini Mock Interview Mode Evaluation
 */
function handleMiniMockAnswer(userAnswer, role, step) {
  const mockQuestions = [
    `Tell me about a challenging technical project you led as a ${role} and how you handled system architecture trade-offs.`,
    `How do you diagnose and fix a memory leak or sudden latency spike in production?`,
    `Describe a time you received critical feedback during code review and how you adapted.`
  ];

  if (step === 0) {
    return {
      isPractice: true,
      nextStep: 1,
      text: `🎯 **Mini Mock Interview Started!**\n\nI'll ask you one question at a time. Answer naturally in chat and I'll evaluate your response.\n\n**Question 1:**\n"${mockQuestions[0]}"`
    };
  }

  // Evaluate candidate's previous response
  const comm = Math.min(10, Math.max(6, Math.floor(userAnswer.length / 15) + 6));
  const tech = Math.min(10, Math.max(6, Math.floor(userAnswer.length / 20) + 6));
  const conf = 8;

  const feedbackText = `📊 **AI Feedback & Evaluation:**\n\n- **Communication:** ${comm}/10\n- **Technical Depth:** ${tech}/10\n- **Confidence:** ${conf}/10\n\n**Strengths:**\n✓ Clear explanation and structured approach.\n✓ Relevant technical terminology used.\n\n**Improvement Areas:**\n→ Include specific metrics or quantitative outcomes.\n→ Highlight trade-offs considered during architectural decisions.\n\n---\n\n**Question ${step + 1}:**\n"${mockQuestions[step % mockQuestions.length]}"`;

  return {
    isPractice: true,
    nextStep: step + 1,
    text: feedbackText
  };
}
