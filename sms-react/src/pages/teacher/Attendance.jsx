// src/pages/teacher/Attendance.jsx

// WHY useState? We need it to track form inputs and submitted data
// WHY useEffect? Runs once when the page loads, to fetch real attendance data
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { addAttendance, getAllAttendance } from "../../api/flaskApi";

function Attendance() {
  const navigate = useNavigate();

  // WHY these states? Your HTML form had 3 fields — Student ID, Subject, Status
  const [studentId, setStudentId] = useState("");
  const [subject,   setSubject]   = useState("");
  const [status,    setStatus]    = useState("");
  const [saving,    setSaving]    = useState(false);

  // WHY this state? To show a success message after form is submitted
  const [submitted, setSubmitted] = useState(false);

  // WHY this state? To show validation error if fields are empty
  const [error, setError] = useState("");

  // WHY records state? To show a live list of attendance entries added this session
  const [records, setRecords] = useState([]);

  // WHY this state? Holds the REAL subject-wise overview, built from
  // actual attendance rows in PostgreSQL — replaces the old hardcoded array
  const [overview,        setOverview]        = useState([]);
  const [overviewLoading, setOverviewLoading]  = useState(true);
  const [overviewError,   setOverviewError]    = useState("");

  // WHY this function? Takes the raw list of attendance records from Flask
  // (one row per student per subject per date) and groups them by subject,
  // counting how many total records exist and how many were "Present".
  // This is how we turn raw rows into a per-subject summary table.
  function buildOverview(allRecords) {
    const grouped = {};

    allRecords.forEach((r) => {
      if (!grouped[r.subject]) {
        grouped[r.subject] = { subject: r.subject, total: 0, attended: 0 };
      }
      grouped[r.subject].total += 1;
      if (r.status === "Present") {
        grouped[r.subject].attended += 1;
      }
    });

    // WHY Object.values()? grouped is an object keyed by subject name —
    // we need it back as an array to .map() over in the table below
    return Object.values(grouped);
  }

  // WHY this function? Fetches attendance from Flask and rebuilds the
  // overview table — called on page load AND again after a new
  // attendance entry is successfully submitted, so the table stays live
  async function fetchOverview() {
    setOverviewLoading(true);
    setOverviewError("");
    try {
      const data = await getAllAttendance();
      if (data.success) {
        setOverview(buildOverview(data.attendance));
      } else {
        setOverviewError("Failed to load attendance overview.");
      }
    } catch (err) {
      setOverviewError("Cannot connect to server.");
    } finally {
      setOverviewLoading(false);
    }
  }

  // WHY useEffect with []? Runs exactly once, when the page first loads
  useEffect(() => {
    fetchOverview();
  }, []);

  async function handleSubmit(e) {
    // WHY preventDefault? Stops page from reloading on form submit
    e.preventDefault();
    setError("");
    setSubmitted(false);

    // WHY this check? Your HTML had "required" on all fields — we match that
    if (!studentId || !subject || !status) {
      setError("Please fill all fields!");
      return;
    }

    setSaving(true);

    try {
      // WHY this call? This was missing before — it actually sends the
      // attendance entry to Flask, which INSERTs it into PostgreSQL
      const data = await addAttendance({
        student_id: studentId,
        subject,
        status,
      });

      if (!data.success) {
        setError(data.message || "Failed to save attendance.");
        setSaving(false);
        return;
      }

      // WHY spread? Adds new record to top of list without deleting old ones
      setRecords((prev) => [
        { studentId, subject, status, time: new Date().toLocaleTimeString() },
        ...prev,
      ]);

      setSubmitted(true);

      // WHY reset? Clears form after successful submit — ready for next entry
      setStudentId("");
      setSubject("");
      setStatus("");

      // WHY call this again? The overview table needs to reflect the
      // brand new entry we just saved — re-fetching keeps it accurate
      fetchOverview();
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="mb-6 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Dashboard
        </button>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">✅ Attendance</h1>
          <p className="text-slate-500 mt-1">
            View subject-wise overview and update student attendance.
          </p>
        </div>

        {/* ── SECTION 1: Overview Table ── */}
        {/* WHY this section? Shows each subject's total marked entries vs
            how many were "Present" — now built from real database rows */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">

          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-slate-800">
              📊 Attendance Overview
            </h2>
            <p className="text-sm text-slate-500">Subject-wise class attendance</p>
          </div>

          {/* WHY loading state? Shows feedback while fetching from Flask */}
          {overviewLoading && (
            <p className="px-6 py-8 text-center text-slate-400">
              Loading overview...
            </p>
          )}

          {/* WHY error state? Shows message if Flask is not running */}
          {overviewError && (
            <p className="px-6 py-8 text-center text-red-500">
              {overviewError}
            </p>
          )}

          {!overviewLoading && !overviewError && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-6 py-3 text-sm font-semibold">Subject</th>
                    <th className="px-6 py-3 text-sm font-semibold">Total Marked</th>
                    <th className="px-6 py-3 text-sm font-semibold">Present</th>
                    <th className="px-6 py-3 text-sm font-semibold">Percentage</th>
                    <th className="px-6 py-3 text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                        No attendance records yet.
                      </td>
                    </tr>
                  ) : (
                    overview.map((row, i) => {
                      // WHY calculate here? So percentage updates if data changes
                      const percent = Math.round((row.attended / row.total) * 100);
                      // WHY conditional colour? Green = good, Amber = warning, Red = danger
                      const percentColor =
                        percent >= 75 ? "text-green-600" :
                        percent >= 60 ? "text-amber-600" : "text-red-600";
                      const badge =
                        percent >= 75 ? "bg-green-100 text-green-700" :
                        percent >= 60 ? "bg-amber-100 text-amber-700" :
                                        "bg-red-100 text-red-700";
                      const label =
                        percent >= 75 ? "Good" :
                        percent >= 60 ? "Low" : "Critical";

                      return (
                        <tr
                          key={row.subject}
                          className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                        >
                          <td className="px-6 py-4 font-medium text-slate-800">
                            {row.subject}
                          </td>
                          <td className="px-6 py-4 text-slate-600">{row.total}</td>
                          <td className="px-6 py-4 text-slate-600">{row.attended}</td>
                          <td className={`px-6 py-4 font-bold ${percentColor}`}>
                            {percent}%
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge}`}>
                              {label}
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
        </section>

        {/* ── SECTION 2: Update Attendance Form ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-800">
              📋 Update Attendance
            </h2>
            <p className="text-sm text-slate-500">
              Enter student details and mark attendance
            </p>
          </div>

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

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select subject</option>
                <option>Mathematics</option>
                <option>Science</option>
                <option>English</option>
                <option>Telugu</option>
                <option>Hindi</option>
                <option>Computer</option>
                <option>Social</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Attendance Status
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStatus("Present")}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    status === "Present"
                      ? "bg-green-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-green-100"
                  }`}
                >
                  ✅ Present
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("Absent")}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    status === "Absent"
                      ? "bg-red-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-red-100"
                  }`}
                >
                  ❌ Absent
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {submitted && (
              <p className="text-green-600 text-sm font-medium">
                ✅ Attendance updated successfully!
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Submit Attendance"}
            </button>

          </form>
        </section>

        {/* ── SECTION 3: Live Records ── */}
        {records.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-slate-800">
                🕐 Today's Entries
              </h2>
              <p className="text-sm text-slate-500">
                Records submitted this session
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {records.map((r, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">
                      Student ID: {r.studentId}
                    </p>
                    <p className="text-sm text-slate-500">
                      {r.subject} · {r.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    r.status === "Present"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {r.status}
                  </span>
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

export default Attendance;
