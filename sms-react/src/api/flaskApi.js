// src/api/flaskApi.js

const BASE_URL = "http://localhost:5000/api";

// ============================================================
// AUTH
// ============================================================

function authHeader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

// ============================================================
// LOGIN
// ============================================================

export async function loginUser(id, password, role) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      password,
      role,
    }),
  });

  return response.json();
}

// ============================================================
// STUDENT
// ============================================================

export async function getMarks(studentId) {
  const response = await fetch(
    `${BASE_URL}/student/marks/${studentId}`,
    {
      headers: authHeader(),
    }
  );

  return response.json();
}

export async function getAttendance(studentId) {
  const response = await fetch(
    `${BASE_URL}/student/attendance/${studentId}`,
    {
      headers: authHeader(),
    }
  );

  return response.json();
}

export async function getRemarks(studentId) {
  const response = await fetch(
    `${BASE_URL}/student/remarks/${studentId}`,
    {
      headers: authHeader(),
    }
  );

  return response.json();
}

export async function getStudentTimetable(className) {
  const response = await fetch(
    `${BASE_URL}/student/timetable/${className}`,
    {
      headers: authHeader(),
    }
  );

  return response.json();
}

// ============================================================
// TEACHER - MARKS
// ============================================================

export async function addMarks(marksData) {
  const response = await fetch(`${BASE_URL}/teacher/marks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(marksData),
  });

  return response.json();
}

export async function getAllMarks() {
  const response = await fetch(`${BASE_URL}/teacher/marks`, {
    headers: authHeader(),
  });

  return response.json();
}

// ============================================================
// TEACHER - ATTENDANCE
// ============================================================

export async function addAttendance(attendanceData) {
  const response = await fetch(`${BASE_URL}/teacher/attendance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(attendanceData),
  });

  return response.json();
}

export async function getAllAttendance() {
  const response = await fetch(`${BASE_URL}/teacher/attendance`, {
    headers: authHeader(),
  });

  return response.json();
}

// ============================================================
// TEACHER - REMARKS
// ============================================================

export async function addRemark(remarkData) {
  const response = await fetch(`${BASE_URL}/teacher/remarks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(remarkData),
  });

  return response.json();
}

export async function getAllRemarks() {
  const response = await fetch(`${BASE_URL}/teacher/remarks`, {
    headers: authHeader(),
  });

  return response.json();
}

// ============================================================
// TEACHER - TIMETABLE
// ============================================================

export async function getTimetable(className) {
  const response = await fetch(
    `${BASE_URL}/teacher/timetable/${className}`,
    {
      headers: authHeader(),
    }
  );

  return response.json();
}

export async function saveTimetableDay(dayData) {
  const response = await fetch(`${BASE_URL}/teacher/timetable`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(dayData),
  });

  return response.json();
}

export async function deleteTimetableDay(className, day) {
  const response = await fetch(
    `${BASE_URL}/teacher/timetable/${className}/${day}`,
    {
      method: "DELETE",
      headers: authHeader(),
    }
  );

  return response.json();
}

// ============================================================
// PRINCIPAL - DASHBOARD
// ============================================================

export async function getPrincipalDashboardSummary() {
  const response = await fetch(
    `${BASE_URL}/principal/dashboard-summary`,
    {
      headers: authHeader(),
    }
  );

  return response.json();
}

// ============================================================
// PRINCIPAL - CLASS / SECTION
// ============================================================

export async function getStudentsByClass(className, section) {
  const response = await fetch(
    `${BASE_URL}/principal/students/${className}/${section}`,
    {
      headers: authHeader(),
    }
  );

  return response.json();
}

export async function getMarksByClass(className, section) {
  const response = await fetch(
    `${BASE_URL}/principal/marks/${className}/${section}`,
    {
      headers: authHeader(),
    }
  );

  return response.json();
}

export async function getAttendanceByClass(className, section) {
  const response = await fetch(
    `${BASE_URL}/principal/attendance/${className}/${section}`,
    {
      headers: authHeader(),
    }
  );

  return response.json();
}

export async function getRemarksByClass(className, section) {
  const response = await fetch(
    `${BASE_URL}/principal/remarks/${className}/${section}`,
    {
      headers: authHeader(),
    }
  );

  return response.json();
}

// ============================================================
// PRINCIPAL - INDIVIDUAL STUDENT
// ============================================================

export async function getPrincipalStudentDetails(studentId) {
  const response = await fetch(
    `${BASE_URL}/principal/student/${studentId}`,
    {
      headers: authHeader(),
    }
  );

  return response.json();
}

export async function getPrincipalStudentMarks(studentId) {
  const response = await fetch(
    `${BASE_URL}/principal/student/${studentId}/marks`,
    {
      headers: authHeader(),
    }
  );

  return response.json();
}

export async function getPrincipalStudentAttendance(studentId) {
  const response = await fetch(
    `${BASE_URL}/principal/student/${studentId}/attendance`,
    {
      headers: authHeader(),
    }
  );

  return response.json();
}

export async function getPrincipalStudentRemarks(studentId) {
  const response = await fetch(
    `${BASE_URL}/principal/student/${studentId}/remarks`,
    {
      headers: authHeader(),
    }
  );

  return response.json();
}

export async function getPrincipalStudentTimetable(studentId) {
  const response = await fetch(
    `${BASE_URL}/principal/student/${studentId}/timetable`,
    {
      headers: authHeader(),
    }
  );

  return response.json();
}