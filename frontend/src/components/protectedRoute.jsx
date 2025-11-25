import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const cargo = localStorage.getItem("cargo");

  if (!cargo) {
    alert("Você precisa estar logado para acessar esta página.");
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
