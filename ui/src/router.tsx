import { Routes, Route, Navigate } from "react-router-dom";
import { PERMISSIONS } from "constants/permissions";
import { usePermission } from "hooks/usePermission";
import { useAppSelector } from "store/hooks";
import { selectIsLoggedIn } from "store/authSlice";

// Pages
import Login from "./pages/Login";
import LayoutPage from "./pages/LayoutPage";
import Dashboard from "./pages/Dashboard";
import SummaryDashboard from "./pages/SummaryDashboard";
import Settings from "./pages/Settings";
import CreatePO from "./pages/CreatePO";
import PODetails from "./pages/PODetails";
import Profile from "./pages/Profile";

// Admin Components
import UserManagement from "./Components/Admin/UserManagment/UserManagment";
import RoleManagement from "./Components/Admin/RoleManagment/RoleManagment";
import PermissionsManagement from "./Components/Admin/PermissionManagment/PermissionManagment";
import ClientManagement from "./Components/Admin/ClientManagment/ClientManagment";

// Product Management Components
import ProductManagement from "./Components/Admin/ProductManagment/ProductManagment";
import CategoryManagement from "./Components/Admin/ProductManagment/Categories/CategoryManagment";
import OEMManagement from "./Components/Admin/ProductManagment/Oems/OEMManagment";
import ProductsManagmentProduct from "./Components/Admin/ProductManagment/Products/ProductsManagmentProduct";

// Error Pages
import NotFound from "./pages/NotFound";

/**
 * Authentication Guard Component
 *
 * Redirects unauthenticated users to login page.
 * Only allows access if user is logged in.
 */
const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * Public Route Guard Component
 *
 * Redirects authenticated users to dashboard.
 * Only allows access if user is NOT logged in.
 */
const RequireGuest = ({ children }: { children: React.ReactElement }) => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

/**
 * Application Router
 *
 * Defines all routes with permission-based access control.
 * Routes are conditionally rendered based on user permissions.
 */
export const AppRouter = () => {
  const canViewUsers = usePermission(PERMISSIONS.USERS_READ);
  const canViewProducts = usePermission(PERMISSIONS.PRODUCT_READ);

  return (
    <Routes>
      {/* Public Route - Only accessible when NOT logged in */}
      <Route
        path="/"
        element={
          <RequireGuest>
            <Login />
          </RequireGuest>
        }
      />

      {/* Protected Routes - Always Available */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <LayoutPage />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>

      <Route
        path="/summary-dashboard"
        element={
          <RequireAuth>
            <LayoutPage />
          </RequireAuth>
        }
      >
        <Route index element={<SummaryDashboard />} />
      </Route>

      <Route
        path="/settings"
        element={
          <RequireAuth>
            <LayoutPage />
          </RequireAuth>
        }
      >
        <Route index element={<Settings />} />
      </Route>

      <Route
        path="/profile"
        element={
          <RequireAuth>
            <LayoutPage />
          </RequireAuth>
        }
      >
        <Route index element={<Profile />} />
      </Route>

      <Route
        path="/create-po"
        element={
          <RequireAuth>
            <LayoutPage />
          </RequireAuth>
        }
      >
        <Route index element={<CreatePO />} />
      </Route>

      <Route
        path="/po-details/:poId"
        element={
          <RequireAuth>
            <LayoutPage />
          </RequireAuth>
        }
      >
        <Route index element={<PODetails />} />
      </Route>

      {/* User Management Routes - Requires USERS_READ permission */}
      {canViewUsers && (
        <>
          <Route
            path="/user-management"
            element={
              <RequireAuth>
                <LayoutPage />
              </RequireAuth>
            }
          >
            <Route index element={<UserManagement />} />
          </Route>

          <Route
            path="/role-management"
            element={
              <RequireAuth>
                <LayoutPage />
              </RequireAuth>
            }
          >
            <Route index element={<RoleManagement />} />
          </Route>

          <Route
            path="/permissions"
            element={
              <RequireAuth>
                <LayoutPage />
              </RequireAuth>
            }
          >
            <Route index element={<PermissionsManagement />} />
          </Route>
        </>
      )}

      {/* Product Management Routes - Requires PRODUCT_READ permission */}
      {canViewProducts && (
        <>
          <Route
            path="/client-management"
            element={
              <RequireAuth>
                <LayoutPage />
              </RequireAuth>
            }
          >
            <Route index element={<ClientManagement />} />
          </Route>

          <Route
            path="/product-management"
            element={
              <RequireAuth>
                <LayoutPage />
              </RequireAuth>
            }
          >
            <Route index element={<ProductManagement />} />
          </Route>

          <Route
            path="/product-management/categories"
            element={
              <RequireAuth>
                <LayoutPage />
              </RequireAuth>
            }
          >
            <Route index element={<CategoryManagement />} />
          </Route>

          <Route
            path="/product-management/oems"
            element={
              <RequireAuth>
                <LayoutPage />
              </RequireAuth>
            }
          >
            <Route index element={<OEMManagement />} />
          </Route>

          <Route
            path="/product-management/products"
            element={
              <RequireAuth>
                <LayoutPage />
              </RequireAuth>
            }
          >
            <Route index element={<ProductsManagmentProduct />} />
          </Route>
        </>
      )}

      {/* 404 Not Found Page - Protected */}
      <Route
        path="*"
        element={
          <RequireAuth>
            <NotFound />
          </RequireAuth>
        }
      />
    </Routes>
  );
};
