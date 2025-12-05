import React from "react";
import { useSearchParams } from "react-router-dom";
import { ThemeProvider } from "../../modules/Core/layout/ThemeContext";
import SideBar from "../../modules/Core/layout/SideBar";
import ProfileForm from "../Profile/EditProfile";
import Shop from "../Shop/Shop";
import AccountManagement from "../Account/AccountManagement";

const DashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "profile";

  return (
    <ThemeProvider>
      <div className="flex w-full min-h-screen bg-gray-950">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          {/* Content */}
          <div className="bg-gray-950">
            {tab === "shop" ? (
              <Shop />
            ) : tab === "account" || tab === "donate" ? (
              <AccountManagement />
            ) : (
              <ProfileForm />
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default DashboardPage;