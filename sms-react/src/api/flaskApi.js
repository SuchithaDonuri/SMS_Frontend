// src/api/flaskApi.js

// WHY this constant? If Flask URL changes, we only update it here
// not in every single component
const BASE_URL = "http://localhost:5000/api";

// WHY this helper? Reads the saved token from localStorage and builds the
// Authorization header Flask's @jwt_required() routes expect. If there's
// no token (not logged in), it returns an empty object so the request
// still goes out — Flask will just reject it with 401, which is correct.
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

// ── LOGIN ──
// WHY no authHeader here? Login is what CREATES the token — there's no
// token to attach yet at this point
export async function loginUser(id, password, role) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, password, role }),
  });
  const data = await response.json();
  return data;
}

// ── MARKS ──
export async function getMarks(studentId) {
  const response = await fetch(`${BASE_URL}/student/marks/${studentId}`, {
    headers: authHeader(),
  });
  const data = await response.json();
  return data;
}

export async function addMarks(marksData) {
  const response = await fetch(`${BASE_URL}/teacher/marks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(marksData),
  });
  const data = await response.json();
  return data;
}

export async function getAllMarks() {
  const response = await fetch(`${BASE_URL}/teacher/marks`, {
    headers: authHeader(),
  });
  const data = await response.json();
  return data;
}

// ── ATTENDANCE ──
export async function getAttendance(studentId) {
  const response = await fetch(`${BASE_URL}/student/attendance/${studentId}`, {
    headers: authHeader(),
  });
  const data = await response.json();
  return data;
}

export async function addAttendance(attendanceData) {
  const response = await fetch(`${BASE_URL}/teacher/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(attendanceData),
  });
  const data = await response.json();
  return data;
}

export async function getAllAttendance() {
  const response = await fetch(`${BASE_URL}/teacher/attendance`, {
    headers: authHeader(),
  });
  const data = await response.json();
  return data;
}

// ── REMARKS ──
export async function getRemarks(studentId) {
  const response = await fetch(`${BASE_URL}/student/remarks/${studentId}`, {
    headers: authHeader(),
  });
  const data = await response.json();
  return data;
}

export async function addRemark(remarkData) {
  const response = await fetch(`${BASE_URL}/teacher/remarks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(remarkData),
  });
  const data = await response.json();
  return data;
}

export async function getAllRemarks() {
  const response = await fetch(`${BASE_URL}/teacher/remarks`, {
    headers: authHeader(),
  });
  const data = await response.json();
  return data;
}

// ── TIMETABLE ──
export async function getTimetable(className) {
  const response = await fetch(`${BASE_URL}/teacher/timetable/${className}`, {
    headers: authHeader(),
  });
  return response.json();
}

export async function getStudentTimetable(className) {
  const response = await fetch(`${BASE_URL}/student/timetable/${className}`, {
    headers: authHeader(),
  });
  return response.json();
}

export async function saveTimetableDay(dayData) {
  const response = await fetch(`${BASE_URL}/teacher/timetable`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(dayData),
  });
  return response.json();
}

export async function deleteTimetableDay(className, day) {
  const response = await fetch(`${BASE_URL}/teacher/timetable/${className}/${day}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return response.json();
}

// ── PRINCIPAL: class/section filtered views ──
export async function getStudentsByClass(className, section) {
  const response = await fetch(`${BASE_URL}/principal/students/${className}/${section}`, {
    headers: authHeader(),
  });
  return response.json();
}

export async function getMarksByClass(className, section) {
  const response = await fetch(`${BASE_URL}/principal/marks/${className}/${section}`, {
    headers: authHeader(),
  });
  return response.json();
}

export async function getAttendanceByClass(className, section) {
  const response = await fetch(`${BASE_URL}/principal/attendance/${className}/${section}`, {
    headers: authHeader(),
  });
  return response.json();
}

export async function getRemarksByClass(className, section) {
  const response = await fetch(`${BASE_URL}/principal/remarks/${className}/${section}`, {
    headers: authHeader(),
  });
  return response.json();
}