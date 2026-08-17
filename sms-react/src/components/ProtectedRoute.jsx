import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Your current ProtectedRoute — missing allowedRole check!
function ProtectedRoute({ children, allowedRole, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return children;  // ← allowedRole (single) is never checked!
}

export default ProtectedRoute;