import Navbar from "../../components/Navbar";

const marksData = [
  { subject: "Mathematics", marks: 85, grade: "A" },
  { subject: "Science",     marks: 90, grade: "A+" },
  { subject: "English",     marks: 78, grade: "B+" },
  { subject: "Social",      marks: 88, grade: "A" },
];

const gradeColor = {
  "A+": "bg-green-100 text-green-700",
  "A":  "bg-blue-100 text-blue-700",
  "B+": "bg-amber-100 text-amber-700",
  "B":  "bg-orange-100 text-orange-700",
};

function Marks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100
                    via-blue-50 to-slate-200">
      <Navbar />

      <main className="max-w-5xl mx-auto px-8 py-10">

        <section className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Marks Overview</h2>
          <p className="text-slate-500 text-sm mt-1">
            Your subject-wise academic performance
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border
                            border-gray-100 overflow-hidden">
          <table className="w-full text-base">  {/* was text-sm, now text-base */}
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Subject
                </th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Marks
                </th>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {marksData.map((row, i) => (
                <tr
                  key={row.subject}
                  className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                >
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {row.subject}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.marks}/100</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                                     ${gradeColor[row.grade] || "bg-gray-100 text-gray-600"}`}>
                      {row.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        © 2026 Student Management System
      </footer>
    </div>
  );
}

export default Marks;