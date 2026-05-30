// src/context/AuthContext.jsx

import { createContext, useState, useContext } from "react";

// WHY export here? So other files like TeacherDashboard, StudentDashboard
// can import AuthContext by name using: import { AuthContext } from "..."
export const AuthContext = createContext(null);

// WHY export default? So App.jsx can wrap everything inside <AuthProvider>
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(userData) {
    setUser(userData);
  }

  function logout() {
    setUser(null);
  }

  return (
    // WHY .Provider? This makes user, login, logout available to every child component
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// WHY useAuth? A custom hook — any component can call useAuth() instead of
// writing useContext(AuthContext) every time. Cleaner code.
export function useAuth() {
  return useContext(AuthContext);
}