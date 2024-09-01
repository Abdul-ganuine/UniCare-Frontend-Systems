import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { GlobalContext } from "./ContextApi";

const ProtectedRoute = () => {
  const { currentUser } = useContext(GlobalContext);
  const token = true;

  return currentUser ? <Outlet /> : <Navigate to='/' />;
};
export default ProtectedRoute;
