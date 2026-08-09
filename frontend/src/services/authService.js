/**
 * Authentication Service for Mockify
 * Connects frontend to Express Auth Endpoints on http://localhost:5001
 */

import { API_BASE_URL } from "./apiService";

const AUTH_KEY = "mockify_auth_user";
const TOKEN_KEY = "mockify_auth_token";

// Default Demo User for Hackathon Judges
export const DEMO_USER = {
  id: "demo-user-101",
  name: "Anirudh Kulkarni",
  email: "anirudhkulkarni@example.com",
  role: "Software Engineer",
  experience: "Fresher",
  location: "San Francisco, CA",
  education: "B.S. Computer Science",
  joinedAt: "2026-08-01",
};

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function isAuthenticated() {
  const user = getCurrentUser();
  return !!user;
}

export function getCurrentUser() {
  const data = localStorage.getItem(AUTH_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to parse auth user:", err);
    return null;
  }
}

/**
 * Login user via POST /api/auth/login
 */
export async function login(email, password) {
  if (!email || !password) {
    throw new Error("Please enter both email and password.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed. Please check credentials.");
    }

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    if (data.user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(data.user));
    }

    return data.user;
  } catch (err) {
    // If backend request fails due to network error, provide clear user feedback
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Cannot connect to authentication server. Is backend running at " + API_BASE_URL + "?");
    }
    throw err;
  }
}

/**
 * Signup user via POST /api/auth/signup
 */
export async function signup(name, email, password, role = "Software Engineer", experience = "Fresher") {
  if (!name || !email || !password) {
    throw new Error("Please fill in all required fields.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role, experience }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Signup failed. Please try again.");
    }

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    if (data.user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(data.user));
    }

    return data.user;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Cannot connect to authentication server. Is backend running at " + API_BASE_URL + "?");
    }
    throw err;
  }
}

/**
 * Fetch current user from GET /api/auth/me
 */
export async function fetchCurrentUser() {
  const token = getAuthToken();
  if (!token) return getCurrentUser();

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(data.user));
        return data.user;
      }
    }
  } catch (err) {
    console.warn("Could not fetch user from /api/auth/me:", err.message);
  }

  return getCurrentUser();
}

/**
 * Instant Demo Account Login for Hackathon Judges
 */
export function loginDemoUser() {
  localStorage.setItem(AUTH_KEY, JSON.stringify(DEMO_USER));
  localStorage.setItem(TOKEN_KEY, "demo_hackathon_token_2026");
  return DEMO_USER;
}

/**
 * Logout current user via POST /api/auth/logout
 */
export async function logout() {
  const token = getAuthToken();
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.warn("Logout endpoint error:", err.message);
    }
  }

  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
}
