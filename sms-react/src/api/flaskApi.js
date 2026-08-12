// src/api/flaskApi.js

// WHY this constant? If Flask URL changes, we only update it here
// not in every single component
const BASE_URL = "http://localhost:5000/api";

// ── LOGIN ──
// WHY async? API calls take time — async/await waits for response
export async function loginUser(id, password, role) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    // WHY Content-Type? Tells Flask we are sending JSON data
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, password, role }),
  });
  const data = await response.json();
  return data;
}

// ── MARKS ──
export async function getMarks(studentId) {
  const response = await fetch(`${BASE_URL}/marks/${studentId}`);
  const data = await response.json();
  return data;
}

export async function addMarks(marksData) {
  const response = await fetch(`${BASE_URL}/marks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(marksData),
  });
  const data = await response.json();
  return data;
}

// ── ATTENDANCE ──
export async function getAttendance(studentId) {
  const response = await fetch(`${BASE_URL}/attendance/${studentId}`);
  const data = await response.json();
  return data;
}

export async function addAttendance(attendanceData) {
  const response = await fetch(`${BASE_URL}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(attendanceData),
  });
  const data = await response.json();
  return data;
}

// ── REMARKS ──
export async function getRemarks(studentId) {
  const response = await fetch(`${BASE_URL}/remarks/${studentId}`);
  const data = await response.json();
  return data;
}

export async function addRemark(remarkData) {
  const response = await fetch(`${BASE_URL}/remarks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(remarkData),
  });
  const data = await response.json();
  return data;
}