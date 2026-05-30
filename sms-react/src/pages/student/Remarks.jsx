import Navbar from "../../components/Navbar";

const remarks = [
  {
    subject: "Mathematics",
    text: "Excellent performance in the last test. Keep it up!",
    type: "positive",
  },
  {
    subject: "Science",
    text: "Needs improvement in lab work. Please focus on practical sessions.",
    type: "warning",
  },
];

function Remarks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100
                    via-blue-50 to-slate-200">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-8">

        <section className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Student Remarks</h2>
          <p className="text-slate-500 text-sm mt-1">
            Your remarks and feedback from teachers
          </p>
        </section>

        <section className="space-y-4">
          {remarks.map((r) => (
            <div
              key={r.subject}
              className={`rounded-2xl border p-6 ${
                r.type === "positive"
                  ? "bg-green-50 border-green-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <p className="text-sm font-semibold text-slate-700 mb-1">
                {r.subject}
              </p>
              <p className="text-sm text-slate-600">{r.text}</p>
            </div>
          ))}
        </section>

      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        © 2026 Student Management System
      </footer>
    </div>
  );
}

export default Remarks;