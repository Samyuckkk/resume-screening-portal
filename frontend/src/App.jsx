import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import RoleRoute from './components/Common/RoleRoute';
import { Spinner } from './components/Common/Loaders';
import DashboardLayout from './components/Layouts/DashboardLayout';
import AuthLayout from './components/Layouts/AuthLayout';
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="surface-card rounded-[2rem] p-8">
          <Spinner size="lg" />
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

  return <Navigate to="/jobs" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            <Route element={<DashboardLayout />}>
              <Route path="/jobs" element={<JobList />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidate"
                element={
                  <RoleRoute allowedRoles={['applicant']}>
                    <CandidateDashboard />
                  </RoleRoute>
                }
              />
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
              <Route
                path="/resumes/candidate/:candidate_id"
                element={
                  <ProtectedRoute>
                    <CandidateResume />
                  </ProtectedRoute>
                }
              />
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

