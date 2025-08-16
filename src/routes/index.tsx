// src/routes/index.tsx


import { Routes, Route } from "react-router-dom";
import { privateRoutes } from "./privateRoutes";
import { publicRoutes } from "./publicRoutes";
import  PrivateLayout from "../modules/Layouts/PrivateLayout/PrivateLayout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes - không cần layout riêng */}
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {/* Private Routes - bao bọc bởi PrivateLayout */}
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
     
    </Routes>
  );
}