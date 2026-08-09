/**
 * Authentication Service for Mockify
 * Manages user login, signup, session persistence, and demo access.
 * Easily adaptable for Firebase, Supabase, Auth0, or custom backends.
 */

const AUTH_KEY = "mockify_auth_user";

// Default Demo User for Hackathon Judges
export const DEMO_USER = {
  id: "demo-user-101",
  name: "Anirudh Kulkarni",
  email: "anirudhkulkarni@example.com",
  role: "Software Engineer",
  experience: "Fresher",
  location: "San Francisco, CA",
  education: "B.S. Computer Science",
  joinedAt: "2026-08-01"
};

/**
 * Check if a user is currently authenticated
 */
export function isAuthenticated() {
  const user = getCurrentUser();
  return !!user;
}

/**
 * Get current authenticated user details from localStorage
 */
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
 * Login user with email & password
 */
export async function login(email, password) {
  // Simulate backend authentication API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (!email || !password) {
    throw new Error("Please enter both email and password.");
  }

  // Demo fallback or saved user check
  const existingUsers = JSON.parse(localStorage.getItem("mockify_registered_users") || "[]");
  const matchedUser = existingUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

  const user = matchedUser || {
    id: "user-" + Date.now(),
    name: email.split("@")[0].replace(".", " "),
    email: email.toLowerCase(),
    role: "Software Engineer",
    experience: "Fresher"
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

/**
 * Signup new user
 */
export async function signup(name, email, password, role = "Software Engineer", experience = "Fresher") {
  // Simulate backend signup API delay
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (!name || !email || !password) {
    throw new Error("Please fill in all required fields.");
  }

  const newUser = {
    id: "user-" + Date.now(),
    name,
    email: email.toLowerCase(),
    role,
    experience,
    joinedAt: new Date().toISOString().split("T")[0]
  };

  // Save to registered users list for local testing
  const existingUsers = JSON.parse(localStorage.getItem("mockify_registered_users") || "[]");
  existingUsers.push(newUser);
  localStorage.setItem("mockify_registered_users", JSON.stringify(existingUsers));

  // Auto login after signup
  localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
  return newUser;
}

/**
 * Instant Demo Account Login for Hackathon Judges
 */
export function loginDemoUser() {
  localStorage.setItem(AUTH_KEY, JSON.stringify(DEMO_USER));
  return DEMO_USER;
}

/**
 * Logout current user
 */
export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
