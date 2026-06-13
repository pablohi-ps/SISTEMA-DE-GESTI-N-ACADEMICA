import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ModuleDetail from './pages/ModuleDetail';
import AcademicRecord from './pages/AcademicRecord';
import FinancialStatus from './pages/FinancialStatus';
import VirtualClassroom from './pages/VirtualClassroom';
import TeacherEvaluation from './pages/TeacherEvaluation';
import FinancialReports from './pages/FinancialReports';
import TeacherGradebook from './pages/TeacherGradebook';
import TeacherAttendance from './pages/TeacherAttendance';
import TeacherClassroom from './pages/TeacherClassroom';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherSubjects from './pages/TeacherSubjects';
import TeacherAssignments from './pages/TeacherAssignments';
import TeacherExams from './pages/TeacherExams';
import TeacherForums from './pages/TeacherForums';
import TeacherReports from './pages/TeacherReports';
import StudentSchedule from './pages/StudentSchedule';
import StudentLibrary from './pages/StudentLibrary';
import StudentTutoring from './pages/StudentTutoring';
import MessagingCenter from './pages/MessagingCenter';
import { AnimatePresence } from 'framer-motion';

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/messages" element={<MessagingCenter />} />
          
          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/subjects" element={<TeacherSubjects />} />
          <Route path="/teacher/assignments" element={<TeacherAssignments />} />
          <Route path="/teacher/exams" element={<TeacherExams />} />
          <Route path="/teacher/forums" element={<TeacherForums />} />
          <Route path="/teacher/reports" element={<TeacherReports />} />
          <Route path="/teacher/grades" element={<TeacherGradebook />} />
          <Route path="/teacher/attendance" element={<TeacherAttendance />} />
          <Route path="/teacher/classroom" element={<TeacherClassroom />} />
          
          {/* Student/General Routes */}
          <Route path="/academic" element={<AcademicRecord />} />
          <Route path="/finance" element={<FinancialStatus />} />
          <Route path="/classrooms" element={<VirtualClassroom />} />
          <Route path="/evaluation" element={<TeacherEvaluation />} />
          <Route path="/admin/finance" element={<FinancialReports />} />
          <Route path="/schedule" element={<StudentSchedule />} />
          <Route path="/library" element={<StudentLibrary />} />
          <Route path="/tutoring" element={<StudentTutoring />} />
          <Route path="/module/:id" element={<ModuleDetail />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-sans antialiased">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}
