// src/pages/teacher/Marks.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Marks() {
  const navigate = useNavigate();

  // WHY these states? Your HTML form had Student ID, Exam Type, and subject marks
  const [studentId, setStudentId] = useState("");
  const [examType,  setExamType]  = useState("");
  const [math,      setMath]      = useState("");
  const [physics,   setPhysics]   = useState("");
  const [english,   setEnglish]   = useState("");
  const [error,     setError]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  // WHY records? Shows a live list of marks submitted this session
  const [records, setRecords] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    // WHY this check? All fields must be filled before submitting
    if (!studentId || !examType || !math || !physics || !english) {
      setError("Please fill all fields!");
      return;
    }

    // WHY Number()? Input values are strings by default — convert to numbers
    // WHY this check? Marks must be between 0 and 100
    if (
      Number(math)    < 0 || Number(math)    > 100 ||
      Number(physics) < 0 || Number(physics) > 100 ||
      Number(english) < 0 || Number(english) > 100
    ) {
      setError("Marks must be between 0 and 100!");
      return;
    }

    // WHY spread? Adds new record to top without removing old ones
    setRecords((prev) => [
      {
        studentId,
        examType,
        math:    Number(math),
        physics: Number(physics),
        english: Number(english),
        // WHY average? Gives teacher a quick summary of student performance
        avg: Math.round((Number(math) + Number(physics) + Number(english)) / 3),
      },
      ...prev,
    ]);

    setSubmitted(true);

    // WHY reset? Clears form after submit — ready for next student
    setStudentId("");
    setExamType("");
    setMath("");
    setPhysics("");
    setEnglish("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="mb-6 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Dashboard
        </button>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">📝 Update Marks</h1>
          <p className="text-slate-500 mt-1">
            Enter student exam scores below.
          </p>
        </div>

        {/* ── Marks Form ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Student ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Student ID
              </label>
              <input
                type="text"
                placeholder="e.g. S1001"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Exam Type — same 3 options as your HTML */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Exam Type
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select exam type</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half-Yearly">Half-Yearly</option>
                <option value="Annual">Annual</option>
              </select>
            </div>

            {/* WHY a divider line here? Visually separates identity fields
                from marks fields — easier to read */}
            <hr className="border-slate-100" />

            <p className="text-sm font-semibold text-slate-600">
              Enter Marks (out of 100)
            </p>

            {/* WHY grid? Shows 3 mark inputs side by side — saves space */}
            <div className="grid grid-cols-3 gap-4">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Math
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0–100"
                  value={math}
                  onChange={(e) => setMath(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Physics
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0–100"
                  value={physics}
                  onChange={(e) => setPhysics(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  English
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0–100"
                  value={english}
                  onChange={(e) => setEnglish(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Success message */}
            {submitted && (
              <p className="text-green-600 text-sm font-medium">
                ✅ Marks updated successfully!
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Update Marks
            </button>

          </form>
        </section>

        {/* ── Live Records Section ── */}
        {/* WHY? Shows all marks submitted this session — teacher can review */}
        {records.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-slate-800">
                📋 Submitted This Session
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-blue-600 text-white text-sm">
                    <th className="px-6 py-3">Student ID</th>
                    <th className="px-6 py-3">Exam</th>
                    <th className="px-6 py-3">Math</th>
                    <th className="px-6 py-3">Physics</th>
                    <th className="px-6 py-3">English</th>
                    <th className="px-6 py-3">Average</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {r.studentId}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{r.examType}</td>
                      <td className="px-6 py-4 text-slate-600">{r.math}</td>
                      <td className="px-6 py-4 text-slate-600">{r.physics}</td>
                      <td className="px-6 py-4 text-slate-600">{r.english}</td>
                      <td className="px-6 py-4">
                        {/* WHY badge? Makes average stand out visually */}
                        <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">
                          {r.avg}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </section>
        )}

      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        © 2026 Student Management System
      </footer>
    </div>
  );
}

export default Marks;