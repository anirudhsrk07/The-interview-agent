/**
 * Reusable API Service for Mockify
 * Connects frontend to Express backend at http://localhost:5001
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

/**
 * Reusable API request helper using fetch
 * Handles JSON parsing, standard headers, timeouts, and error catching.
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const config = {
    method: options.method || "GET",
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, status: response.status, data };
  } catch (error) {
    console.error(`API Error [${config.method} ${endpoint}]:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Health-check function calling GET http://localhost:5001/api/health
 */
export async function checkBackendHealth() {
  const result = await apiRequest("/api/health");
  if (result.success && result.data?.status === "OK") {
    return { connected: true, data: result.data };
  }
  return { connected: false, error: result.error || "Backend unavailable" };
}
