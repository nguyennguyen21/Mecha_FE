// src/layouts/PrivateLayout.tsx

import { Outlet, Navigate } from "react-router-dom";

type PrivateLayoutProps = {
  children?: React.ReactNode;
};

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  //  Kiểm tra token trong localStorage
  const token = localStorage.getItem("authToken");

  //  Nếu không có token → điều hướng đến trang đăng nhập
  if (!token) {
    return <Navigate to="/Login" replace />;
    <div>
      <h2>Bạn cần đăng nhập để truy cập trang này</h2>  
    </div>
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* Sidebar/Header */}
      

      {/* Nội dung chính */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50">
        {/* Nếu truyền children thì dùng children, nếu không dùng Outlet */}
        {children ? children : <Outlet />}
      </main>
    </div>
  );
};

export default PrivateLayout;