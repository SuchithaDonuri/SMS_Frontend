// src/pages/student/Marks.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

import {
  getMarks,
  getPrincipalStudentMarks,
} from "../../api/flaskApi";


function Marks({ studentId, showNavbar = true }) {

  const { user } = useAuth();
  const navigate = useNavigate();

  // --------------------------------------------------
  // Which student's marks should we display?
  //
  // Student:
  // <Marks />
  // -> uses logged-in student's ID
  //
  // Principal:
  // <Marks studentId="S1001" />
  // -> uses selected student's ID
  // --------------------------------------------------

  const targetStudentId = studentId || user?.id;

  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // --------------------------------------------------
  // Fetch marks
  // --------------------------------------------------

  useEffect(() => {

    async function fetchMarks() {

      if (!targetStudentId) {
        setError("Student ID not available.");
        setLoading(false);
        return;
      }

      try {

        let data;

        // Principal viewing another student
        if (studentId) {

          data = await getPrincipalStudentMarks(
            targetStudentId
          );

        }

        // Student viewing their own marks
        else {

          data = await getMarks(
            targetStudentId
          );

        }


        if (data.success) {

          setMarks(data.marks || []);

        } else {

          setError(
            data.message || "Failed to load marks."
          );

        }

      } catch (err) {

        console.error(
          "Failed to load marks:",
          err
        );

        setError(
          "Cannot connect to server."
        );

      } finally {

        setLoading(false);

      }
    }


    fetchMarks();

  }, [targetStudentId, studentId]);


  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {

    return (
      <>
        {showNavbar && <Navbar />}

        <main className="max-w-5xl mx-auto px-6 py-8">

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

            <p className="text-slate-500">
              Loading marks...
            </p>

          </div>

        </main>
      </>
    );
  }


  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error) {

    return (
      <>
        {showNavbar && <Navbar />}

        <main className="max-w-5xl mx-auto px-6 py-8">

          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

            <p className="text-red-600">
              {error}
            </p>

          </div>

        </main>
      </>
    );
  }


  // --------------------------------------------------
  // Marks UI
  // --------------------------------------------------

  return (
    <>

      {/* Student page gets Navbar.
          Principal page already has Navbar. */}

      {showNavbar && <Navbar />}


      <main className="max-w-5xl mx-auto px-6 py-8">


        {/* -------------------------------------------- */}
        {/* Student page back button                     */}
        {/* -------------------------------------------- */}

        {!studentId && (
          <button
            onClick={() =>
              navigate("/student/dashboard")
            }
            className="
              mb-6
              text-blue-600
              hover:text-blue-800
              text-sm
              font-medium
              cursor-pointer
            "
          >
            ← Back to Dashboard
          </button>
        )}


        {/* -------------------------------------------- */}
        {/* Heading                                      */}
        {/* -------------------------------------------- */}

        <div className="mb-8">

          <h2 className="text-2xl font-bold text-slate-800">
            📊 Marks
          </h2>

          <p className="text-slate-500 text-sm mt-1">
            Academic examination results
          </p>

          {studentId && (
            <p className="text-sm text-slate-500 mt-2">
              Student ID:

              <span className="font-semibold text-slate-800 ml-1">
                {targetStudentId}
              </span>
            </p>
          )}

        </div>


        {/* -------------------------------------------- */}
        {/* Download Report                              */}
        {/* -------------------------------------------- */}

        <div className="flex justify-end mb-4">

          <button
            onClick={() => window.print()}
            className="
              px-4
              py-2.5
              bg-blue-600
              hover:bg-blue-700
              text-white
              rounded-lg
              text-sm
              font-medium
              transition
              cursor-pointer
            "
          >
            ↓ Download Report
          </button>

        </div>


        {/* -------------------------------------------- */}
        {/* Marks Table                                  */}
        {/* -------------------------------------------- */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="bg-blue-600 text-white text-sm">

                  <th className="px-6 py-4">
                    Exam Type
                  </th>

                  <th className="px-6 py-4">
                    Math
                  </th>

                  <th className="px-6 py-4">
                    Physics
                  </th>

                  <th className="px-6 py-4">
                    English
                  </th>

                  <th className="px-6 py-4">
                    Average
                  </th>

                </tr>

              </thead>


              <tbody>

                {marks.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="
                        px-6
                        py-10
                        text-center
                        text-slate-400
                      "
                    >
                      No marks found.
                    </td>

                  </tr>

                ) : (

                  marks.map((row, index) => {

                    const math =
                      Number(row.math) || 0;

                    const physics =
                      Number(row.physics) || 0;

                    const english =
                      Number(row.english) || 0;


                    const average = Math.round(
                      (math + physics + english) / 3
                    );


                    return (
                      <tr
                        key={row.id || index}
                        className={`
                          border-b
                          border-slate-100
                          ${
                            index % 2 === 0
                              ? "bg-white"
                              : "bg-slate-50"
                          }
                        `}
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
                            className="
                              bg-blue-100
                              text-blue-700
                              font-bold
                              px-3
                              py-1
                              rounded-full
                              text-sm
                            "
                          >
                            {average}%
                          </span>

                        </td>

                      </tr>
                    );

                  })

                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>


      {/* Footer only on Student page */}

      {!studentId && (
        <footer className="text-center text-sm text-gray-500 py-6">
          © 2026 Student Management System
        </footer>
      )}

    </>
  );
}


export default Marks;