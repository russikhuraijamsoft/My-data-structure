import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../shared/layouts/AppShell';
import { useAuth } from '../core/auth/AuthContext';
import { SplashScreen } from '../shared/components/SplashScreen';

// Auth Pages
import { AuthLayout } from '../features/auth/pages/AuthLayout';
const LoginPage = React.lazy(() => import('../features/auth/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = React.lazy(() => import('../features/auth/pages/RegisterPage').then(module => ({ default: module.RegisterPage })));
const ForgotPasswordPage = React.lazy(() => import('../features/auth/pages/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const PhoneAuthPage = React.lazy(() => import('../features/auth/pages/PhoneAuthPage').then(module => ({ default: module.PhoneAuthPage })));
const PinAuthPage = React.lazy(() => import('../features/auth/pages/PinAuthPage').then(module => ({ default: module.PinAuthPage })));

// Dashboard
const DashboardPage = React.lazy(() => import('../features/dashboard/pages/DashboardPage').then(module => ({ default: module.DashboardPage })));

// POS
const PosPage = React.lazy(() => import('../features/pos/pages/PosPage').then(module => ({ default: module.PosPage })));

// KDS
const KdsPage = React.lazy(() => import('../features/kds/pages/KdsPage').then(module => ({ default: module.KdsPage })));

// Self-Ordering Kiosk
const KioskPage = React.lazy(() => import('../features/kiosk/pages/KioskPage').then(module => ({ default: module.KioskPage })));

// Purchasing
const PurchasingPage = React.lazy(() => import('../features/purchasing/pages/PurchasingPage').then(module => ({ default: module.PurchasingPage })));

// Inventory
const InventoryPage = React.lazy(() => import('../features/inventory/pages/InventoryPage').then(module => ({ default: module.InventoryPage })));

// CRM
const CrmPage = React.lazy(() => import('../features/crm/pages/CrmPage').then(module => ({ default: module.CrmPage })));

// Manufacturing
const ManufacturingPage = React.lazy(() => import('../features/manufacturing/pages/ManufacturingPage').then(module => ({ default: module.ManufacturingPage })));

// Table Management
const TableManagementPage = React.lazy(() => import('../features/table-management/pages/TableManagementPage').then(module => ({ default: module.TableManagementPage })));

// Finance & HR
const FinancePage = React.lazy(() => import('../features/finance/pages/FinancePage').then(module => ({ default: module.FinancePage })));
const HrPage = React.lazy(() => import('../features/hr/pages/HrPage').then(module => ({ default: module.HrPage })));

// AI
const AiPage = React.lazy(() => import('../features/ai/pages/AiPage').then(module => ({ default: module.AiPage })));

// Reports
const ReportsPage = React.lazy(() => import('../features/reports/pages/ReportsPage').then(module => ({ default: module.ReportsPage })));

// Admin / Settings
const AdminPage = React.lazy(() => import('../features/admin/pages/AdminPage').then(module => ({ default: module.AdminPage })));

// Auth Guard
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/kiosk',
    element: <React.Suspense fallback={<SplashScreen />}><KioskPage /></React.Suspense>,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <React.Suspense fallback={<SplashScreen />}><LoginPage /></React.Suspense> },
      { path: 'register', element: <React.Suspense fallback={<SplashScreen />}><RegisterPage /></React.Suspense> },
      { path: 'forgot-password', element: <React.Suspense fallback={<SplashScreen />}><ForgotPasswordPage /></React.Suspense> },
      { path: 'phone', element: <React.Suspense fallback={<SplashScreen />}><PhoneAuthPage /></React.Suspense> },
      { path: 'pin', element: <React.Suspense fallback={<SplashScreen />}><PinAuthPage /></React.Suspense> },
    ]
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <React.Suspense fallback={<SplashScreen />}><DashboardPage /></React.Suspense>,
      },
      {
        path: 'pos',
        element: <React.Suspense fallback={<SplashScreen />}><PosPage /></React.Suspense>,
      },
      {
        path: 'kiosk',
        element: <React.Suspense fallback={<SplashScreen />}><KioskPage /></React.Suspense>,
      },
      {
        path: 'kds',
        element: <React.Suspense fallback={<SplashScreen />}><KdsPage /></React.Suspense>,
      },
      {
        path: 'purchasing',
        element: <React.Suspense fallback={<SplashScreen />}><PurchasingPage /></React.Suspense>,
      },
      {
        path: 'inventory',
        element: <React.Suspense fallback={<SplashScreen />}><InventoryPage /></React.Suspense>,
      },
      {
        path: 'manufacturing',
        element: <React.Suspense fallback={<SplashScreen />}><ManufacturingPage /></React.Suspense>,
      },
      {
        path: 'tables',
        element: <React.Suspense fallback={<SplashScreen />}><TableManagementPage /></React.Suspense>,
      },
      {
        path: 'crm',
        element: <React.Suspense fallback={<SplashScreen />}><CrmPage /></React.Suspense>,
      },
      {
        path: 'hr',
        element: <React.Suspense fallback={<SplashScreen />}><HrPage /></React.Suspense>,
      },
      {
        path: 'finance',
        element: <React.Suspense fallback={<SplashScreen />}><FinancePage /></React.Suspense>,
      },
      {
        path: 'ai',
        element: <React.Suspense fallback={<SplashScreen />}><AiPage /></React.Suspense>,
      },
      {
        path: 'reports',
        element: <React.Suspense fallback={<SplashScreen />}><ReportsPage /></React.Suspense>,
      },
      {
        path: 'settings',
        element: <React.Suspense fallback={<SplashScreen />}><AdminPage /></React.Suspense>,
      },
      {
        path: 'gcloud',
        element: <Navigate to="/settings?tab=gcloud" replace />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      }
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
