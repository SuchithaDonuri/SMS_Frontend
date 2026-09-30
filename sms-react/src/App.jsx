// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
// Student pages
import StudentDashboard  from './pages/StudentDashboard'
import StudentMarks      from './pages/student/Marks'
import StudentAttendance from './pages/student/Attendance'
import StudentTimetable  from './pages/student/Timetable'
import StudentRemarks from './pages/student/Remarks'
import PrincipalDashboard from './pages/principal/PrincipalDashboard'
import PrincipalStudentDetails from './pages/principal/PrincipalStudentDetails'
import ParentDashboard from './pages/parent/ParentDashboard'
import ClassView from './pages/principal/ClassView'


// Teacher pages
import TeacherDashboard  from './pages/teacher/TeacherDashboard'
import TeacherAttendance from './pages/teacher/Attendance'
import TeacherMarks from './pages/teacher/Marks'
import TeacherRemarks from './pages/teacher/Remarks'
import TeacherTimetable from './pages/teacher/Timetable'
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Login — public, anyone can access */}
          <Route path="/" element={<LoginPage />} />

          {/* ── Student Routes ── */}
          {/* WHY /student/dashboard? LoginPage navigates here after Student login */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute allowedRole="Student">
              <StudentDashboard />
            </ProtectedRoute>
          }/>

          <Route path="/student/marks" element={
            <ProtectedRoute allowedRole="Student"><StudentMarks /></ProtectedRoute>
          }/>
          <Route path="/student/attendance" element={
            <ProtectedRoute allowedRole="Student"><StudentAttendance /></ProtectedRoute>
          }/>
          <Route path="/student/timetable" element={
            <ProtectedRoute allowedRole="Student"><StudentTimetable /></ProtectedRoute>
          }/>
          <Route path="/student/remarks" element={
            <ProtectedRoute allowedRole="Student"><StudentRemarks /></ProtectedRoute>
          }/>

          {/* ── Teacher Routes ── */}
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute allowedRole="Teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          <Route path="/teacher/attendance" element={
            <ProtectedRoute allowedRole="Teacher">
              <TeacherAttendance />
            </ProtectedRoute>
          } />
          <Route path="/teacher/marks" element={
          <ProtectedRoute allowedRole="Teacher">
            <TeacherMarks />
          </ProtectedRoute>
        }/>
        <Route path="/teacher/remarks" element={
          <ProtectedRoute allowedRole="Teacher">
            <TeacherRemarks />
          </ProtectedRoute>
        } />
        <Route path="/teacher/timetable" element={
          <ProtectedRoute allowedRole={["Teacher","Principal"]}>
            <TeacherTimetable />
          </ProtectedRoute>
        } />

        {/* Principal Routes */}
        <Route path="/principal/dashboard" element={
          <ProtectedRoute allowedRole="Principal">
            <PrincipalDashboard />
          </ProtectedRoute>
        }/>

        {/* ── Parent Routes ── */}
        {/* WHY reuse student pages? Parent sees same data as student */}
        <Route path="/parent/dashboard" element={
          <ProtectedRoute allowedRole="Parent">
            <ParentDashboard />
          </ProtectedRoute>
        }/>

        {/* WHY allowedRoles array? Both Student AND Parent can see these pages */}
        <Route path="/parent/marks" element={
          <ProtectedRoute allowedRoles={["Student", "Parent"]}>
            <StudentMarks />
          </ProtectedRoute>
        }/>

        <Route path="/parent/attendance" element={
          <ProtectedRoute allowedRoles={["Student", "Parent"]}>
            <StudentAttendance />
          </ProtectedRoute>
        }/>

        <Route path="/parent/remarks" element={
          <ProtectedRoute allowedRoles={["Student", "Parent"]}>
            <StudentRemarks />
          </ProtectedRoute>
        }/>
        <Route path="/principal/class-view" element={
        <ProtectedRoute allowedRole="Principal">
          <ClassView />
        </ProtectedRoute>
        
        
      }/>
      <Route path="/principal/student/:studentId" element={
        <ProtectedRoute allowedRole="Principal">
          <PrincipalStudentDetails />
        </ProtectedRoute>}
      />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App