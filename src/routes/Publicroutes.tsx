// src/routes/publicRoutes.tsx

import type { JSX } from "react";
import Home from "../pages/Home/Home";


type Route = {
  path: string;
  element: JSX.Element;
  auth: boolean;
};
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";

const publicRoutes: Route[] = [

  {
    path: "/",
    element: <Home/>,
    auth: false,
  },
      {
    path: "/register",
    element: <Register/>,
    auth: false,
  },
   {
    path: "/login",
    element: <Login/>,
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