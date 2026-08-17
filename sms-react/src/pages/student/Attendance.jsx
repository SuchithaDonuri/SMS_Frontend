// src/pages/student/Attendance.jsx

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getAttendance } from "../../api/flaskApi";

function Attendance() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const data = await getAttendance(user.id);
        if (data.success) {
          setAttendance(data.attendance);
        } else {
          setError("Failed to load attendance.");
        }
      } catch (err) {
        setError("Cannot connect to server.");
      } finally {
        setLoading(false);
      }
    }
    fetchAttendance();
  }, [user.id]);

  // WHY group by subject? API returns one row per day per subject
  // We want to show total/attended per subject
  const grouped = attendance.reduce((acc, row) => {
    if (!acc[row.subject]) {
      acc[row.subject] = { total: 0, attended: 0 };
    }
    acc[row.subject].total += 1;
    if (row.status === "Present") acc[row.subject].attended += 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">

        <section className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Attendance Overview</h2>
          <p className="text-slate-500 text-sm mt-1">Your subject-wise attendance details</p>
        </section>

        {loading && (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-slate-500">Loading attendance...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-gray-100">
                <tr>
                  {["Subject", "Total Classes", "Attended", "Percentage"].map(h => (
                    <th key={h} className="text-left px-6 py-4 font-semibold text-slate-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(grouped).map(([subject, data], i) => {
                  const percent = Math.round((data.attended / data.total) * 100);
                  return (
                    <tr key={subject} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="px-6 py-4 font-medium text-slate-700">{subject}</td>
                      <td className="px-6 py-4 text-slate-600">{data.total}</td>
                      <td className="px-6 py-4 text-slate-600">{data.attended}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          percent >= 75 ? "bg-green-100 text-green-700" :
                          percent >= 60 ? "bg-amber-100 text-amber-700" :
                                          "bg-red-100 text-red-700"
                        }`}>
                          {percent}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}

      </main>
      <footer className="text-center text-sm text-gray-500 py-6">
        © 2026 Student Management System
      </footer>
    </div>
  );
}

export default Attendance;