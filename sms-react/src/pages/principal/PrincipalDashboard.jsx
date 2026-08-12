// src/pages/principal/PrincipalDashboard.jsx

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

function PrincipalDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // WHY 5 cards? Your HTML had exactly 5 cards — we match that exactly
  // WHY reuse existing routes? Principal views the same data
// No need to build separate pages — just redirect to existing ones
    const cards = [
    {
        icon: "🗓️",
        title: "Student Timetable",
        desc: "View timetable for a specific class and section.",
        path: "/student/timetable",   // ← reuses Teacher Timetable page
    },
    {
        icon: "📊",
        title: "Marks",
        desc: "View and monitor student academic performance.",
        path: "/student/marks",       // ← reuses Teacher Marks page
    },
    {
        icon: "✅",
        title: "Attendance",
        desc: "Monitor student attendance records.",
        path: "/student/attendance",  // ← reuses Teacher Attendance page
    },
    {
        icon: "💬",
        title: "Remarks",
        desc: "Check teacher feedback and remarks on students.",
        path: "/student/remarks",     // ← reuses Teacher Remarks page
    },
    {
        icon: "👩‍🏫",
        title: "Teacher Timetable",
        desc: "View timetable assigned to teachers.",
        path: "/teacher/timetable",   // ← reuses Teacher Timetable page
    },
    ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome section — same style as Student and Teacher dashboards */}
        <section className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome, Principal 👨‍🏫
          </h2>
          <p className="text-slate-500 mt-1">
            Manage and monitor the academic performance and schedules.
          </p>
        </section>

        {/* WHY grid-cols-3? Principal has 5 cards — 3 on first row, 2 on second */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <article
              key={card.title}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-500">{card.desc}</p>
              </div>
              <button
                onClick={() => navigate(card.path)}
                className="mt-6 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                View {card.title}
              </button>
            </article>
          ))}
        </section>

      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        © 2026 Student Management System
      </footer>
    </div>
  );
}

export default PrincipalDashboard;