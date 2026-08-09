const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { findUserByEmail, findUserById, saveUser, updateUserProfile } = require("./usersStore");

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "mockify_secret_jwt_key_2026";

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend connected successfully",
  });
});

// Root Welcome Endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Mockify Backend is running 🚀",
    database: "SQLite (backend/data/mockify.db)",
  });
});

// Auth Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    req.userId = decoded.id;
    next();
  });
}

// 1. POST /api/auth/signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password, role, experience } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Full name is required." });
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    // Hash password securely with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: "usr_" + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: role || "Software Engineer",
      experience: experience || "Fresher",
      createdAt: new Date().toISOString(),
    };

    saveUser(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const userPayload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      experience: newUser.experience,
    };

    res.status(201).json({
      message: "Account created successfully 🎉",
      token,
      user: userPayload,
    });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT" || err.message?.includes("UNIQUE constraint failed")) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error creating account." });
  }
});

// 2. POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid login credentials. User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      experience: user.experience,
    };

    res.json({
      message: "Signed in successfully 👋",
      token,
      user: userPayload,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login." });
  }
});

// 3. POST /api/auth/logout
app.post("/api/auth/logout", (req, res) => {
  res.json({ message: "Signed out successfully." });
});

// 4. GET /api/auth/me
app.get("/api/auth/me", authenticateToken, (req, res) => {
  const user = findUserById(req.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const userPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    experience: user.experience,
  };

  res.json({ user: userPayload });
});

// 5. PUT /api/auth/profile
app.put("/api/auth/profile", authenticateToken, (req, res) => {
  try {
    const { name, role, experience } = req.body;
    const updatedUser = updateUserProfile(req.userId, { name, role, experience });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const userPayload = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      experience: updatedUser.experience,
    };

    res.json({ message: "Profile updated successfully.", user: userPayload });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Failed to update profile." });
  }
});

const PORT = 5001;

const server = app.listen(PORT, () => {
  console.log(`Mockify backend running with SQLite at http://localhost:${PORT}`);
});

server.on("error", (error) => {
  console.error("SERVER ERROR:", error);
});