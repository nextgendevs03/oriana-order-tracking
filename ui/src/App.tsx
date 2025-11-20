
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import React from "react";
import OrderTrackingDetail from "./pages/OrderTrackingDetail";
import WarrantyForm from "./Components/Warranty/WarrantyForm";
import ParentComponent from "./Components/Warranty/Model/ParentComponent";
const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ordertracking" element={<OrderTrackingDetail />} />
          <Route
            path="/warrantyform"
            element={
              <WarrantyForm onSubmit={() => { /* TODO: Implement submit handler */ }} />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

