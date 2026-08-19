// src/pages/principal/ClassView.jsx

import { useState } from "react";
import Navbar from "../../components/Navbar";
import {
  getStudentsByClass,
  getMarksByClass,
  getAttendanceByClass,
  getRemarksByClass,
} from "../../api/flaskApi";

function ClassView() {
  // WHY hardcode these options? You currently only have Class 6, Sections A/B
  // in the database. Once more classes exist, this becomes a dropdown fed by
  // a real "list of classes" API instead of a fixed array.
  const classOptions = ["6"];
  const sectionOptions = ["A", "B"];

  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [remarks, setRemarks] = useState([]);
  const [searched, setSearched] = useState(false);

  async function handleView() {
    if (!className || !section) return;
    setLoading(true);
    setSearched(true);
    try {
      const [studentsRes, marksRes, attendanceRes, remarksRes] = await Promise.all([
        getStudentsByClass(className, section),
        getMarksByClass(className, section),
        getAttendanceByClass(className, section),
        getRemarksByClass(className, section),
      ]);
      setStudents(studentsRes.success ? studentsRes.students : []);
      setMarks(marksRes.success ? marksRes.marks : []);
      setAttendance(attendanceRes.success ? attendanceRes.attendance : []);
      setRemarks(remarksRes.success ? remarksRes.remarks : []);
    } catch (err) {
      console.error("Failed to load class data", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">

        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          View by Class & Section
        </h2>

        {/* ── Class + Section selectors ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="">Select class</option>
              {classOptions.map((c) => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="">Select section</option>
              {sectionOptions.map((s) => (
                <option key={s} value={s}>Section {s}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleView}
            disabled={!className || !section || loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Loading..." : "View"}
          </button>
        </div>

        {searched && !loading && (
          <div className="space-y-8">

            {/* Students */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-3">Students ({students.length})</h3>
              {students.length === 0 ? (
                <p className="text-sm text-slate-500">No students found in this class/section.</p>
              ) : (
                <ul className="text-sm text-slate-600 flex flex-wrap gap-2">
                  {students.map((s) => (
                    <li key={s.id} className="bg-slate-100 px-3 py-1 rounded-full">{s.id}</li>
                  ))}
                </ul>
              )}
            </section>

            {/* Marks */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-3">Marks</h3>
              {marks.length === 0 ? (
                <p className="text-sm text-slate-500">No marks recorded yet.</p>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-slate-500 border-b">
                      <th className="py-2">Student</th><th>Exam</th><th>Math</th><th>Physics</th><th>English</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((m, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2">{m.student_id}</td>
                        <td>{m.exam_type}</td><td>{m.math}</td><td>{m.physics}</td><td>{m.english}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            {/* Attendance */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-3">Attendance</h3>
              {attendance.length === 0 ? (
                <p className="text-sm text-slate-500">No attendance recorded yet.</p>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-slate-500 border-b">
                      <th className="py-2">Student</th><th>Subject</th><th>Status</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((a, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2">{a.student_id}</td>
                        <td>{a.subject}</td><td>{a.status}</td><td>{a.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            {/* Remarks */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-3">Remarks</h3>
              {remarks.length === 0 ? (
                <p className="text-sm text-slate-500">No remarks recorded yet.</p>
              ) : (
                <ul className="text-sm text-slate-600 space-y-2">
                  {remarks.map((r, i) => (
                    <li key={i} className="border-b pb-2 last:border-0">
                      <span className="font-medium">{r.student_id}:</span> {r.remark}
                      <span className="text-slate-400 ml-2">({r.date})</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

          </div>
        )}
      </main>
    </div>
  );
}

export default ClassView;