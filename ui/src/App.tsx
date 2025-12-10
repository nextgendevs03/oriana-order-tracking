import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import LayoutPage from "./pages/LayoutPage";
import React from "react";
import UserManagement from "./Components/UserManagment/UserManagment";
// Import pages
import CreatePO from "./pages/CreatePO";
import PODetails from "./pages/PODetails";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import RoleManagement from "./Components/Admin/RoleManagment/RoleManagment";
import PermissionsManagement from "./Components/Admin/PermissionManagment/PermissionManagment";

const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes with Layout */}
          <Route path="/dashboard" element={<LayoutPage />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/settings" element={<LayoutPage />}>
            <Route index element={<Settings />} />
          </Route>
          <Route path="/create-po" element={<LayoutPage />}>
            <Route index element={<CreatePO />} />
          </Route>
          <Route path="/po-details/:poId" element={<LayoutPage />}>
            <Route index element={<PODetails />} />
          </Route>
          <Route path="/user-management" element={<LayoutPage />}>
            <Route index element={<UserManagement />} />
          </Route>
          {/* ✅ ROLE MANAGEMENT ROUTE (FIXED) */}
        <Route path="/role-management" element={<LayoutPage />}>
          <Route index element={<RoleManagement />} />
        </Route>
        <Route path="/permissions" element={<LayoutPage />}>
            <Route index element={<PermissionsManagement />} />
            </Route>
          
          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;