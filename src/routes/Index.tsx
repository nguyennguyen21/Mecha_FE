import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import LoginForm from "../pages/Auth/Login";
import RegisterForm from "../pages/Auth/Register";
import UserProfile from "../modules/User/components/userview";

import PublicRoutes from "./Publicroutes";
import PrivateRoutes from "./Privateroutes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>

        {/* Private routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        {/* Home page */}
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
