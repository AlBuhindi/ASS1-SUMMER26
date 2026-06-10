/**
 * CYSE 411 - Unit 1.2 + 1.3 Assignment
 * Secure Status Portal
 *
 * Rules:
 * - Use only JavaScript learned in Unit 1.2 + 1.3 (functions, DOM, events, JSON, async/await, fetch, storage).
 * - No frameworks (React, Vue), no external sanitization libs.
 * - Focus on correct behavior + security mindset.
 */

const STORAGE_KEY = "ssp_session_v1";

/** -----------------------------
 *  Part A — Safe DOM utilities
 *  -----------------------------
 */

function sanitizeUsername(input) {
  return String(input).replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 20);
}

function renderNotifications(listEl, notifications) {
  if (!listEl) return;

  listEl.replaceChildren();

  if (!Array.isArray(notifications)) return;

  for (const notification of notifications) {
    const li = document.createElement("li");
    li.textContent = String(notification);
    listEl.appendChild(li);
  }
}

/** -----------------------------
 *  Part B — JSON and parsing
 *  -----------------------------
 */

function parseProfileJson(jsonText) {
  try {
    const profile = JSON.parse(jsonText);

    if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
      return null;
    }

    if (typeof profile.displayName !== "string") {
      return null;
    }

    if (typeof profile.role !== "string") {
      return null;
    }

    if (profile.role !== "user" && profile.role !== "admin") {
      return null;
    }

    if (!Array.isArray(profile.notifications)) {
      return null;
    }

    for (const notification of profile.notifications) {
      if (typeof notification !== "string") {
        return null;
      }
    }

    return profile;
  } catch (_) {
    return null;
  }
}

/** -----------------------------
 *  Part C — Async fetch
 *  -----------------------------
 */

async function fetchUserProfile(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    return parseProfileJson(text);
  } catch (_) {
    return null;
  }
}

/** -----------------------------
 *  Part D — Client-side state (storage)
 *  -----------------------------
 */

function saveSessionToStorage(profile) {
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
    return;
  }

  if (typeof profile.displayName !== "string") {
    return;
  }

  if (typeof profile.role !== "string") {
    return;
  }

  if (profile.role !== "user" && profile.role !== "admin") {
    return;
  }

  const session = {
    displayName: profile.displayName,
    role: profile.role
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function loadSessionFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return null;
    }

    const session = JSON.parse(saved);

    if (!session || typeof session !== "object" || Array.isArray(session)) {
      return null;
    }

    if (typeof session.displayName !== "string") {
      return null;
    }

    if (typeof session.role !== "string") {
      return null;
    }

    if (session.role !== "user" && session.role !== "admin") {
      return null;
    }

    return {
      displayName: session.displayName,
      role: session.role
    };
  } catch (_) {
    return null;
  }
}

/** -----------------------------
 *  Part E — Access logic (security lesson)
 *  -----------------------------
 */

function computeAccessStatus(profile) {
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
    return "DENIED";
  }

  if (typeof profile.role !== "string") {
    return "DENIED";
  }

  if (profile.role === "admin") {
    return "GRANTED";
  }

  return "DENIED";
}

/** -----------------------------
 *  Part F — Wiring the UI (events)
 *  -----------------------------
 */

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setStatusText(value) {
  const el = document.getElementById("accessStatus");
  if (!el) return;

  el.textContent = value;
  el.classList.remove("ok", "bad");
  if (value === "GRANTED") el.classList.add("ok");
  if (value === "DENIED") el.classList.add("bad");
}

function renderDebug(obj) {
  const el = document.getElementById("debug");
  if (!el) return;
  el.textContent = JSON.stringify(obj, null, 2);
}

function applyProfileToUI(profile) {
  if (!profile) {
    setText("displayName", "UNDEFINED");
    setText("role", "UNDEFINED");
    setStatusText("UNDEFINED");
    renderNotifications(document.getElementById("notifications"), []);
    renderDebug({ note: "No profile loaded." });
    return;
  }

  setText("displayName", profile.displayName);
  setText("role", profile.role);
  setStatusText(computeAccessStatus(profile));

  renderNotifications(document.getElementById("notifications"), profile.notifications);
  renderDebug({
    storedSession: loadSessionFromStorage(),
    note: "UI updated from profile (client-side)."
  });
}

function initUI() {
  if (typeof document === "undefined") return;

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const loadProfileBtn = document.getElementById("loadProfileBtn");
  const loadFromStorageBtn = document.getElementById("loadFromStorageBtn");
  const resetBtn = document.getElementById("resetBtn");

  const usernameInput = document.getElementById("usernameInput");

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const raw = usernameInput ? usernameInput.value : "";
      const safe = sanitizeUsername(raw);

      const profile = {
        displayName: safe || "UNDEFINED",
        role: "user",
        notifications: ["Logged in locally (demo)."]
      };

      saveSessionToStorage(profile);
      applyProfileToUI(profile);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      applyProfileToUI(null);
    });
  }

  if (loadProfileBtn) {
    loadProfileBtn.addEventListener("click", async () => {
      const profile = await fetchUserProfile("/mock/profile.json");
      if (profile) {
        saveSessionToStorage(profile);
      }
      applyProfileToUI(profile);
    });
  }

  if (loadFromStorageBtn) {
    loadFromStorageBtn.addEventListener("click", () => {
      const session = loadSessionFromStorage();

      if (!session) {
        applyProfileToUI(null);
        return;
      }

      const profile = {
        displayName: session.displayName,
        role: session.role,
        notifications: ["Loaded from storage (no server validation)."]
      };

      applyProfileToUI(profile);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      if (usernameInput) usernameInput.value = "";
      applyProfileToUI(null);
    });
  }

  applyProfileToUI(null);
}

try {
  initUI();
} catch (_) {
}

module.exports = {
  sanitizeUsername,
  renderNotifications,
  parseProfileJson,
  fetchUserProfile,
  saveSessionToStorage,
  loadSessionFromStorage,
  computeAccessStatus,
  STORAGE_KEY
};