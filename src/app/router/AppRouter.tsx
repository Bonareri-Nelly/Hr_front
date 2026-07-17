// src/app/router/AppRouter.tsx
import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../../layouts/dashboardLayout";
import Login from "../../pages/login";
import { canViewModule, getDefaultRouteForRole, hasActiveSession } from "../../services/permissions";
import { appRoutes, type AppRoute } from "./routes";

function DashboardRedirect() {
  if (!hasActiveSession()) return <Navigate to="/" replace />;
  return <Navigate to={getDefaultRouteForRole()} replace />;
}

function ProtectedModuleRoute({ route }: { route: AppRoute }) {
  if (!hasActiveSession()) return <Navigate to="/" replace />;
  if (!canViewModule(route.id)) return <Navigate to={getDefaultRouteForRole()} replace />;

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
