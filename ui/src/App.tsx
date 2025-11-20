
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import React from "react";
import OrderTrackingDetail from "./pages/OrderTrackingDetail";

// import ParentComponent from "./Components/Dispatch/ParentComponent"; // Commented out: Cannot find module 
  import ParentComponent from "./Components/Dispatch/ParentComponent";
const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ordertracking" element={<OrderTrackingDetail />} />
          <Route
            path="/dispatchForm"
            element={
              <ParentComponent />
            
            }
          />
        
        </Routes>
      </BrowserRouter>
    </div>
  );
 };

export default App;

