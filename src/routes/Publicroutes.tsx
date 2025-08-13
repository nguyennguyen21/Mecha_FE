import { Outlet, Navigate } from "react-router-dom";

export default function PublicRoutes() {
  const isAuth = false; // nếu đã login thì true
  return !isAuth ? <Outlet /> : <Navigate to="/" replace />;
}
