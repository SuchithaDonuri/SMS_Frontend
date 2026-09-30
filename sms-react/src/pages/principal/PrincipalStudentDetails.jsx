// src/pages/principal/PrincipalStudentDetails.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getPrincipalStudentMarks } from "../../api/flaskApi";

function PrincipalStudentDetails() {
  const { studentId } = useParams();

  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMarks() {
      try {
        setLoading(true);
        setError("");

        const data = await getPrincipalStudentMarks(studentId);

        if (data.success) {
          setMarks(data.marks || []);
        } else {
          setError(data.message || "Failed to load student marks.");
        }
      } catch (err) {
        console.error("Principal student marks error:", err);
        setError("Cannot connect to server.");
      } finally {
        setLoading(false);
      }
    }

    if (studentId) {
      loadMarks();
    }
  }, [studentId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600 mb-2">
            Student Academic Record
          </p>

          <h1 className="text-3xl font-bold text-slate-800">
            Student {studentId}
          </h1>

          <p className="text-slate-500 mt-2">
            Academic examination results
          </p>
        </div>

        {/* Marks Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Section Header */}
          <div className="px-6 py-6 border-b border-slate-200 flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                📊 Marks
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Examination results for student {studentId}
              </p>
            </div>

          </div>

          {/* Loading */}
          {loading && (
            <div className="px-6 py-16 text-center">
              <p className="text-slate-500">
                Loading marks...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="px-6 py-12">
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <p className="text-red-600 font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Marks Table */}
          {!loading && !error && (
            <>
              {marks.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <p className="text-slate-400">
                    No marks found for this student.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">

                    <thead className="bg-slate-800 text-white">
                      <tr>
                        <th className="px-6 py-4 text-sm font-semibold">
                          Exam Type
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold">
                          Math
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold">
                          Physics
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold">
                          English
                        </th>

                        <th className="px-6 py-4 text-sm font-semibold">
                          Average
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {marks.map((row, index) => {

                        const math = Number(row.math) || 0;
                        const physics = Number(row.physics) || 0;
                        const english = Number(row.english) || 0;

                        const average = Math.round(
                          (math + physics + english) / 3
                        );

                        return (
                          <tr
                            key={row.id || index}
                            className={
                              index % 2 === 0
                                ? "bg-white"
                                : "bg-slate-50"
                            }
                          >

                            <td className="px-6 py-4 font-medium text-slate-800">
                              {row.exam_type}
                            </td>

                            <td className="px-6 py-4 text-slate-600">
                              {math}
                            </td>

                            <td className="px-6 py-4 text-slate-600">
                              {physics}
                            </td>

                            <td className="px-6 py-4 text-slate-600">
                              {english}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                                  average >= 75
                                    ? "bg-green-100 text-green-700"
                                    : average >= 50
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {average}%
                              </span>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>

                  </table>
                </div>
              )}
            </>
          )}

        </section>

      </main>

      <footer className="text-center text-sm text-slate-400 py-8">
        © 2026 Student Management System
      </footer>
    </div>
  );
}

export default PrincipalStudentDetails;