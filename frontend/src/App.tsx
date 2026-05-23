import { useEffect, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Builder } from './pages/Builder';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const { token } = useAuthStore()

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

        <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />

        <Route path="/signup" element={token ? <Navigate to="/dashboard" replace /> : <Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/builder/:id"
          element={
            <ProtectedRoute>
              <Builder />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;