
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext.jsx';
import { ThemeProvider } from './context/ThemeContext.js';
import { ToastProvider } from './context/ToastContext.jsx';

import { useAuth } from './hooks/useAuth';

import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import AddProductPage from './pages/AddProductPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import AddUserPage from './pages/AddUserPage.jsx';

import './styles/global.css';

// Protected route
function Protected({ children, requiredRole }) {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Application routes
function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>

      {/* Login */}
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <LoginPage />
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <RegisterPage />
        }
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <Protected>
            <DashboardPage />
          </Protected>
        }
      />

      {/* Products */}
      <Route
        path="/products"
        element={
          <Protected>
            <ProductsPage />
          </Protected>
        }
      />

      {/* Add Product - accessible to authenticated users */}
      <Route
        path="/add-product"
        element={
          <Protected>
            <AddProductPage />
          </Protected>
        }
      />

      {/* Reports */}
      <Route
        path="/reports"
        element={
          <Protected>
            <ReportsPage />
          </Protected>
        }
      />

      {/* Add User - ADMIN only */}
      <Route
        path="/add-user"
        element={
          <Protected requiredRole="ADMIN">
            <AddUserPage />
          </Protected>
        }
      />

      {/* Default route */}
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? '/dashboard' : '/login'}
            replace
          />
        }
      />

    </Routes>
  );
}

// Main application
export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <AuthProvider>
            <InventoryProvider>
              <AppRoutes />
            </InventoryProvider>
          </AuthProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
