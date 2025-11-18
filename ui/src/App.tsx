import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import React from "react";
import OrderTrackingDetail from "./pages/OrderTrackingDetail";
import DispatchForm from "./Components/DispatchDetails/DispatchForm";
const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ordertracking" element={<OrderTrackingDetail />} />
          <Route path="/dispatchnew" element={<DispatchForm products={[]} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

