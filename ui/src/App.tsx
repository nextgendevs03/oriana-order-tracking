
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import React from "react";
import OrderTrackingDetail from "./pages/OrderTrackingDetail";
import WarrantyCertificate from "./Components/WarrantyCertificate/WarrantyCertificate";
// import ModalWarrantyCertificate from "./Components/WarrantyCertificate/Modals/ModalWarrantyCertificate";
const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ordertracking" element={<OrderTrackingDetail />} />
        </Routes>
       </BrowserRouter>
    </div>
  );
};

export default App;

