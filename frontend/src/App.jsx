import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import RoleRoute from './components/Common/RoleRoute';

// Layouts
import DashboardLayout from './components/Layouts/DashboardLayout';
import AuthLayout from './components/Layouts/AuthLayout';

// Pages
import JobList from './pages/Jobs/JobList';
import JobDetails from './pages/Jobs/JobDetails';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Auth/Profile';
import CandidateDashboard from './pages/Candidate/CandidateDashboard';
import RecruiterDashboard from './pages/Recruiter/RecruiterDashboard';
import JobForm from './pages/Recruiter/JobForm';
import ScheduleInterview from './pages/Recruiter/ScheduleInterview';
import CandidateResume from './pages/Recruiter/CandidateResume';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ResumeParserDashboard from './pages/Admin/ResumeParserDashboard';
import NotFound from './pages/Errors/NotFound';
import Unauthorized from './pages/Errors/Unauthorized';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    const roleRedirects = {
      applicant: '/candidate',
      recruiter: '/recruiter',
      admin: '/admin',
    };
    return <Navigate to={roleRedirects[user.role] || '/jobs'} replace />;
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Layout for login/register */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Dashboard / Sidebar Layout */}
            <Route element={<DashboardLayout />}>
              {/* Public Jobs Listings */}
              <Route path="/jobs" element={<JobList />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Shared Protected Settings */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Candidate/Applicant dashboard */}
              <Route
                path="/candidate"
                element={
                  <RoleRoute allowedRoles={['applicant']}>
                    <CandidateDashboard />
                  </RoleRoute>
                }
              />

              {/* Recruiter / Admin dashboards */}
              <Route
                path="/recruiter"
                element={
                  <RoleRoute allowedRoles={['recruiter', 'admin']}>
                    <RecruiterDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/recruiter/jobs/create"
                element={
                  <RoleRoute allowedRoles={['recruiter', 'admin']}>
                    <JobForm />
                  </RoleRoute>
                }
              />
              <Route
                path="/recruiter/jobs/edit/:id"
                element={
                  <RoleRoute allowedRoles={['recruiter', 'admin']}>
                    <JobForm />
                  </RoleRoute>
                }
              />
              <Route
                path="/recruiter/interviews/schedule"
                element={
                  <RoleRoute allowedRoles={['recruiter', 'admin']}>
                    <ScheduleInterview />
                  </RoleRoute>
                }
              />

              {/* Candidate Resume Inspection Details */}
              <Route
                path="/resumes/candidate/:candidate_id"
                element={
                  <ProtectedRoute>
                    <CandidateResume />
                  </ProtectedRoute>
                }
              />

              {/* System Admin Dashboard */}
              <Route
                path="/admin"
                element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/parser"
                element={
                  <RoleRoute allowedRoles={['admin']}>
                    <ResumeParserDashboard />
                  </RoleRoute>
                }
              />

              {/* Landing page redirects to Login/Dashboard depending on auth status */}
              <Route path="/" element={<RootRedirect />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
