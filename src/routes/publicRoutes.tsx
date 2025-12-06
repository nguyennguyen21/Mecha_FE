import type { JSX } from "react";
import Home from "../modules/Home/Home";
import ProfilePage from "../modules/Bio/Bio";
import Register from "../modules/Auth/Register";
import Login from "../modules/Auth/Login";

type Route = {
  path: string;
  element: JSX.Element;
  auth: boolean;
};

const publicRoutes: Route[] = [
  { path: "/", element: <Home />, auth: false },
  { path: "/register", element: <Register />, auth: false },
  { path: "/login", element: <Login />, auth: false },
  { path: "/forgot-password", element: <div>Quên mật khẩu</div>, auth: false },
  { path: "/verify-email", element: <div>Xác minh email</div>, auth: false },
  {
    path: "/:username",
    element: <ProfilePage />,
    auth: false,
  },
];

export { publicRoutes };
