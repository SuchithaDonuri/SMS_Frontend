// src/pages/LoginPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/flaskApi";

function LoginPage() {
  // ── Login form states ──
  const [role,     setRole]     = useState("");
  const [userId,   setUserId]   = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading,  setLoading]  = useState(false);

  // ── Inquiry form states ──
  // WHY separate states? Inquiry form is completely independent from login form
  const [inquiryName,    setInquiryName]    = useState("");
  const [inquiryEmail,   setInquiryEmail]   = useState("");
  const [inquiryPhone,   setInquiryPhone]   = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySent,    setInquirySent]    = useState(false);

  const navigate  = useNavigate();
  const { login } = useAuth();

  // ── Scrolling ticker announcements ──
  // WHY array? Multiple announcements scroll one after another
  const announcements = [
    "🎓 Admissions Open for Academic Year 2026-27 — Apply Now!",
    "📢 Annual Day Celebration on 15th August 2026 — All Are Welcome!",
    "🏆 Our Students Scored 100% in Board Exams — Congratulations!",
    "📚 New Computer Lab Inaugurated — State of the Art Facilities!",
    "🌟 Scholarship Exam on 1st September — Register Before 20th August!",
    "🎨 Inter-School Art Competition — Registrations Open!",
  ];

  // ── Login submit handler ──
  async function handleLoginSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    if (!role || !userId || !password) {
      setErrorMsg("Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(userId, password, role);
      if (result.success) {
        login(result.user,result.token);
        if (role === "Principal")    navigate("/principal/dashboard");
        else if (role === "Teacher") navigate("/teacher/dashboard");
        else if (role === "Student") navigate("/student/dashboard");
        else if (role === "Parent")  navigate("/parent/dashboard");
      } else {
        setErrorMsg("Invalid credentials ❌");
      }
    } catch (err) {
      setErrorMsg("Cannot connect to server ❌");
    } finally {
      setLoading(false);
    }
  }

  // ── Inquiry submit handler ──
  function handleInquirySubmit(e) {
    e.preventDefault();
    // WHY setInquirySent? Shows success message after form submit
    // In real app this would call a Flask API to save the inquiry
    setInquirySent(true);
    setInquiryName("");
    setInquiryEmail("");
    setInquiryPhone("");
    setInquiryMessage("");
  }

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── TOP BAR ── */}
      {/* WHY top bar? Real school websites show quick contact info at very top */}
      <div className="bg-blue-900 text-white text-sm py-2 px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-6">
          <span>📞 +91 98765 43210</span>
          <span>✉️ info@smsinternational.edu.in</span>
        </div>
        <div className="flex items-center gap-4">
          <span>📍 Hyderabad, Telangana</span>
          <span>🕘 Mon–Sat: 8:00 AM – 4:00 PM</span>
        </div>
      </div>

      {/* ── NAVBAR ── */}
      {/* WHY navbar? Navigation between sections of the page */}
      <nav className="bg-white shadow-md py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-50">
        {/* Logo + School Name */}
        <div className="flex items-center gap-3">
          {/* WHY this div as logo? Placeholder — replace with real school logo image */}
          <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
            SMS
          </div>
          <div>
            <h1 className="text-xl font-bold text-blue-900 leading-tight">
              SMS International School
            </h1>
            <p className="text-xs text-slate-500 italic">
              Where Knowledge Meets Excellence
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-6 text-sm font-medium text-slate-700">
          <a href="#home"    className="hover:text-blue-700 transition-colors">Home</a>
          <a href="#about"   className="hover:text-blue-700 transition-colors">About</a>
          <a href="#features"className="hover:text-blue-700 transition-colors">Features</a>
          <a href="#contact" className="hover:text-blue-700 transition-colors">Contact</a>
          <a href="#login"   className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-4 py-2 rounded-lg transition-colors">
            Portal Login
          </a>
        </div>
      </nav>

      {/* ── TICKER — Scrolling Announcements ── */}
      {/* WHY ticker? Real school websites always have scrolling announcements
          like admission notices, exam dates, achievements */}
      <div className="bg-blue-700 text-white py-2 flex items-center overflow-hidden">
        <span className="bg-yellow-400 text-blue-900 font-bold px-4 py-1 text-sm whitespace-nowrap mr-4">
          📢 NOTICE
        </span>
        {/* WHY this animation? CSS keyframe animation scrolls text from right to left
            like a news ticker on TV */}
        <div className="overflow-hidden flex-1">
          <p
            className="whitespace-nowrap text-sm animate-marquee"
            style={{
              display: "inline-block",
              animation: "marquee 30s linear infinite",
            }}
          >
            {/* WHY join with separator? Combines all announcements into one long string */}
            {announcements.join("   ✦   ")}
          </p>
        </div>
      </div>

      {/* WHY style tag? Tailwind doesn't have a built-in marquee animation
          so we write a custom CSS keyframe animation here */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      {/* ── HERO SECTION ── */}
      {/* WHY id="home"? Navbar "Home" link scrolls here */}
      <section
        id="home"
        className="relative min-h-[90vh] flex items-center"
        style={{
          // WHY this background? Beautiful gradient that looks like a school
          // To use a real image replace this with:
          // backgroundImage: "url('/your-school-image.jpg')",
          // backgroundSize: "cover",
          // backgroundPosition: "center",
          background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 40%, #0369a1 70%, #0c4a6e 100%)",
        }}
      >
        {/* WHY overlay div? Darkens background so text is readable over image */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left side — School welcome text */}
          <div className="text-white">
            <p className="text-yellow-400 font-semibold text-lg mb-2 tracking-wide">
              Welcome to
            </p>
            <h2 className="text-5xl font-extrabold leading-tight mb-4">
              SMS International School
            </h2>
            <p className="text-blue-100 text-xl italic mb-6">
              "Where Knowledge Meets Excellence"
            </p>
            <p className="text-blue-100 text-base leading-relaxed mb-8 max-w-lg">
              Providing world-class education with a focus on holistic development,
              academic excellence, and character building since 2005. Affiliated to
              CBSE Board, Hyderabad.
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: "2000+", label: "Students" },
                { value: "150+",  label: "Faculty" },
                { value: "20+",   label: "Years" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
                >
                  <p className="text-2xl font-bold text-yellow-400">{stat.value}</p>
                  <p className="text-blue-100 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side — Login form */}
          {/* WHY id="login"? Navbar "Portal Login" button scrolls here */}
          <div id="login" className="bg-white rounded-2xl shadow-2xl p-8">

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">SMS</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">
                Login Portal
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Sign in to access your dashboard
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">

              {/* Role dropdown */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Select Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="" disabled>Choose your role...</option>
                  <option value="Principal">👨‍💼 Principal</option>
                  <option value="Teacher">👩‍🏫 Teacher</option>
                  <option value="Student">🎓 Student</option>
                  <option value="Parent">👨‍👩‍👧 Parent</option>
                </select>
              </div>

              {/* User ID */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  placeholder="Enter your User ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Error */}
              {errorMsg && (
                <p className="text-red-500 text-sm text-center">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm"
              >
                {loading ? "Signing in..." : "Login to Portal →"}
              </button>

            </form>

            <p className="text-center text-xs text-slate-400 mt-4">
              Having trouble? Contact admin at info@smsinternational.edu.in
            </p>
          </div>

        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section id="about" className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">
              About Our School
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              SMS International School has been shaping young minds for over
              20 years with a commitment to academic excellence and holistic
              development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🏫", title: "CBSE Affiliated",   desc: "Recognized by Central Board of Secondary Education" },
              { icon: "🔬", title: "Modern Labs",        desc: "State-of-the-art Science and Computer laboratories" },
              { icon: "🏆", title: "Award Winning",      desc: "Best School Award by State Government 2024" },
              { icon: "🌱", title: "Holistic Growth",    desc: "Sports, Arts, Music alongside academics" },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-16 bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Our Student Management Portal
            </h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              A complete digital solution for students, teachers, parents and
              school administration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "📊", role: "Students",  desc: "View marks, attendance, timetable and teacher remarks" },
              { icon: "👩‍🏫", role: "Teachers", desc: "Update marks, attendance, timetable and give remarks" },
              { icon: "👨‍💼", role: "Principal", desc: "Monitor all students, teachers and academic records" },
              { icon: "👨‍👩‍👧", role: "Parents",  desc: "Track your child's academic progress and attendance" },
            ].map((item) => (
              <div
                key={item.role}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center hover:bg-white/20 transition-colors"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-yellow-400 mb-2 text-lg">{item.role}</h3>
                <p className="text-blue-100 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT + INQUIRY SECTION ── */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">
              Contact & Inquiry
            </h2>
            <p className="text-slate-500">
              Have questions? We are happy to help you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Left — Contact Info */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-bold text-slate-800">
                Get In Touch
              </h3>

              {[
                { icon: "📞", label: "Phone",   value: "+91 98765 43210" },
                { icon: "✉️", label: "Email",   value: "info@smsinternational.edu.in" },
                { icon: "📍", label: "Address", value: "123, Education Lane, Hyderabad, Telangana — 500001" },
                { icon: "🕘", label: "Hours",   value: "Monday to Saturday: 8:00 AM – 4:00 PM" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">{item.label}</p>
                    <p className="text-slate-500 text-sm">{item.value}</p>
                  </div>
                </div>
              ))}

              {/* Admissions box */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mt-2">
                <h4 className="font-bold text-yellow-800 mb-2">
                  🎓 Admissions Open 2026-27
                </h4>
                <p className="text-yellow-700 text-sm leading-relaxed">
                  Admissions are currently open for Classes Nursery to Grade 10.
                  Limited seats available. Contact us today to secure your child's
                  future!
                </p>
                <p className="text-yellow-800 font-semibold text-sm mt-3">
                  📞 Admissions Helpline: +91 98765 43211
                </p>
              </div>
            </div>

            {/* Right — Inquiry Form */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                Send an Inquiry
              </h3>

              {inquirySent ? (
                // WHY conditional render? Shows success message after form submit
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✅</div>
                  <h4 className="text-xl font-bold text-green-700 mb-2">
                    Inquiry Sent Successfully!
                  </h4>
                  <p className="text-slate-500 text-sm">
                    Thank you! Our admissions team will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => setInquirySent(false)}
                    className="mt-6 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="flex flex-col gap-4">

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Message / Query
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Write your query here..."
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    Send Inquiry →
                  </button>

                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-blue-900 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-blue-900 font-bold">
              SMS
            </div>
            <div>
              <p className="font-bold">SMS International School</p>
              <p className="text-blue-300 text-xs">Where Knowledge Meets Excellence</p>
            </div>
          </div>
          <p className="text-blue-300 text-sm">
            © 2026 SMS International School. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-blue-300">
            <span>📞 +91 98765 43210</span>
            <span>✉️ info@smsinternational.edu.in</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default LoginPage;