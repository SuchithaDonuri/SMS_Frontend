import Navbar from "../../components/Navbar";

const attendanceData = [
  { subject: "Mathematics", total: 50, attended: 45, percent: "90%" },
  { subject: "Science",     total: 48, attended: 44, percent: "91%" },
  { subject: "English",     total: 45, attended: 40, percent: "89%" },
  { subject: "Social",      total: 46, attended: 42, percent: "91%" },
];

function Attendance() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100
                    via-blue-50 to-slate-200">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-8">

        <section className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Attendance Overview</h2>
          <p className="text-slate-500 text-sm mt-1">
            Your subject-wise attendance details
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border
                            border-gray-100 overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr>
                {["Subject","Total Classes","Attended","Percentage"].map(h => (
                  <th key={h} className="text-left px-6 py-4 font-semibold text-slate-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((row, i) => (
                <tr key={row.subject}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                  <td className="px-6 py-4 font-medium text-slate-700">{row.subject}</td>
                  <td className="px-6 py-4 text-slate-600">{row.total}</td>
                  <td className="px-6 py-4 text-slate-600">{row.attended}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      {row.percent}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Your summary cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <h3 className="text-sm font-medium text-green-700 mb-2">Overall Attendance</h3>
            <p className="text-4xl font-bold text-green-600">90%</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
            <h3 className="text-sm font-medium text-amber-700 mb-2">Minimum Required</h3>
            <p className="text-4xl font-bold text-amber-600">75%</p>
          </div>
        </div>

      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        © 2026 Student Management System
      </footer>
    </div>
  );
}

export default Attendance;