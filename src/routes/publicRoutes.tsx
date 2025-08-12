// src/routes/publicRoutes.tsx

import type { JSX } from "react";
import Home from "../pages/Home/Home";


type Route = {
  path: string;
  element: JSX.Element;
  auth: boolean;
};

const publicRoutes: Route[] = [
    {
    path: "/login",
    element:<></>,
    auth: false,
  },
  {
    path: "/",
    element: <Home/>,
    auth: false,
  },

  {
    path: "/forgot-password",
    element: <div>Quên mật khẩu</div>,
    auth: false,
  },
  {
    path: "/verify-email",
    element: <div>Xác minh email</div>,
    auth: false,
  },
];

export { publicRoutes };