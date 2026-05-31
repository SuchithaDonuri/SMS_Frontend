// src/pages/teacher/Timetable.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Timetable() {
  const navigate = useNavigate();

  const [activeClass, setActiveClass] = useState("6A");

  // WHY useState for timetableData?
  // Before it was a plain const — so editing was impossible
  // Now it is state — when we edit a row, React re-renders the table
  const [timetableData, setTimetableData] = useState({
    "6A": [
      { day: "Monday",    P1: { sub: "Math",     tid: "T101" }, P2: { sub: "English",  tid: "T102" }, P3: { sub: "Science",  tid: "T103" }, P4: { sub: "Social",   tid: "T104" }, P5: { sub: "Telugu",   tid: "T105" } },
      { day: "Tuesday",   P1: { sub: "English",  tid: "T102" }, P2: { sub: "Social",   tid: "T102" }, P3: { sub: "Computer", tid: "T106" }, P4: { sub: "Science",  tid: "T103" }, P5: { sub: "Hindi",    tid: "T107" } },
      { day: "Wednesday", P1: { sub: "Science",  tid: "T103" }, P2: { sub: "Math",     tid: "T101" }, P3: { sub: "English",  tid: "T102" }, P4: { sub: "Telugu",   tid: "T105" }, P5: { sub: "Social",   tid: "T104" } },
      { day: "Thursday",  P1: { sub: "Math",     tid: "T101" }, P2: { sub: "Computer", tid: "T106" }, P3: { sub: "Science",  tid: "T103" }, P4: { sub: "English",  tid: "T102" }, P5: { sub: "Hindi",    tid: "T107" } },
      { day: "Friday",    P1: { sub: "English",  tid: "T102" }, P2: { sub: "Math",     tid: "T101" }, P3: { sub: "Social",   tid: "T104" }, P4: { sub: "Science",  tid: "T103" }, P5: { sub: "Maths",    tid: "T101" } },
      { day: "Saturday",  P1: { sub: "Telugu",   tid: "T105" }, P2: { sub: "Hindi",    tid: "T107" }, P3: { sub: "Computer", tid: "T106" }, P4: { sub: "Math",     tid: "T101" }, P5: { sub: "Library",  tid: "T109" } },
    ],
    "6B": [
      { day: "Monday",    P1: { sub: "Social",   tid: "T104" }, P2: { sub: "Telugu",   tid: "T105" }, P3: { sub: "Math",     tid: "T101" }, P4: { sub: "English",  tid: "T102" }, P5: { sub: "Science",  tid: "T103" } },
      { day: "Tuesday",   P1: { sub: "Math",     tid: "T101" }, P2: { sub: "Science",  tid: "T103" }, P3: { sub: "English",  tid: "T102" }, P4: { sub: "Hindi",    tid: "T107" }, P5: { sub: "Computer", tid: "T106" } },
      { day: "Wednesday", P1: { sub: "Math",     tid: "T101" }, P2: { sub: "Telugu",   tid: "T105" }, P3: { sub: "Science",  tid: "T103" }, P4: { sub: "Social",   tid: "T104" }, P5: { sub: "N/A",      tid: ""     } },
      { day: "Thursday",  P1: { sub: "Science",  tid: "T103" }, P2: { sub: "Math",     tid: "T101" }, P3: { sub: "English",  tid: "T102" }, P4: { sub: "Computer", tid: "T106" }, P5: { sub: "Hindi",    tid: "T107" } },
      { day: "Friday",    P1: { sub: "Math",     tid: "T101" }, P2: { sub: "English",  tid: "T102" }, P3: { sub: "Science",  tid: "T103" }, P4: { sub: "Social",   tid: "T104" }, P5: { sub: "Games",    tid: "T108" } },
      { day: "Saturday",  P1: { sub: "Hindi",    tid: "T107" }, P2: { sub: "Telugu",   tid: "T105" }, P3: { sub: "Math",     tid: "T101" }, P4: { sub: "Computer", tid: "T106" }, P5: { sub: "Library",  tid: "T109" } },
    ],
  });

  // WHY editingRow state?
  // Tracks WHICH row is currently being edited
  // null means no row is being edited
  // When teacher clicks Edit on Monday row, editingRow becomes "Monday"
  const [editingRow, setEditingRow] = useState(null);

  // WHY editData state?
  // Stores the temporary edited values while teacher is editing
  // We don't change timetableData directly while editing
  // Only when teacher clicks Save do we update timetableData
  const [editData, setEditData] = useState({});

  // WHY deleteConfirm state?
  // Stores which row's delete button was clicked
  // null means no delete confirmation is showing
  // When teacher clicks Delete on Tuesday, deleteConfirm becomes "Tuesday"
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const periods = ["P1", "P2", "P3", "P4", "P5"];

  const subjects = [
    "Math", "English", "Science", "Social", "Telugu",
    "Hindi", "Computer", "Library", "Games", "N/A"
  ];

  const teachers = ["T101", "T102", "T103", "T104", "T105", "T106", "T107", "T108", "T109"];

  // ── EDIT FUNCTIONS ──

  // WHY handleEditClick?
  // When teacher clicks ✏️ Edit on a row:
  // 1. Set editingRow to that day so the row switches to input mode
  // 2. Copy that row's current data into editData so inputs are pre-filled
  function handleEditClick(row) {
    setEditingRow(row.day);
    // WHY spread? Creates a copy of the row so we don't mutate state directly
    setEditData({ ...row });
  }

  // WHY handleEditChange?
  // Called every time teacher changes a subject or teacher ID input
  // period = "P1" or "P2" etc, field = "sub" or "tid", value = new value typed
  function handleEditChange(period, field, value) {
    setEditData((prev) => ({
      ...prev,
      // WHY spread prev[period]? Keep the other field unchanged
      // e.g. if teacher changes P1 subject, keep P1 tid the same
      [period]: { ...prev[period], [field]: value },
    }));
  }

  // WHY handleSave?
  // When teacher clicks ✅ Save:
  // Replace the old row in timetableData with the new editData
  function handleSave() {
    setTimetableData((prev) => ({
      ...prev,
      // WHY map? Loop through rows and replace only the edited row
      [activeClass]: prev[activeClass].map((row) =>
        row.day === editingRow ? { ...editData } : row
      ),
    }));
    // WHY null? Exit edit mode after saving
    setEditingRow(null);
    setEditData({});
  }

  // WHY handleCancelEdit?
  // Teacher clicks ❌ Cancel — discard changes and exit edit mode
  function handleCancelEdit() {
    setEditingRow(null);
    setEditData({});
  }

  // ── DELETE FUNCTIONS ──

  // WHY handleDeleteClick?
  // First click on 🗑️ Delete — just shows the confirmation message
  // Does NOT delete yet — teacher must confirm first
  function handleDeleteClick(day) {
    setDeleteConfirm(day);
  }

  // WHY handleConfirmDelete?
  // Teacher clicked "Yes, Delete" in the confirmation
  // Now actually remove that row from timetableData
  function handleConfirmDelete(day) {
    setTimetableData((prev) => ({
      ...prev,
      // WHY filter? Keeps all rows EXCEPT the one matching this day
      [activeClass]: prev[activeClass].filter((row) => row.day !== day),
    }));
    setDeleteConfirm(null);
  }

  // WHY handleCancelDelete?
  // Teacher clicked "Cancel" — hide confirmation, do nothing
  function handleCancelDelete() {
    setDeleteConfirm(null);
  }

  const activeData = timetableData[activeClass];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate("/teacher/dashboard")}
          className="mb-6 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Dashboard
        </button>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">🗓️ Timetable</h1>
          <p className="text-slate-500 mt-1">
            View and manage the weekly class schedule.
          </p>
        </div>

        {/* ── Timetable Card ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Header + Class Tabs */}
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
                    // WHY reset edit/delete on tab change?
                    // If teacher was editing 6A and switches to 6B,
                    // we don't want 6A's edit mode to carry over
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

          {/* Currently viewing label */}
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 text-sm text-blue-700 font-medium">
            Currently Viewing: <strong>Class 6_{activeClass}</strong>
          </div>

          {/* Table */}
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
                  // WHY fragment with key? Each row has normal view OR edit view
                  <tr
                    key={row.day}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    {/* Day name */}
                    <td className="px-4 py-4 font-semibold text-slate-800 whitespace-nowrap">
                      {row.day}
                    </td>

                    {/* WHY conditional render per period cell?
                        If this row is being edited → show dropdowns
                        If not → show normal text */}
                    {periods.map((p) => (
                      <td key={p} className="px-4 py-3">
                        {editingRow === row.day ? (
                          // ── EDIT MODE — show dropdowns ──
                          <div className="flex flex-col gap-1">
                            {/* Subject dropdown */}
                            <select
                              value={editData[p]?.sub || ""}
                              onChange={(e) => handleEditChange(p, "sub", e.target.value)}
                              className="text-xs border border-blue-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                            >
                              {subjects.map((s) => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>
                            {/* Teacher ID dropdown */}
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
                          // ── NORMAL MODE — show text ──
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

                    {/* Actions column */}
                    <td className="px-4 py-4">
                      {editingRow === row.day ? (
                        // ── EDIT MODE actions — Save and Cancel ──
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={handleSave}
                            className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            ✅ Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      ) : deleteConfirm === row.day ? (
                        // ── DELETE CONFIRMATION — shown after first Delete click ──
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
                        // ── NORMAL MODE actions — Edit and Delete ──
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

        </section>

      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        © 2026 Student Management System
      </footer>
    </div>
  );
}

export default Timetable;