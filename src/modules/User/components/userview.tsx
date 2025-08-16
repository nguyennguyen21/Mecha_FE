import { useEffect, useState } from "react";
import { getProfile } from "../../../modules/User/services/profileService";
import { API_CONFIG } from "../../../configs/ApiConfig";

const UserProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Helper để build URL đầy đủ (giống ProfileForm)
  const getMediaUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("blob:") || path.startsWith("http")) return path;
    return `${API_CONFIG.BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getProfile("tuibingao"); // <-- username
        console.log("📌 Data from API:", data);
        setUser(data);
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{user.username}</h1>
      <p className="text-gray-600">{user.description}</p>
      <p className="text-black-400">{user.location}</p>

      {/* Avatar */}
      {user.profileAvatar && (
        <img
          src={getMediaUrl(user.profileAvatar)}
          alt="Avatar"
          className="w-32 h-32 rounded-full object-cover mt-4"
        />
      )}

      {/* Background */}
      {user.background && (
        <img
          src={getMediaUrl(user.background)}
          alt="Background"
          className="w-full rounded-lg mt-4"
        />
      )}

      {/* Audio */}
      {user.audio && (
        <audio controls className="mt-4 w-full">
          <source src={getMediaUrl(user.audio)} type="audio/mpeg" />
          <source src={getMediaUrl(user.audio)} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default UserProfilePage;
