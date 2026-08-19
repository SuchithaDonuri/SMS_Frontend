// src/context/AuthContext.jsx

import { createContext, useState, useContext } from "react";

// WHY export here? So other files like TeacherDashboard, StudentDashboard
// can import AuthContext by name using: import { AuthContext } from "..."
export const AuthContext = createContext(null);

// WHY export default? So App.jsx can wrap everything inside <AuthProvider>
export default function AuthProvider({ children }) {
  // WHY a function inside useState()? This is called a "lazy initializer" —
  // it only runs ONCE, the very first time the app loads, and reads
  // whatever was saved in localStorage from a previous login. Without this,
  // refreshing the page would always reset user back to null, even if you
  // were still logged in.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // WHY a separate token state? The JWT token is what actually proves
  // you're logged in on every API request — it needs to be stored and
  // restored the same way the user object is.
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // WHY two arguments now? login() used to only receive the user object.
  // Now it also receives the JWT token that Flask issues at login.
 function login(userData, authToken) {
  // WHY capitalize here? The backend now stores/returns role in lowercase
  // ("principal", "student"...), but Navbar, ProtectedRoute, and the
  // dashboards were all written expecting "Principal", "Student" (capitalized).
  // Fixing it once, here, means every other file downstream keeps working
  // without needing separate patches in Navbar, ProtectedRoute, etc.
  const normalizedUser = {
    ...userData,
    role: userData.role.charAt(0).toUpperCase() + userData.role.slice(1).toLowerCase(),
  };

  setUser(normalizedUser);
  setToken(authToken);
  localStorage.setItem("user", JSON.stringify(normalizedUser));
  localStorage.setItem("token", authToken);
}
  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return (
    // WHY .Provider? This makes user, token, login, logout available to
    // every child component in the app
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// WHY useAuth? A custom hook — any component can call useAuth() instead of
// writing useContext(AuthContext) every time. Cleaner code.
export function useAuth() {
  return useContext(AuthContext);
}
