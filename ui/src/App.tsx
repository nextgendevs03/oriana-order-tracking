import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OrderTrackingDetail from "./pages/OrderTrackingDetail";

// Components
import PurchaseDetailsForm from "./Components/PurchaseDetailForm/PurchaseDetailsForm";
 import ParentComponent from "./Components/PurchaseDetailForm/Modal/Parent Component";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ordertracking" element={<OrderTrackingDetail />} />
        <Route path="/purchasedetailform" element={<PurchaseDetailsForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
