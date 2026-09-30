import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getStudentsByClass } from "../../api/flaskApi";

function ClassView() {

  const navigate = useNavigate();

  const classOptions = ["6"];
  const sectionOptions = ["A", "B"];

  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");


  async function handleView() {

    if (!className || !section) {
      return;
    }

    setLoading(true);
    setSearched(true);
    setError("");

    try {

      const response = await getStudentsByClass(
        className,
        section
      );

      if (response.success) {

        setStudents(response.students);

      } else {

        setStudents([]);
        setError(
          response.message || "Failed to load students."
        );
      }

    } catch (error) {

      console.error(error);

      setStudents([]);

      setError(
        "Cannot connect to server."
      );

    } finally {

      setLoading(false);
    }
  }


  function handleStudentClick(studentId) {

    navigate(
      `/principal/student/${studentId}`
    );
  }


  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">

        <div className="mb-8">

          <h1 className="text-2xl font-bold text-slate-800">
            Class & Section
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Select a class and section to view students.
          </p>

        </div>


        {/* FILTERS */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Class
              </label>

              <select
                value={className}
                onChange={(e) =>
                  setClassName(e.target.value)
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >

                <option value="">
                  Select class
                </option>

                {classOptions.map((item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    Class {item}
                  </option>

                ))}

              </select>

            </div>


            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Section
              </label>

              <select
                value={section}
                onChange={(e) =>
                  setSection(e.target.value)
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >

                <option value="">
                  Select section
                </option>

                {sectionOptions.map((item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    Section {item}
                  </option>

                ))}

              </select>

            </div>


            <button
              onClick={handleView}
              disabled={
                !className ||
                !section ||
                loading
              }
              className="w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >

              {loading
                ? "Loading..."
                : "View Students"}

            </button>

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">

            <p className="text-sm text-red-600">
              {error}
            </p>

          </div>

        )}


        {/* RESULTS */}

        {searched && !loading && (

          <section className="mt-8">

            <div className="flex items-center justify-between mb-4">

              <div>

                <h2 className="text-lg font-semibold text-slate-800">

                  Class {className} — Section {section}

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  {students.length} student
                  {students.length !== 1
                    ? "s"
                    : ""}

                </p>

              </div>

            </div>


            {students.length === 0 ? (

              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">

                <p className="text-sm text-slate-500">
                  No students found in this class and section.
                </p>

              </div>

            ) : (

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                <table className="w-full text-sm">

                  <thead className="bg-slate-50 border-b border-slate-200">

                    <tr className="text-left text-slate-500">

                      <th className="px-6 py-4 font-medium">
                        Student ID
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Class
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Section
                      </th>

                      <th className="px-6 py-4 font-medium text-right">
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {students.map((student) => (

                      <tr
                        key={student.id}
                        className="border-b last:border-b-0 border-slate-100 hover:bg-slate-50 transition"
                      >

                        <td className="px-6 py-4 font-medium text-slate-800">
                          {student.id}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          Class {className}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          Section {section}
                        </td>

                        <td className="px-6 py-4 text-right">

                          <button
                            onClick={() =>
                              handleStudentClick(
                                student.id
                              )
                            }
                            className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition cursor-pointer"
                          >
                            View Student
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        )}

      </main>

    </div>
  );
}

export default ClassView;