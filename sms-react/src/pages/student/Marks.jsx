// src/pages/student/Marks.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { getMarks } from "../../api/flaskApi";

function Marks() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // WHY useState? Stores marks fetched from Flask API
  const [marks,   setMarks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  // WHY useEffect? Runs once when page loads — fetches marks from Flask
  useEffect(() => {
    async function fetchMarks() {
      try {
        const data = await getMarks(user.id);
        if (data.success) {
          setMarks(data.marks);
        } else {
          setError("Failed to load marks.");
        }
      } catch (err) {
        setError("Cannot connect to server.");
      } finally {
        setLoading(false);
      }
    }
    fetchMarks();
  }, [user.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">

        <button
          onClick={() => navigate("/student/dashboard")}
          className="mb-6 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">📊 My Marks</h1>
          <p className="text-slate-500 mt-1">Your exam results from the database.</p>
        </div>

        {/* WHY loading state? Shows spinner while API is fetching */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-slate-500">Loading marks...</p>
          </div>
        )}

        {/* WHY error state? Shows message if Flask is not running */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <p className="text-red-600">{error}</p>
            <p className="text-red-400 text-sm mt-1">
              Make sure Flask is running on port 5000
            </p>
          </div>
        )}

        {/* Show marks table when data is loaded */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-blue-600 text-white text-sm">
                  <th className="px-6 py-3">Exam Type</th>
                  <th className="px-6 py-3">Math</th>
                  <th className="px-6 py-3">Physics</th>
                  <th className="px-6 py-3">English</th>
                  <th className="px-6 py-3">Average</th>
                </tr>
              </thead>
              <tbody>
                {marks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      No marks found.
                    </td>
                  </tr>
                ) : (
                  marks.map((row, i) => {
                    const avg = Math.round(
                      (row.math + row.physics + row.english) / 3
                    );
                    return (
                      <tr
                        key={row.id}
                        className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {row.exam_type}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{row.math}</td>
                        <td className="px-6 py-4 text-slate-600">{row.physics}</td>
                        <td className="px-6 py-4 text-slate-600">{row.english}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">
                            {avg}%
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        © 2026 Student Management System
      </footer>
    </div>
  );
}

export default Marks;