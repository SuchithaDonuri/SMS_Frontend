import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllUsers } from "../api/mockApi";

function LoginPage() {
  const [role, setRole]         = useState("");
  const [userId, setUserId]     = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading]   = useState(false);

  const navigate  = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    // Exactly your validation from login.js lines 12-17
    if (!role || !userId || !password) {
      setErrorMsg("Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      // Your exact MockAPI URL via mockApi.js
      const users = await getAllUsers();

      // Your exact matching logic from login.js
      // Note: your API uses user.id — keeping that exactly
      const foundUser = users.find(
        (user) =>
          user.id === userId &&
          user.password === password &&
          user.role === role
      );

      if (foundUser) {
        login(foundUser); // saves user to AuthContext

        // Your exact role redirects — same roles, same capitalisation
        if (role === "Principal") navigate("/principal/dashboard");
        else if (role === "Teacher")   navigate("/teacher/dashboard");
        else if (role === "Student")   navigate("/student/dashboard");
        else if (role === "Parent")    navigate("/parent/dashboard");

      } else {
        setErrorMsg("Invalid credentials ❌");
      }

    } catch (err) {
      console.error(err);
      setErrorMsg("Error fetching data ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50
                    to-slate-200 flex flex-col items-center justify-center">

      {/* Your login-card — same structure as your login.html article */}
      <div className="w-[360px] bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

        {/* Your card-header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center
                          justify-center mx-auto mb-3">
            <span className="text-white font-bold text-lg">SMS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Student Management System
          </h1>
          <p className="text-sm text-slate-500 mt-1">Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Role dropdown — your exact 4 options, exact capitalisation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg
                         bg-white focus:outline-none focus:ring-2
                         focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="" disabled>Choose your role...</option>
              <option value="Principal">Principal</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
              <option value="Parent">Parent</option>
            </select>
          </div>

          {/* User ID — your exact field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <input
              type="text"
              placeholder="Enter your ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg
                         bg-white focus:outline-none focus:ring-2
                         focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Password — your exact field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg
                         bg-white focus:outline-none focus:ring-2
                         focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Error message — your exact errorMsg */}
          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold
                       py-2.5 rounded-lg transition-colors disabled:opacity-50
                       disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Signing in..." : "Login to System"}
          </button>

        </form>
      </div>

      {/* Your footer */}
      <footer className="mt-6 text-center text-sm text-gray-500">
        <p>© 2026 Student Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LoginPage;