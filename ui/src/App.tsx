import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import LayoutPage from "./pages/LayoutPage";
import React from "react";
import Dashboard from "./pages/Dashboard";
import CreatePurchaseOrderForm from "./Components/PurchaseOrderDetails/CreatePurchaseOrderForm";
import OrderTrackingDetail from "./pages/OrderTrackingDetail";
import RoleManagement from "./Components/Admin/RoleManagment/RoleManagment";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<LayoutPage />}>
          <Route index element={<Dashboard />} />
        </Route>

        {/* Create PO */}
        <Route path="/create-po" element={<LayoutPage />}>
          <Route index element={<CreatePurchaseOrderForm />} />
        </Route>

        {/* PO Detail */}
        <Route path="/po-details/:poId" element={<LayoutPage />}>
          <Route index element={<OrderTrackingDetail />} />
        </Route>

        {/* ✅ ROLE MANAGEMENT ROUTE (FIXED) */}
        <Route path="/role-management" element={<LayoutPage />}>
          <Route index element={<RoleManagement />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
