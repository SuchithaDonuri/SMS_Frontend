// src/components/DashboardCard.jsx

// WHY Link? Clicking the "View →" button navigates to the inner page without page reload
import { Link } from "react-router-dom";

// WHY props? So every dashboard (Student, Teacher, Principal, Parent)
// can reuse this same card with different icon, title, desc, and route
function DashboardCard({ icon, title, desc, to }) {
  return (
    // WHY hover:shadow-xl transition? Gives a lift effect on hover — professional feel
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8 flex flex-col items-center text-center gap-4">

      {/* WHY this blue circle div? Puts a soft background behind the icon — like real apps */}
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
        {icon}
      </div>

      {/* Card title */}
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>

      {/* Card description — lighter grey creates visual hierarchy */}
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>

      {/* WHY mt-auto? Pushes the button to the bottom of the card always */}
      {/* WHY w-full? Button stretches full card width — looks cleaner */}
      <Link
        to={to}
        className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors duration-200 block"
      >
        View →
      </Link>

    </div>
  );
}

export default DashboardCard;