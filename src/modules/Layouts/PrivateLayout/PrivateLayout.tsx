import { Outlet, Navigate } from "react-router-dom";

type PrivateLayoutProps = {
  children?: React.ReactNode;
};

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar/Header */}
      <main className="w-full">
        {children ? children : <Outlet />}
      </main>
    </div>
  );
};

export default PrivateLayout;
