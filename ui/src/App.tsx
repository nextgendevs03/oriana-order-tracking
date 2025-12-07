import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import LayoutPage from "./pages/LayoutPage";
import React from "react";
// import CreatePO from "./pages/CreatePO";
// import PODetails from "./pages/PODetails";
import Dashboard from "./pages/Dashboard";
import CreatePurchaseOrderForm from "./Components/PurchaseOrderDetails/CreatePurchaseOrderForm";
import OrderTrackingDetail from "./pages/OrderTrackingDetail";
// import Settings from "./pages/Settings";
import UserManagement from "./Components/User Managment/UserManagment";

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
          <Route path="/create-po" element={<LayoutPage />}>
            <Route index element={<CreatePurchaseOrderForm />} />
          </Route>
          <Route path="/po-details/:poId" element={<LayoutPage />}>
            <Route index element={<OrderTrackingDetail />} />
          </Route>
          <Route path="/user-management" element={<LayoutPage />}>
            <Route index element={<UserManagement />} />
          </Route>
          {/* <Route path="/settings" element={<LayoutPage />}>
            <Route index element={<Settings />} />
          </Route>
          
          */}

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
