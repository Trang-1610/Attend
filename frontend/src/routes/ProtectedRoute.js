import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../auth/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing || (allowedRoles && !user)) {
    return <Spin size="large" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />;
  }

  if (!user) {
    return (
      <Navigate
        to={`/account/login?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden/pages/403" replace />;
  }

  return children;
};

export default ProtectedRoute;