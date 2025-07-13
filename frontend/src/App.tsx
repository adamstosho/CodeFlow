import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import HomePage from './components/Home/HomePage';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import ConvertPage from './components/Convert/ConvertPage';
import Dashboard from './components/Dashboard/Dashboard';
import PublicDiagram from './components/Share/PublicDiagram';
import ProtectedRoute from './components/ProtectedRoute';
import DiagramDetailPage from './components/Diagram/DiagramDetailPage';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/share/:id" element={<PublicDiagram />} />

          {/* Auth routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/dashboard" replace /> : <SignupForm />}
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/convert"
            element={
              <ProtectedRoute>
                <Layout>
                  <ConvertPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/diagram/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <DiagramDetailPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1F2937',
              color: '#F9FAFB',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#F9FAFB',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#F9FAFB',
              },
            },
          }}
        />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;