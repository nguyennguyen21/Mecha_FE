import React from "react";
import SocialEditor from "./Components/SocialEditor";
import { useProfileData } from "../../modules/Profile/hooks/useProfileData";

const SocialLinksPage: React.FC = () => {
  const { userId } = useProfileData(); // lấy userId từ hook

  if (!userId) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex justify-center items-start p-6 bg-gray-900 text-white">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Social Links</h1>
        <SocialEditor userId={userId.toString()} />
      </div>
    </div>
  );
};

export default SocialLinksPage;
