import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import LayoutPage from "./pages/LayoutPage";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import CreatePO from "./pages/CreatePO";
import PODetails from "./pages/PODetails";

// Components
import UserManagement from "./Components/UserManagment/UserManagment";
import RoleManagement from "./Components/Admin/RoleManagment/RoleManagment";
import PermissionsManagement from "./Components/Admin/PermissionManagment/PermissionManagment";

// Product Management Pages
import ProductManagement from "./Components/ProductManagment/ProductManagment";
import CategoryManagement from "./Components/ProductManagment/Categories/CategoryManagment";
import OEMManagement from "Components/ProductManagment/Oems/OEMManagment";
import ProductsManagmentProduct from "Components/ProductManagment/Products/ProductsManagmentProduct";
import SummaryDashboard from "pages/SummaryDashboard";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes with Layout */}
        <Route path="/dashboard" element={<LayoutPage />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/summary-dashboard" element={<LayoutPage />}>
          <Route index element={<SummaryDashboard />} />
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
        <Route path="/role-management" element={<LayoutPage />}>
          <Route index element={<RoleManagement />} />
        </Route>
        <Route path="/permissions" element={<LayoutPage />}>
          <Route index element={<PermissionsManagement />} />
        </Route>

        {/* Product Management Routes */}
        <Route path="/product-management" element={<LayoutPage />}>
          <Route index element={<ProductManagement />} />
        </Route>

        <Route path="/product-management/categories" element={<LayoutPage />}>
          <Route index element={<CategoryManagement />} />
        </Route>

        <Route path="/product-management/oems" element={<LayoutPage />}>
          <Route index element={<OEMManagement />} />
        </Route>

        <Route path="/product-management/products" element={<LayoutPage />}>
          <Route index element={<ProductsManagmentProduct />} />
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
