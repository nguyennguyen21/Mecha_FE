// src/routes/publicRoutes.tsx

import type { JSX } from "react";
import Home from "../pages/Home/Home";
import UserProfilePage from "../modules/User/components/userview";
import Discord from "../pages/Discord/RedirectToDiscord";
type Route = {
  path: string;
  element: JSX.Element;
  auth: boolean;
};
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import DiscordLogin from "../pages/Auth/DiscordLogin";

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
    path: "/discord-login",
    element: <DiscordLogin/>,
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
  {
    path: "/:username",
    element: <UserProfilePage />,
    auth: false,
  },
  {
    path: "/discord", 
    element: <Discord />,
    auth: false,
  },
];

export { publicRoutes };