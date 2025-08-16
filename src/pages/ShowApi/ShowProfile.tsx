// src/components/ProfileForm.tsx

import React, { useState } from 'react';

// 🔧 Import service để gọi API
import { updateProfile } from '../../modules/User/services/profileService';

// 📦 Định nghĩa kiểu dữ liệu cho form
interface ProfileFormData {
  profileAvatar: string;
  background: string;
  audio: string;
  customCursor: string;
  description: string;
  username: string;
  effectUsername: string;
  location: string;
}

export const ProfileForm: React.FC = () => {
  // 🗂 State lưu dữ liệu form
  const [formData, setFormData] = useState<ProfileFormData>({
    profileAvatar: 'https://example.com/avatar2.png    ',
    background: 'https://example.com/bg2.jpg    ',
    audio: 'https://example.com/audio2.mp3    ',
    customCursor: 'crosshair',
    description: 'I am Alice',
    username: 'perman',
    effectUsername: 'glow',
    location: 'Viet Nam',
  });


  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn reload trang

    setLoading(true);
    setMessage('');

    // 📤 Chuẩn bị dữ liệu gửi lên API
    const profileData = {
      ProfileAvatar: formData.profileAvatar,
      Background: formData.background,
      Audio: formData.audio,
      CustomCursor: formData.customCursor,
      Description: formData.description,
      Username: formData.username,
      EffectUsername: formData.effectUsername,
      Location: formData.location,
    };

    try {
      // 🚀 Gọi API: POST /api/profile/tuibingao
      await updateProfile('tuibingao', profileData);
      setMessage('✅ Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage('❌ Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Update Profile</h2>

      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label>Avatar URL:</label>
          <input
            type="text"
            name="profileAvatar"
            value={formData.profileAvatar}
            onChange={handleChange}
            placeholder="Enter avatar URL"
            required
          />
        </div>

        <div style={styles.field}>
          <label>Background URL:</label>
          <input
            type="text"
            name="background"
            value={formData.background}
            onChange={handleChange}
            placeholder="Enter background URL"
            required
          />
        </div>

        <div style={styles.field}>
          <label>Audio URL:</label>
          <input
            type="text"
            name="audio"
            value={formData.audio}
            onChange={handleChange}
            placeholder="Enter audio URL (MP3)"
          />
        </div>

        <div style={styles.field}>
          <label>Custom Cursor:</label>
          <select name="customCursor" value={formData.customCursor} onChange={handleChange}>
            <option value="default">Default</option>
            <option value="pointer">Pointer</option>
            <option value="crosshair">Crosshair</option>
            <option value="text">Text</option>
            <option value="wait">Wait</option>
          </select>
        </div>

        <div style={styles.field}>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Tell us about yourself"
          />
        </div>

        <div style={styles.field}>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.field}>
          <label>Effect for Username:</label>
          <select name="effectUsername" value={formData.effectUsername} onChange={handleChange}>
            <option value="none">None</option>
            <option value="glow">Glow</option>
            <option value="rainbow">Rainbow</option>
            <option value="pulse">Pulse</option>
          </select>
        </div>

        <div style={styles.field}>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Viet Nam"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      {/* Hiển thị thông báo */}
      {message && (
        <div
          style={{
            marginTop: '20px',
            color: message.includes('success') ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

// 🎨 CSS-in-JS đơn giản (hoặc bạn có thể dùng file CSS riêng)
const styles = {
  field: {
    marginBottom: '15px',
  },
};

export default ProfileForm;