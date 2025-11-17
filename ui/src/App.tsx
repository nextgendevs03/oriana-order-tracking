
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import React from "react";
import OrderTrackingDetail from "./pages/OrderTrackingDetail";
// import DocumentForm from "./Components/Documents/DocumentsForm";
import DocumentsForm from "./Components/Documents/DocumentsForm";
const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ordertracking" element={<OrderTrackingDetail />} />
          <Route path="/documentform" element={<DocumentsForm />} />
        </Routes>
       </BrowserRouter>
    </div>
  );
};

export default App;

