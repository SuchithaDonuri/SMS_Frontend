import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;

  // existing check (plural)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // new check (singular) — handles both string and array
  if (allowedRole) {
    const isAllowed = Array.isArray(allowedRole)
      ? allowedRole.includes(user.role)
      : allowedRole === user.role;

    if (!isAllowed) {
      return <Navigate to="/" />;
    }
  }

  return children;
}

export default ProtectedRoute