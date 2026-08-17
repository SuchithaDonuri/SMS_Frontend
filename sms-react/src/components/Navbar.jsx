import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StudentDashboard from "../pages/StudentDashboard";
import TeacherDashboard from '../pages/teacher/TeacherDashboard'


const roleHome = {
  Student:   "/student/dashboard",
  Teacher:   "/teacher/dashboard",
  Principal: "/principal/dashboard",
  Parent:    "/parent/dashboard",
};

// Nav links per role — exactly matching your HTML pages
const navLinks = {
  Student: [
    { label: "Dashboard", path: "/StudentDashboard" },
    { label: "Marks",     path: "/student/marks" },
    { label: "Attendance",path: "/student/attendance" },
    { label: "Timetable", path: "/student/timetable" },
    { label: "Remarks",   path: "/student/remarks" },
  ],
  Teacher: [
    { label: "Dashboard", path: "/TeacherDashboard" },
    { label: "Marks",     path: "/teacher/marks" },
    { label: "Attendance",path: "/teacher/attendance" },
    { label: "Timetable", path: "/teacher/timetable" },
    { label: "Remarks",   path: "/teacher/remarks" },
  ],
  Principal: [
    { label: "Dashboard", path: "/principal-dashboard" },
    { label: "Students",  path: "/principal/students" },
    { label: "Teachers",  path: "/principal/teachers" },
    { label: "Attendance",path: "/principal/attendance" },
    { label: "Remarks",   path: "/principal/remarks" },
  ],
  Parent: [
    { label: "Dashboard", path: "/parent-dashboard" },
    { label: "Marks",     path: "/parent/marks" },
    { label: "Attendance",path: "/parent/attendance" },
    { label: "Timetable", path: "/parent/timetable" },
    { label: "Remarks",   path: "/parent/remarks" },
  ],
};

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // WHY: Clicking SMS logo goes back to dashboard — exactly like Amazon logo
  function handleLogoClick() {
    if (user) {
      navigate(roleHome[user.role]);
    } else {
      navigate("/");
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  const links = user ? navLinks[user.role] : [];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* SMS Logo — clicks home like Amazon */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SMS</span>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight
                           group-hover:text-blue-300 transition-colors">
            Student Management System
          </span>
        </div>

        {/* Nav links — same as your <nav><ul> in HTML */}
        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                  }`}
              >
                {link.label}
              </button>
            );
          })}

          {/* Logout button — same as your Logout link */}
          {user && (
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 rounded-lg text-sm font-medium
                         border border-slate-600 text-slate-300
                         hover:border-red-400 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          )}
        </nav>

      </div>
    </header>
  );
}

export default Navbar;