import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Role } from '../types';

// Layouts
import AppShell from '../components/layout/AppShell';

// Auth Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';

// App Pages
import Dashboard from '../pages/Dashboard';
import Chat from '../pages/Chat';
import Timetable from '../pages/Timetable';
import Notices from '../pages/Notices';
import Documents from '../pages/Documents';
import Downloads from '../pages/Downloads';
import Syllabus from '../pages/Syllabus';
import ExamSchedules from '../pages/ExamSchedules';
import StudyPlan from '../pages/StudyPlan';
import NotesGenerator from '../pages/NotesGenerator';
import CreditSystem from '../pages/CreditSystem';
import Faculty from '../pages/Faculty';
import Placements from '../pages/Placements';
import Admin from '../pages/Admin';
import Evaluation from '../pages/Evaluation';
import Settings from '../pages/Settings';
import Help from '../pages/Help';
import NotFound from '../pages/NotFound';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/app/dashboard" replace />;
  return <>{children}</>;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

      {/* Protected */}
      <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="chat" element={<Chat />} />
        <Route path="chat/:convId" element={<Chat />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="notices" element={<Notices />} />
        <Route path="documents" element={<Documents />} />
        <Route path="downloads" element={<Downloads />} />
        <Route path="syllabus" element={<Syllabus />} />
        <Route path="exam-schedules" element={<ExamSchedules />} />
        <Route path="study-plan" element={<StudyPlan />} />
        <Route path="notes-generator" element={<NotesGenerator />} />
        <Route path="credit-system" element={<CreditSystem />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="placements" element={<Placements />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="evaluation"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Evaluation />
            </ProtectedRoute>
          }
        />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
