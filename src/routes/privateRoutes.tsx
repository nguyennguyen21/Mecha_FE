import type { JSX } from "react";
import Dashboard from "../modules/DashBoard/DashBoard";
import SocialLinksPage from "../modules/SocialLinks/SocialLinksPage"; // <- import mới

type Route = {
  path: string;
  element: JSX.Element;
  auth: boolean;
};

const privateRoutes: Route[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
    auth: true,
  },
  {
    path: "/exam",
    element: <></>,
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
  {
    path: "/links",               // <- route mới
    element: <SocialLinksPage />, // hiển thị SocialEditor
    auth: true,
  },
];

export { privateRoutes };
