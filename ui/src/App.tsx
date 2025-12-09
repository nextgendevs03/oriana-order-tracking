import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import LayoutPage from "./pages/LayoutPage";
import React from "react";
import Dashboard from "./pages/Dashboard";
import CreatePurchaseOrderForm from "./Components/PurchaseOrderDetails/CreatePurchaseOrderForm";
import OrderTrackingDetail from "./pages/OrderTrackingDetail";
import PermissionsManagement from "./Components/Admin/PermissionManagment/PermissionManagment";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store"; 

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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

            <Route path="/permissions" element={<LayoutPage />}>
              <Route index element={<PermissionsManagement />} />
            </Route>

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;