import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import UserDashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { ReactNode } from "react";
import Unauthorized from "./pages/Unauthorized";
import Landing from "./pages/Landing";
import { AdminRoutes, OtherRoutes, UserRoutes } from "./utils/routes_name";
import AdminProfile from "./pages/admin/AdminProfile";
import UserProfile from "./pages/user/UserProfile";
import AdminPage from "./pages/admin/AdminPage";
import UserPage from "./pages/user/UserPage";

function App() {
  const auth: any = useSelector((state: RootState) => state.authState.auth);

  // PrivateRoute component for role-based access control
  interface PrivateRouteProps {
    children: ReactNode;
    requiredRole: number;
  }

  const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
    if (!auth) {
      return <Navigate to="/login" />;
    }
    if (auth.user?.roleId !== requiredRole) {
      return <Navigate to="/unauthorized" />; // Redirect to unauthorized page
    }
    return children;
  };

  // PublicRoute component to handle public routes
  interface PublicRouteProps {
    children: ReactNode;
    path: string; // Add path to identify the route
  }

  const PublicRoute = ({ children, path }: PublicRouteProps) => {
    if (auth && path !== OtherRoutes?.landing?.path) {
      // Redirect authenticated users to their dashboard, except for the landing page
      if (auth.user?.roleId === 2) {
        return <Navigate to={AdminRoutes?.dashboard?.path} />;
      } else if (auth.user?.roleId === 3) {
        return <Navigate to={UserRoutes?.dashboard?.path} />;
      }
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute path="/">
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path={OtherRoutes?.login?.path}
          element={
            <PublicRoute path={OtherRoutes?.login?.path}>
              <Login />
            </PublicRoute>
          }
        />

        {/* User Routes */}
        <Route
          path={UserRoutes?.dashboard?.path}
          element={
            <PrivateRoute requiredRole={3}>
              <UserDashboard />
            </PrivateRoute>
          }
        >
          {/* Nested Routes for Admin Dashboard */}
          <Route path={UserRoutes?.profile?.path} element={<UserProfile />} />
          <Route path={UserRoutes?.page?.path} element={<UserPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path={AdminRoutes?.dashboard?.path}
          element={
            <PrivateRoute requiredRole={2}>
              <AdminDashboard />
            </PrivateRoute>
          }
        >
          {/* Nested Routes for Admin Dashboard */}
          <Route path={AdminRoutes?.profile?.path} element={<AdminProfile />} />
          <Route path={AdminRoutes?.page?.path} element={<AdminPage />} />
        </Route>

        {/* Unauthorized Route */}
        <Route
          path={OtherRoutes?.unauthorized?.path}
          element={<Unauthorized />}
        />

        {/* Default Route */}
        <Route
          path={OtherRoutes?.all?.path}
          element={<Navigate to={OtherRoutes?.landing?.path} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
