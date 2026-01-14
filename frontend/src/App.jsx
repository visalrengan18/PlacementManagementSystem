import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/common/Navbar';
import Notification from './components/common/Notification';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Seeker Pages
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import JobSwipe from './pages/seeker/JobSwipe';
import SeekerProfile from './pages/seeker/SeekerProfile';
import Applications from './pages/seeker/Applications';
import SeekerMatches from './pages/seeker/SeekerMatches';

// Company Pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import PostJob from './pages/company/PostJob';
import ManageJobs from './pages/company/ManageJobs';
import ApplicantSwipe from './pages/company/ApplicantSwipe';
import CompanyMatches from './pages/company/CompanyMatches';
import CompanyProfile from './pages/company/CompanyProfile';

// Chat Pages
import ChatList from './pages/chat/ChatList';
import ChatWindow from './pages/chat/ChatWindow';

import './styles/global.css';
import './styles/components.css';

const HomeRedirect = () => {
  const { isAuthenticated, isSeeker, isCompany } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isSeeker) return <Navigate to="/seeker/dashboard" replace />;
  if (isCompany) return <Navigate to="/company/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="app">
            <Navbar />
            <Notification />
            <Routes>
              {/* Home */}
              <Route path="/" element={<HomeRedirect />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Seeker Routes */}
              <Route path="/seeker/dashboard" element={<ProtectedRoute requiredRole="SEEKER"><SeekerDashboard /></ProtectedRoute>} />
              <Route path="/seeker/jobs" element={<ProtectedRoute requiredRole="SEEKER"><JobSwipe /></ProtectedRoute>} />
              <Route path="/seeker/profile" element={<ProtectedRoute requiredRole="SEEKER"><SeekerProfile /></ProtectedRoute>} />
              <Route path="/seeker/applications" element={<ProtectedRoute requiredRole="SEEKER"><Applications /></ProtectedRoute>} />
              <Route path="/seeker/matches" element={<ProtectedRoute requiredRole="SEEKER"><SeekerMatches /></ProtectedRoute>} />

              {/* Company Routes */}
              <Route path="/company/dashboard" element={<ProtectedRoute requiredRole="COMPANY"><CompanyDashboard /></ProtectedRoute>} />
              <Route path="/company/post-job" element={<ProtectedRoute requiredRole="COMPANY"><PostJob /></ProtectedRoute>} />
              <Route path="/company/jobs" element={<ProtectedRoute requiredRole="COMPANY"><ManageJobs /></ProtectedRoute>} />
              <Route path="/company/applicants/:jobId" element={<ProtectedRoute requiredRole="COMPANY"><ApplicantSwipe /></ProtectedRoute>} />
              <Route path="/company/matches" element={<ProtectedRoute requiredRole="COMPANY"><CompanyMatches /></ProtectedRoute>} />
              <Route path="/company/profile" element={<ProtectedRoute requiredRole="COMPANY"><CompanyProfile /></ProtectedRoute>} />

              {/* Chat Routes */}
              <Route path="/chats" element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
              <Route path="/chat/:matchId" element={<ProtectedRoute><ChatWindow /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

