// src/app/router/AppRouter.tsx
import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../../layouts/dashboardLayout";
import Login from "../../pages/login";
import { canViewModule, getCurrentUserRole, getDefaultRouteForRole, hasActiveSession } from "../../services/permissions";
import { appRoutes, type AppRoute } from "./routes";

function DashboardRedirect() {
  if (!hasActiveSession()) return <Navigate to="/" replace />;
  return <Navigate to={getDefaultRouteForRole()} replace />;
}

function AccessDenied({ route }: { route: AppRoute }) {
  const role = getCurrentUserRole();

  return (
    <div className="min-h-[60vh] rounded-2xl border border-slate-200 bg-white p-8 text-slate-900 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Access denied</p>
      <h1 className="mt-3 text-3xl font-bold">You do not have permission to open {route.label}.</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Your current role is {role ?? "not assigned"}. Ask the System Admin or HR Admin to update your backend user role if this module should be available to you.
      </p>
      <a
        className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
        href={getDefaultRouteForRole()}
      >
        Go to my dashboard
      </a>
    </div>
  );
}

function ProtectedModuleRoute({ route }: { route: AppRoute }) {
  if (!hasActiveSession()) return <Navigate to="/" replace />;
  if (!canViewModule(route.id)) return <AccessDenied route={route} />;

  const Component = route.Component;
  return <Component />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="app-main">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardRedirect />} />
            {appRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={<ProtectedModuleRoute route={route} />} />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
