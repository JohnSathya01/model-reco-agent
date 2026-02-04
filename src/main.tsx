import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import LoginPage from './pages/LoginPage.tsx'
import AdminDashboard from './pages/AdminDashboard.tsx'
import ArchitectDashboard from './pages/ArchitectDashboard.tsx'
import ProjectManagerDashboard from './pages/ProjectManagerDashboard.tsx'
import ViewerDashboard from './pages/ViewerDashboard.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import AuthGuard from './components/auth/AuthGuard.tsx'
import RoleBasedRoute from './components/auth/RoleBasedRoute.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes */}
          <Route element={<AuthGuard />}>
            {/* Role-specific dashboards */}
            <Route path="/admin" element={<RoleBasedRoute allowedRoles={['admin']}><AdminDashboard /></RoleBasedRoute>} />
            <Route path="/architect" element={<RoleBasedRoute allowedRoles={['solution-architect']}><ArchitectDashboard /></RoleBasedRoute>} />
            <Route path="/manager" element={<RoleBasedRoute allowedRoles={['project-manager']}><ProjectManagerDashboard /></RoleBasedRoute>} />
            <Route path="/viewer" element={<RoleBasedRoute allowedRoles={['viewer']}><ViewerDashboard /></RoleBasedRoute>} />
            
            {/* Recommendation generator - accessible by Engineer, Admin, and Solution Architect */}
            <Route path="/generate" element={<RoleBasedRoute allowedRoles={['admin', 'engineer', 'solution-architect']}><App /></RoleBasedRoute>} />
            
            {/* Engineer and Admin default to main app */}
            <Route path="/" element={<RoleBasedRoute allowedRoles={['admin', 'engineer']}><App /></RoleBasedRoute>} />
          </Route>
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
