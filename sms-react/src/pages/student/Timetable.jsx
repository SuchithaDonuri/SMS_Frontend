import Navbar from "../../components/Navbar";

const timetable = [
  { day:"Monday",    p1:"Mathematics (Mr. Smith)",  p2:"Science (Ms. Johnson)", p3:"English (Mrs. Lee)",    p4:"—",                     p5:"—" },
  { day:"Tuesday",   p1:"English (Ms. Johnson)",    p2:"Social (Ms. Johnson)",  p3:"Computer (Mr. Davis)",  p4:"Science (Ms. Johnson)", p5:"Hindi (Mr. Wilson)" },
  { day:"Wednesday", p1:"Science (Ms. Johnson)",    p2:"Math (Mr. Smith)",      p3:"English (Ms. Johnson)", p4:"Telugu (Mr. Lee)",      p5:"Social (Ms. Johnson)" },
  { day:"Thursday",  p1:"Math (Mr. Smith)",         p2:"Computer (Mr. Davis)",  p3:"Science (Ms. Johnson)", p4:"English (Ms. Johnson)", p5:"Hindi (Mr. Wilson)" },
  { day:"Friday",    p1:"English (Ms. Johnson)",    p2:"Math (Mr. Smith)",      p3:"Social (Ms. Johnson)",  p4:"Science (Ms. Johnson)", p5:"Maths (Mr. Smith)" },
  { day:"Saturday",  p1:"Telugu (Mr. Lee)",         p2:"Hindi (Mr. Wilson)",    p3:"Computer (Mr. Davis)",  p4:"Math (Mr. Smith)",      p5:"Library (Ms. Taylor)" },
];

function Timetable() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100
                    via-blue-50 to-slate-200">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8">

        <section className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Class Timetable</h2>
          <p className="text-slate-500 text-sm mt-1">Your weekly class schedule</p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border
                            border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-white">
              <tr>
                {["Day","Period 1","Period 2","Period 3","Period 4","Period 5"].map(h => (
                  <th key={h} className="px-4 py-4 text-left font-semibold text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timetable.map((row, i) => (
                <tr key={row.day}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-4 py-4 font-semibold text-slate-800">{row.day}</td>
                  {[row.p1,row.p2,row.p3,row.p4,row.p5].map((p, j) => (
                    <td key={j} className="px-4 py-4 text-slate-600 text-xs leading-relaxed">
                      {p}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        © 2026 Student Management System
      </footer>
    </div>
  );
}

export default Timetable;