import { Navigate } from "react-router-dom";

import { lazy } from "react";

const Home = lazy(() => import("@/pages/public/Home"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const VerifyOTP = lazy(() => import("@/pages/auth/VerifyOTP"));
const OAuthCallback = lazy(() => import("@/pages/auth/OAuthCallback"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Documentation = lazy(() => import("@/pages/public/Documentation"));

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";

const ProjectDetailPage = lazy(() => import("@/pages/project/ProjectDetailPage"));
const ProjectAnalytics = lazy(() => import("@/pages/project/ProjectAnalytics"));
const SessionManagement = lazy(() => import("@/pages/dashboard/SessionManagement"));
const Pricing = lazy(() => import("@/pages/public/Pricing"));
const Settings = lazy(() => import("@/pages/dashboard/Settings"));
const AuditLogs = lazy(() => import("@/pages/dashboard/AuditLogs"));
const ProvidersPage = lazy(() => import("@/pages/project/ProvidersPage"));

const TemplatesPage = lazy(() => import("@/pages/public/TemplatesPage"));
const EmailCustomizationPage = lazy(() => import("@/pages/project/EmailCustomizationPage"));

export const routes = [
  {
    path: "/",
    element: (
      <MainLayout>
        <Home />
      </MainLayout>
    ),
  },
  {
    path: "/templates",
    element: (
      <MainLayout>
        <TemplatesPage />
      </MainLayout>
    ),
  },
  {
    path: "/pricing",
    element: (
      <MainLayout>
        <Pricing />
      </MainLayout>
    ),
  },
  {
    path: "/docs",
    element: (
      <MainLayout>
        <Documentation />
      </MainLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <MainLayout showNavAndFooter={false}>
        <Login />
      </MainLayout>
    ),
  },
  {
    path: "/register", // ADD THIS ROUTE
    element: (
      <MainLayout showNavAndFooter={false}>
        <Register />
      </MainLayout>
    ),
  },
  {
    path: "/verify",
    element: (
      <MainLayout showNavAndFooter={false}>
        <VerifyOTP />
      </MainLayout>
    ),
  },
  {
    path: "/auth/callback",
    element: <OAuthCallback />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/:projectId",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ProjectDetailPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/:projectId/analytics",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ProjectAnalytics />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/:projectId/email-customization",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <EmailCustomizationPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/:projectId/providers",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ProvidersPage />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Settings />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings/sessions",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <SessionManagement />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/audit-logs",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <AuditLogs />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: (
      <MainLayout>
        <div className="flex h-[calc(100vh-160px)] items-center justify-center">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-muted-foreground">Page Not Found</p>
          </div>
        </div>
      </MainLayout>
    ),
  },
];
