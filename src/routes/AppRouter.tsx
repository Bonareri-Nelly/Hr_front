import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../layouts/dashboardLayout";
import { moduleRoutes } from "../modules/moduleRoutes";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/login";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {moduleRoutes.map(({ Component, path }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
