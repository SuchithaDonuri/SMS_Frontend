// src/pages/teacher/Timetable.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getTimetable, saveTimetableDay, deleteTimetableDay } from "../../api/flaskApi";

function Timetable() {
  const navigate = useNavigate();

  const [activeClass, setActiveClass] = useState("6A");

  // WHY these states? Replaces the old hardcoded timetableData object —
  // now this holds real rows fetched from PostgreSQL for whichever class
  // is currently selected
  const [activeData, setActiveData] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  const [editingRow, setEditingRow] = useState(null);
  const [editData,   setEditData]   = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const periods  = ["P1", "P2", "P3", "P4", "P5"];
  const subjects = ["Math", "English", "Science", "Social", "Telugu", "Hindi", "Computer", "Library", "Games", "N/A"];
  const teachers = ["T101", "T102", "T103", "T104", "T105", "T106", "T107", "T108", "T109"];

  // WHY this function? Fetches the current class's timetable from Flask —
  // called on page load AND whenever the class tab changes
  async function fetchTimetable(className) {
    setLoading(true);
    setError("");
    try {
      const data = await getTimetable(className);
      if (data.success) {
        setActiveData(data.timetable);
      } else {
        setError("Failed to load timetable.");
      }
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setLoading(false);
    }
  }

  // WHY useEffect with [activeClass]? Re-runs every time activeClass changes,
  // so switching tabs (6A -> 6B) automatically loads that class's real data
  useEffect(() => {
    fetchTimetable(activeClass);
  }, [activeClass]);

  function handleEditClick(row) {
    setEditingRow(row.day);
    setEditData({ ...row });
  }

  function handleEditChange(period, field, value) {
    setEditData((prev) => ({
      ...prev,
      [period]: { ...prev[period], [field]: value },
    }));
  }

  // WHY async now? Saving means calling Flask, which takes time
  async function handleSave() {
    setSaving(true);
    try {
      const data = await saveTimetableDay({
        class_name: activeClass,
        day: editingRow,
        ...editData,
      });

      if (!data.success) {
        setError(data.message || "Failed to save.");
        setSaving(false);
        return;
      }

      // WHY re-fetch? Simplest way to guarantee what's on screen matches
      // exactly what's now saved in PostgreSQL
      await fetchTimetable(activeClass);
      setEditingRow(null);
      setEditData({});
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditingRow(null);
    setEditData({});
  }

  function handleDeleteClick(day) {
    setDeleteConfirm(day);
  }

  // WHY async now? Deleting means calling Flask
  async function handleConfirmDelete(day) {
    try {
      const data = await deleteTimetableDay(activeClass, day);
      if (!data.success) {
        setError(data.message || "Failed to delete.");
        setDeleteConfirm(null);
        return;
      }
      await fetchTimetable(activeClass);
      setDeleteConfirm(null);
    } catch (err) {
      setError("Cannot connect to server.");
      setDeleteConfirm(null);
    }
  }

  function handleCancelDelete() {
    setDeleteConfirm(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">

        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="mb-6 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">🗓️ Timetable</h1>
          <p className="text-slate-500 mt-1">
            View and manage the weekly class schedule.
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Academic Timetable</h2>
              <p className="text-sm text-slate-500">Select a class to view the weekly schedule</p>
            </div>
            <div className="flex gap-2">
              {["6A", "6B"].map((cls) => (
                <button
                  key={cls}
                  onClick={() => {
                    setActiveClass(cls);
                    setEditingRow(null);
                    setDeleteConfirm(null);
                  }}
                  className={`px-5 py-2 rounded-xl font-semibold text-sm transition-colors ${
                    activeClass === cls
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-blue-50"
                  }`}
                >
                  Class 6_{cls}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 text-sm text-blue-700 font-medium">
            Currently Viewing: <strong>Class 6_{activeClass}</strong>
          </div>

          {/* WHY loading/error states? Real network calls can be slow or fail —
              the old hardcoded version never needed this */}
          {loading && (
            <p className="px-6 py-12 text-center text-slate-400">Loading timetable...</p>
          )}
          {error && (
            <p className="px-6 py-12 text-center text-red-500">{error}</p>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-blue-600 text-white text-sm">
                    <th className="px-4 py-3 font-semibold">Day</th>
                    {periods.map((p) => (
                      <th key={p} className="px-4 py-3 font-semibold">{p}</th>
                    ))}
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeData.map((row, i) => (
                    <tr
                      key={row.day}
                      className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="px-4 py-4 font-semibold text-slate-800 whitespace-nowrap">
                        {row.day}
                      </td>

                      {periods.map((p) => (
                        <td key={p} className="px-4 py-3">
                          {editingRow === row.day ? (
                            <div className="flex flex-col gap-1">
                              <select
                                value={editData[p]?.sub || ""}
                                onChange={(e) => handleEditChange(p, "sub", e.target.value)}
                                className="text-xs border border-blue-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                              >
                                {subjects.map((s) => (
                                  <option key={s}>{s}</option>
                                ))}
                              </select>
                              <select
                                value={editData[p]?.tid || ""}
                                onChange={(e) => handleEditChange(p, "tid", e.target.value)}
                                className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-500"
                              >
                                <option value="">No Teacher</option>
                                {teachers.map((t) => (
                                  <option key={t}>{t}</option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <div>
                              <span className="block text-sm font-medium text-slate-800">
                                {row[p].sub}
                              </span>
                              {row[p].tid && (
                                <span className="block text-xs text-slate-400 mt-0.5">
                                  {row[p].tid}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      ))}

                      <td className="px-4 py-4">
                        {editingRow === row.day ? (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={handleSave}
                              disabled={saving}
                              className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                            >
                              {saving ? "Saving..." : "✅ Save"}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                            >
                              ❌ Cancel
                            </button>
                          </div>
                        ) : deleteConfirm === row.day ? (
                          <div className="flex flex-col gap-2">
                            <p className="text-xs text-red-600 font-medium">Sure?</p>
                            <button
                              onClick={() => handleConfirmDelete(row.day)}
                              className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={handleCancelDelete}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEditClick(row)}
                              className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(row.day)}
                              className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                      </td>

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
