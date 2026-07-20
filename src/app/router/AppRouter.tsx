// src/app/router/AppRouter.tsx
import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "../../layouts/dashboardLayout";
import Login from "../../pages/login";
import { appRoutes } from "./routes";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="app-main">Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Navigate to="/dashboard/executive" replace />} />
            {appRoutes.map(({ Component, path }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// Add default export
export default AppRouter;
