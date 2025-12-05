// src/routes/index.tsx


import { Routes, Route } from "react-router-dom";
import { privateRoutes } from "./privateRoutes";
import { publicRoutes } from "./publicRoutes";
import  PrivateLayout from "../modules/Layouts/PrivateLayout/PrivateLayout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Private Routes - bao bọc bởi PrivateLayout (phải đặt trước để tránh match với /:username) */}
      {privateRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PrivateLayout>
              {route.element}
            </PrivateLayout>
          }
        />
      ))}

      {/* Public Routes - không cần layout riêng */}
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
     
    </Routes>
  );
}