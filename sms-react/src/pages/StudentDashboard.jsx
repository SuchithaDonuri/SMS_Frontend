import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const cards = [
    {
      title: "Marks",
      desc: "Check your subject-wise performance.",
      path: "/student/marks",
      icon: "📊",
      color: "bg-blue-50 border-blue-200",
      btn: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Attendance",
      desc: "Track your attendance record.",
      path: "/student/attendance",
      icon: "📅",
      color: "bg-blue-50 border-blue-200",
      btn: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Timetable",
      desc: "View your daily class schedule.",
      path: "/student/timetable",
      icon: "🕐",
      color: "bg-blue-50 border-blue-200",
      btn: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Remarks",
      desc: "See feedback from your teachers.",
      path: "/student/remarks",
      icon: "💬",
      color: "bg-blue-50 border-blue-200",
      btn: "bg-blue-600 hover:bg-blue-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100
                    via-blue-50 to-slate-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Your welcome section */}
        <section className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg
                            p-8 border border-white mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Welcome, {user?.name || "Student"} 👋
          </h2>
          <p className="text-slate-500 mt-1">
            Access your academic information quickly and easily.
          </p>
        </section>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
                <article
                key={card.title}
                className="bg-white rounded-2xl border border-gray-200
                            shadow-sm hover:shadow-md transition-shadow p-6
                            flex flex-col justify-between"
                >
                <div>
                    <div className="w-12 h-12 bg-blue-50 border border-blue-100
                                    rounded-xl flex items-center justify-center
                                    text-2xl mb-4">
                    {card.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    {card.title}
                    </h3>
                    <p className="text-sm text-slate-500">{card.desc}</p>
                </div>
                <button
                    onClick={() => navigate(card.path)}
                    className="mt-6 w-full py-2.5 rounded-lg bg-blue-600
                            hover:bg-blue-700 text-white text-sm font-medium
                            transition-colors"
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

export default StudentDashboard;