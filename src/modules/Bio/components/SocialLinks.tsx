import React, { useEffect, useState } from "react";

interface SocialLink {
  icon: string;
  url: string;
  color?: string;
  size?: number;
  marginLeft?: number;
  marginRight?: number;
}

interface SocialLinksProps {
  userId: number; 
}

const SocialLinks: React.FC<SocialLinksProps> = ({ userId }) => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:30052';

  // Extract domain name from URL for display
  const getDomainName = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      // If URL parsing fails, return the URL as is (maybe it's just a path)
      return url;
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchLinks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`${API_BASE_URL}/api/StyleSocial/byUser/${userId}`, {
          method: 'GET',
          credentials: 'include', // Include cookies if needed
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status} - ${res.statusText}`);
        }
        
        const data: SocialLink[] = await res.json();
        
        // Chỉ lấy các link có URL hợp lệ
        const validLinks = data.filter(link => link.url && link.url.trim() !== '' && link.url !== '#');
        setLinks(validLinks);
      } catch (err: any) {
        setError(err.message || "Failed to fetch social links");
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [userId]);

  if (loading) {
    return null; // Không hiển thị gì khi đang load
  }

  if (error) {
    return null; // Không hiển thị gì nếu có lỗi
  }

  // Không hiển thị gì nếu không có social links
  if (links.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
      {links.map((link, index) => (
        <a 
          key={index} 
          href={link.url || "#"} 
          target={link.url ? "_blank" : "_self"}
          rel="noopener noreferrer"
          style={{ 
            display: "inline-block",
            padding: "8px 16px",
            textDecoration: "none",
            color: link.color || "#ffffff",
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            transition: "all 0.2s ease",
            opacity: link.url ? 1 : 0.5,
            cursor: link.url ? "pointer" : "default",
            marginLeft: link.marginLeft ?? 0,
            marginRight: link.marginRight ?? 0,
            fontSize: "14px",
          }}
          onMouseOver={(e) => {
            if (link.url) {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.transform = "translateY(0)";
          }}
          onClick={(e) => {
            if (!link.url) {
              e.preventDefault();
            }
          }}
        >
          {getDomainName(link.url)}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;