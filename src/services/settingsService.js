/**
 * Settings Service for Mockify
 * Manages user preferences, theme options, interview configurations, and data export.
 */

const SETTINGS_KEY = "mockify_app_settings";

export const DEFAULT_SETTINGS = {
  theme: "dark",
  accentColor: "gold", // "gold" | "blue" | "purple" | "emerald"
  compactMode: false,
  animationsEnabled: true,
  defaultJobRole: "Software Engineer",
  experienceLevel: "Fresher",
  preferredDifficulty: "Medium",
  questionCount: 5,
  interviewTypes: {
    technical: true,
    behavioural: true,
    hr: false
  },
  defaultAnswerMode: "text",
  interviewTimer: true,
  autoAdvance: false,
  notifications: {
    emailNotifications: true,
    interviewReminders: true,
    dailyReminder: true,
    performanceUpdates: true,
    featureNotifications: false,
    weeklyReport: true,
    frequency: "daily"
  },
  aiAssistant: {
    personality: "Professional",
    responseStyle: "Balanced",
    feedbackOptions: {
      strengths: true,
      weaknesses: true,
      suggestions: true,
      scores: true
    },
    voiceResponses: false,
    voiceSpeed: 1.0
  },
  security: {
    twoFactor: false
  }
};

/**
 * Retrieve settings from localStorage merged with defaults
 */
export function getSettings() {
  const data = localStorage.getItem(SETTINGS_KEY);
  if (!data) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(data);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (err) {
    console.error("Failed to parse settings:", err);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (err) {
    console.error("Failed to save settings:", err);
    return false;
  }
}

/**
 * Update a specific setting key
 */
export function updateSetting(key, value) {
  const current = getSettings();
  const updated = { ...current, [key]: value };
  saveSettings(updated);
  return updated;
}

/**
 * Reset settings back to defaults
 */
export function resetSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  return DEFAULT_SETTINGS;
}

/**
 * Export user data as a JSON file download
 */
export function exportUserDataJSON() {
  const profile = localStorage.getItem("mockify_profile_info")
    ? JSON.parse(localStorage.getItem("mockify_profile_info"))
    : {};
  const history = localStorage.getItem("mockify_profile_history")
    ? JSON.parse(localStorage.getItem("mockify_profile_history"))
    : [];
  const settings = getSettings();

  const exportData = {
    appName: "Mockify AI",
    exportedAt: new Date().toISOString(),
    profile,
    settings,
    history
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mockify_user_data_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
