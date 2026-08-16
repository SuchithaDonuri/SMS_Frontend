// src/pages/teacher/Remarks.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { addRemark } from "../../api/flaskApi";

function Remarks() {
  const navigate = useNavigate();

  // WHY these states? Your HTML form had Student ID and Remark textarea
  const [studentId, setStudentId] = useState("");
  const [remark,    setRemark]    = useState("");
  const [error,     setError]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving,setSaving]=useState(false)

  // WHY records? Shows all remarks submitted this session
  const [records, setRecords] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    // WHY this check? Both fields are required — same as your HTML
    if (!studentId || !remark) {
      setError("Please fill all fields!");
      return;
    }

    setSaving(true);

    try {
      const data = await addRemark({ student_id: studentId, remark });

      if (!data.success) {
        setError(data.message || "Failed to save remark.");
        setSaving(false);
        return;
      }

      // WHY spread? Adds new remark to top of list
      setRecords((prev) => [
        {
          studentId,
          remark,
          date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        },
        ...prev,
      ]);

      setSubmitted(true);

      // WHY reset? Clears form after submit
      setStudentId("");
      setRemark("");
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-3xl font-bold text-slate-800">💬 Update Remarks</h1>
          <p className="text-slate-500 mt-1">
            Write feedback and observations for your students.
          </p>
        </div>

        {/* ── Remarks Form ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Student ID — same as your HTML */}
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

            {/* Remark textarea — same as your HTML */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Remark
              </label>
              {/* WHY rows=5? Gives enough space to write detailed feedback */}
              <textarea
                rows={5}
                placeholder="Write your feedback or observation here..."
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {/* WHY character count? Helps teacher know how much they wrote */}
              <p className="text-xs text-slate-400 mt-1 text-right">
                {remark.length} characters
              </p>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Success message */}
            {submitted && (
              <p className="text-green-600 text-sm font-medium">
                ✅ Remark saved successfully!
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {saving ? "Saving..." : "Save Remark"}
            </button>

          </form>
        </section>

        {/* ── Submitted Remarks List ── */}
        {/* WHY? Shows all remarks added this session so teacher can review */}
        {records.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-slate-800">
                📋 Submitted Remarks
              </h2>
              <p className="text-sm text-slate-500">
                Remarks added this session
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {records.map((r, i) => (
                <div key={i} className="px-6 py-5">

                  {/* Student ID + Date row */}
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-slate-800">
                      Student ID: {r.studentId}
                    </p>
                    <span className="text-xs text-slate-400">{r.date}</span>
                  </div>

                  {/* Remark text */}
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl px-4 py-3">
                    {r.remark}
                  </p>

                </div>
              ))}
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

export default Remarks;