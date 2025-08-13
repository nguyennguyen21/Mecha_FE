import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoutes() {
  const isAuth = true; // kiểm tra đăng nhập
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
}
