// src/pages/teacher/Timetable.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Timetable() {
  const navigate = useNavigate();

  // WHY useState for activeClass?
  // Your HTML used radio buttons + CSS to show/hide tables
  // In React we use state instead — cleaner, no CSS tricks needed
  // When teacher clicks "Class 6_A" tab, activeClass becomes "6A"
  // When they click "Class 6_B", it becomes "6B"
  const [activeClass, setActiveClass] = useState("6A");

  // WHY this data object?
  // Your HTML had two separate tables — one for 6A, one for 6B
  // Here we store both in one object, keyed by class name
  // timetableData["6A"] gives Class 6A's schedule
  // timetableData["6B"] gives Class 6B's schedule
  const timetableData = {
    "6A": [
      { day: "Monday",    P1: { sub: "Math",    tid: "T101" }, P2: { sub: "English", tid: "T102" }, P3: { sub: "Science", tid: "T103" }, P4: { sub: "Social",  tid: "T104" }, P5: { sub: "Telugu",  tid: "T105" } },
      { day: "Tuesday",   P1: { sub: "English", tid: "T102" }, P2: { sub: "Social",  tid: "T102" }, P3: { sub: "Computer",tid: "T106" }, P4: { sub: "Science", tid: "T103" }, P5: { sub: "Hindi",   tid: "T107" } },
      { day: "Wednesday", P1: { sub: "Science", tid: "T103" }, P2: { sub: "Math",    tid: "T101" }, P3: { sub: "English", tid: "T102" }, P4: { sub: "Telugu",  tid: "T105" }, P5: { sub: "Social",  tid: "T104" } },
      { day: "Thursday",  P1: { sub: "Math",    tid: "T101" }, P2: { sub: "Computer",tid: "T106" }, P3: { sub: "Science", tid: "T103" }, P4: { sub: "English", tid: "T102" }, P5: { sub: "Hindi",   tid: "T107" } },
      { day: "Friday",    P1: { sub: "English", tid: "T102" }, P2: { sub: "Math",    tid: "T101" }, P3: { sub: "Social",  tid: "T104" }, P4: { sub: "Science", tid: "T103" }, P5: { sub: "Maths",   tid: "T101" } },
      { day: "Saturday",  P1: { sub: "Telugu",  tid: "T105" }, P2: { sub: "Hindi",   tid: "T107" }, P3: { sub: "Computer",tid: "T106" }, P4: { sub: "Math",    tid: "T101" }, P5: { sub: "Library", tid: "T109" } },
    ],
    "6B": [
      { day: "Monday",    P1: { sub: "Social",  tid: "T104" }, P2: { sub: "Telugu",  tid: "T105" }, P3: { sub: "Math",    tid: "T101" }, P4: { sub: "English", tid: "T102" }, P5: { sub: "Science", tid: "T103" } },
      { day: "Tuesday",   P1: { sub: "Math",    tid: "T101" }, P2: { sub: "Science", tid: "T103" }, P3: { sub: "English", tid: "T102" }, P4: { sub: "Hindi",   tid: "T107" }, P5: { sub: "Computer",tid: "T106" } },
      { day: "Wednesday", P1: { sub: "Math",    tid: "T101" }, P2: { sub: "Telugu",  tid: "T105" }, P3: { sub: "Science", tid: "T103" }, P4: { sub: "Social",  tid: "T104" }, P5: { sub: "N/A",     tid: ""     } },
      { day: "Thursday",  P1: { sub: "Science", tid: "T103" }, P2: { sub: "Math",    tid: "T101" }, P3: { sub: "English", tid: "T102" }, P4: { sub: "Computer",tid: "T106" }, P5: { sub: "Hindi",   tid: "T107" } },
      { day: "Friday",    P1: { sub: "Math",    tid: "T101" }, P2: { sub: "English", tid: "T102" }, P3: { sub: "Science", tid: "T103" }, P4: { sub: "Social",  tid: "T104" }, P5: { sub: "Games",   tid: "T108" } },
      { day: "Saturday",  P1: { sub: "Hindi",   tid: "T107" }, P2: { sub: "Telugu",  tid: "T105" }, P3: { sub: "Math",    tid: "T101" }, P4: { sub: "Computer",tid: "T106" }, P5: { sub: "Library", tid: "T109" } },
    ],
  };

  // WHY periods array?
  // Instead of writing P1, P2, P3, P4, P5 manually in JSX 6 times per row,
  // we loop over this array — cleaner code
  const periods = ["P1", "P2", "P3", "P4", "P5"];

  // WHY activeData?
  // Gets the correct class schedule based on which tab is active
  // If activeClass is "6A", this gives us the 6A timetable rows
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
            View weekly schedule for each class.
          </p>
        </div>

        {/* ── Timetable Card ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Card Header — title + class tab buttons */}
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Academic Timetable
              </h2>
              <p className="text-sm text-slate-500">
                Select a class to view the weekly schedule
              </p>
            </div>

            {/* WHY these buttons? Your HTML had radio + label tabs
                In React we replace that with simple onClick buttons
                When clicked they update activeClass state
                which re-renders the correct table below */}
            <div className="flex gap-2">
              {["6A", "6B"].map((cls) => (
                <button
                  key={cls}
                  onClick={() => setActiveClass(cls)}
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

          {/* Currently viewing label — same as your HTML's view-label div */}
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 text-sm text-blue-700 font-medium">
            Currently Viewing: <strong>Class 6_{activeClass}</strong>
          </div>

          {/* ── Timetable Table ── */}
          {/* WHY overflow-x-auto? On small screens table scrolls sideways */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-blue-600 text-white text-sm">
                  <th className="px-6 py-3 font-semibold">Day</th>
                  {/* WHY map periods? Renders P1 P2 P3 P4 P5 headers cleanly */}
                  {periods.map((p) => (
                    <th key={p} className="px-6 py-3 font-semibold">{p}</th>
                  ))}
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* WHY map activeData? Loops through each day row */}
                {activeData.map((row, i) => (
                  <tr
                    key={row.day}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    {/* Day name — bold like your HTML's .day class */}
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {row.day}
                    </td>

                    {/* WHY map periods again? Renders each period cell cleanly */}
                    {periods.map((p) => (
                      <td key={p} className="px-6 py-4">
                        {/* WHY two spans? Your HTML had .sub and .tid spans
                            sub = subject name, tid = teacher ID */}
                        <span className="block text-sm font-medium text-slate-800">
                          {row[p].sub}
                        </span>
                        {/* WHY conditional? If tid is empty (like N/A row) don't show it */}
                        {row[p].tid && (
                          <span className="block text-xs text-slate-400 mt-0.5">
                            {row[p].tid}
                          </span>
                        )}
                      </td>
                    ))}

                    {/* Actions — Edit and Delete buttons like your HTML */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* WHY these buttons? Your HTML had bx-edit and bx-trash icons */}
                        <button className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors">
                          ✏️ Edit
                        </button>
                        <button className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
                          🗑️ Delete
                        </button>
                      </div>
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