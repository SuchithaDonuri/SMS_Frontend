// src/pages/student/Timetable.jsx

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { getStudentTimetable } from "../../api/flaskApi";

function Timetable() {
  // WHY this state? Since students aren't yet linked to a specific class
  // in the users table, we let them pick their class here — same as the
  // teacher's tabs. This can be simplified later once a "class" column
  // is added to the users table.
  const [selectedClass, setSelectedClass] = useState("6A");

  const [timetable, setTimetable] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  async function fetchTimetable(className) {
    setLoading(true);
    setError("");
    try {
      const data = await getStudentTimetable(className);
      if (data.success) {
        setTimetable(data.timetable);
      } else {
        setError("Failed to load timetable.");
      }
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTimetable(selectedClass);
  }, [selectedClass]);

  const periods = ["P1", "P2", "P3", "P4", "P5"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8">

        <section className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Class Timetable</h2>
            <p className="text-slate-500 text-sm mt-1">Your weekly class schedule</p>
          </div>

          {/* Class selector — read-only view, no edit controls at all */}
          <div className="flex gap-2">
            {["6A", "6B"].map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-5 py-2 rounded-xl font-semibold text-sm transition-colors ${
                  selectedClass === cls
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Class 6_{cls}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {loading && (
            <p className="px-6 py-12 text-center text-slate-400">Loading timetable...</p>
          )}
          {error && (
            <p className="px-6 py-12 text-center text-red-500">{error}</p>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    {["Day", "Period 1", "Period 2", "Period 3", "Period 4", "Period 5"].map((h) => (
                      <th key={h} className="px-4 py-4 text-left font-semibold text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timetable.map((row, i) => (
                    <tr
                      key={row.day}
                      className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="px-4 py-4 font-semibold text-slate-800">{row.day}</td>
                      {periods.map((p) => (
                        <td key={p} className="px-4 py-4 text-slate-600 text-xs leading-relaxed">
                          {/* WHY this format? Matches the "Subject (TeacherID)"
                              style from the original hardcoded version */}
                          {row[p].sub}
                          {row[p].tid ? ` (${row[p].tid})` : ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>

      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        © 2026 Student Management System
      </footer>
    </div>
  );
}

export default Timetable;
