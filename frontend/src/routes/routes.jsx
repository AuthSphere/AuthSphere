import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";

const Home = lazy(() => import("@/pages/public/Home"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const VerifyOTP = lazy(() => import("@/pages/auth/VerifyOTP"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Documentation = lazy(() => import("@/pages/public/Documentation"));
const AuthCallback = lazy(() => import("@/pages/auth/AuthCallback"));
const ProjectDetailPage = lazy(
  () => import("@/pages/project/ProjectDetailPage"),
);
const ProjectAnalytics = lazy(() => import("@/pages/project/ProjectAnalytics"));
const SessionManagement = lazy(
  () => import("@/pages/dashboard/SessionManagement"),
);
const Pricing = lazy(() => import("@/pages/public/Pricing"));
const Settings = lazy(() => import("@/pages/dashboard/Settings"));
const AuditLogs = lazy(() => import("@/pages/dashboard/AuditLogs"));
const ProvidersPage = lazy(() => import("@/pages/project/ProvidersPage"));
const EmailCustomizationPage = lazy(
  () => import("@/pages/project/EmailCustomizationPage"),
);
const NotFound = lazy(() => import("@/pages/public/NotFound"));

/**
 * Nested Application Route Hierarchy.
 * Uses React Router nested route configuration to ensure MainLayout and navigation
 * state remain persistent across sibling view transitions without remounting overhead.
 */
export const routes = [
  // Standalone public routes (custom header/footer or full-screen enclave)
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
  {
    path: "/verify",
    element: <VerifyOTP />,
  },

  // Public content views sharing standard MainLayout
  {
    element: <MainLayout />,
    children: [
      {
        path: "/pricing",
        element: <Pricing />,
      },
      {
        path: "/docs",
        element: <Documentation />,
      },
    ],
  },

  // Authenticated Developer Enclave routes sharing MainLayout & session guard
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/projects/:projectId",
        element: <ProjectDetailPage />,
      },
      {
        path: "/projects/:projectId/analytics",
        element: <ProjectAnalytics />,
      },
      {
        path: "/projects/:projectId/email-customization",
        element: <EmailCustomizationPage />,
      },
      {
        path: "/projects/:projectId/providers",
        element: <ProvidersPage />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/settings/sessions",
        element: <SessionManagement />,
      },
      {
        path: "/audit-logs",
        element: <AuditLogs />,
      },
    ],
  },

  // Route resolution failure fallback
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
