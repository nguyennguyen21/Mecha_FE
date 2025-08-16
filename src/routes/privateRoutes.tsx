// src/routes/privateRoutes.tsx

import type { JSX } from "react";
import DasboardPage from "../pages/DashBoard/DashBoard";


type Route = {
  path: string;
  element: JSX.Element;
  auth: boolean;
};

const privateRoutes: Route[] = [
  {
    path: "/dashboard",
    element: <DasboardPage/>,
    auth: true,
  },
  {
    path: "/exam",
    element:<></>,
    auth: true,
  },
  {
    path: "/profile",
    element: <div>Profile Page</div>,
    auth: true,
  },
  {
    path: "/me",
    element: <div>Me Page</div>,
    auth: true,
  },
  {
    path: "/user/:id",
    element: <div>User Detail Page</div>,
    auth: true,
  },
  {
    path: "/settings",
    element: <div>Settings Page</div>,
    auth: true,
  },

];

export { privateRoutes };