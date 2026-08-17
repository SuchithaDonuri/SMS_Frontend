// src/pages/student/Remarks.jsx

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import { getRemarks } from "../../api/flaskApi";

function Remarks() {
  const { user } = useAuth();
  const [remarks,  setRemarks]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    async function fetchRemarks() {
      try {
        const data = await getRemarks(user.id);
        if (data.success) {
          setRemarks(data.remarks);
        } else {
          setError("Failed to load remarks.");
        }
      } catch (err) {
        setError("Cannot connect to server.");
      } finally {
        setLoading(false);
      }
    }
    fetchRemarks();
  }, [user.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">

        <section className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Student Remarks</h2>
          <p className="text-slate-500 text-sm mt-1">Your remarks and feedback from teachers</p>
        </section>

        {loading && (
          <p className="text-center text-slate-500 py-12">Loading remarks...</p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <section className="space-y-4">
            {remarks.length === 0 ? (
              <p className="text-center text-slate-400 py-12">No remarks found.</p>
            ) : (
              remarks.map((r) => (
                <div key={r.id} className="rounded-2xl border p-6 bg-white border-gray-200">
                  <p className="text-xs text-slate-400 mb-2">{r.date}</p>
                  <p className="text-sm text-slate-600">{r.remark}</p>
                </div>
              ))
            )}
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