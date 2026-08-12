// src/pages/parent/ParentDashboard.jsx

// WHY same structure as Student and Teacher dashboard?
// All dashboards look identical — consistent professional design
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

function ParentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // WHY only 3 cards? Parent only needs to monitor
  // Marks, Attendance, Remarks — no Timetable needed
  const cards = [
    {
      icon: "📊",
      title: "Marks",
      desc: "View your child's subject-wise exam performance.",
      path: "/parent/marks",
    },
    {
      icon: "📅",
      title: "Attendance",
      desc: "Monitor your child's attendance record.",
      path: "/parent/attendance",
    },
    {
      icon: "💬",
      title: "Remarks",
      desc: "Read teacher feedback about your child.",
      path: "/parent/remarks",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome section */}
        <section className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-white mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome, Parent 👨‍👩‍👧
          </h2>
          <p className="text-slate-500 mt-1">
            Monitor your child's academic progress from one place.
          </p>
        </section>

        {/* WHY grid-cols-3? 3 cards fit nicely in one row */}
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

export default ParentDashboard;