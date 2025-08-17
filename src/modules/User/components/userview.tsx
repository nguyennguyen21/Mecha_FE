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
   <div
      className="p-6 max-w-3xl mx-auto min-h-screen"
      style={{
        backgroundImage: user.background ? `url(${getMediaUrl(user.background)})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

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
   {/* Audio */}
{user.audio && (
  <div className="mt-4 flex flex-col items-center">
    <audio controls className="w-full rounded-lg border border-white p-1">
      <source src={getMediaUrl(user.audio)} type="audio/mpeg" />
      <source src={getMediaUrl(user.audio)} type="audio/wav" />
      Your browser does not support the audio element.
    </audio>

    {/* Audio Cover Image */}
    {user.audioImage && (
      <img
        src={getMediaUrl(user.audioImage)}
        alt="Audio Cover"
        className="w-32 h-32 object-cover rounded-lg mt-3 shadow-lg border border-white"
      />
    )}

    {/* Audio Title */}
    {user.audioTitle && (
      <p className="mt-2 text-lg font-semibold text-white text-center">
        {user.audioTitle}
      </p>
    )}
  </div>
)}

    </div>
  );
};

export default UserProfilePage;
