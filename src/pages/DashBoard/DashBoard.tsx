import React from "react";
import { ThemeProvider } from "../../modules/Core/layout/ThemeContext";
import SideBar from "../../modules/Core/layout/SideBar";
import ProfileForm from "../../pages/Profile/EditProfile";

const DashboardPage: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="flex w-full min-h-screen bg-gray-950">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          <ProfileForm />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default DashboardPage;