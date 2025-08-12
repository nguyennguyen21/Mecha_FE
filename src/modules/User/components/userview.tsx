import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/userStyleService';

const UserProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUserProfile('ans'); // <-- username
        setUser(userData);
      } catch (err) {
        // Xử lý lỗi, ví dụ: redirect 404
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.username}</h1>
      <p>{user.description}</p>
      <img src={user.profileAvatar} alt="Avatar" />
      <img src={user.background} alt="Background" style={{ width: '100%' }} />
    </div>
  );
};

export default UserProfilePage;