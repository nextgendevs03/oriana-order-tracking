import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import LayoutPage from "./pages/LayoutPage";
import React from "react";
import UserManagement from "./Components/UserManagment/UserManagment";
import CreatePO from "./pages/CreatePO";
import PODetails from "./pages/PODetails";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import {
  ProductManagementPage,
  CategoryManagement,
  OEMManagement,
  ProductList,
} from "./Components/ProductManagement";

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

          {/* Product Management Routes */}
          <Route path="/product-management" element={<LayoutPage />}>
            <Route index element={<ProductManagementPage />} />
          </Route>
          <Route path="/product-management/categories" element={<LayoutPage />}>
            <Route index element={<CategoryManagement />} />
          </Route>
          <Route path="/product-management/oems" element={<LayoutPage />}>
            <Route index element={<OEMManagement />} />
          </Route>
          <Route path="/product-management/products" element={<LayoutPage />}>
            <Route index element={<ProductList />} />
          </Route>
          
          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
