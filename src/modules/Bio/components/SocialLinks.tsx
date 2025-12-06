import React, { useEffect, useState, useCallback } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

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

  // Check if icon is Bootstrap Icons class
  const isBootstrapIcon = useCallback((icon: string): boolean => {
    if (!icon) return false;
    return icon.startsWith("bi ") || icon.startsWith("bi-");
  }, []);

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
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status} - ${res.statusText}`);
        }
        
        const data = await res.json();
        
        // Handle both DTO format (PascalCase) and display format (camelCase)
        const processedLinks = data
          .filter((item: any) => {
            const url = item.url || item.Url || '';
            return url && url.trim() !== '' && url !== '#';
          })
          .map((item: any) => {
            const mapped = {
              icon: item.icon || item.Icon || '',
              url: item.url || item.Url || '',
              color: item.color || item.Color || '#ffffff',
              size: item.size || item.Size || 24,
              marginLeft: item.marginLeft || item.MarginLeft || 0,
              marginRight: item.marginRight || item.MarginRight || 0,
            };
            return mapped;
          });
        
        setLinks(processedLinks);
      } catch (err: any) {
        setError(err.message || "Failed to fetch social links");
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [userId]);

  if (loading) {
    return null;
  }

  if (error) {
    return null;
  }

  // Không hiển thị gì nếu không có social links
  if (links.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
      {links.map((link, index) => {
        const iconSize = link.size || 24;
        const hasIcon = link.icon && link.icon.trim() !== "";
        
        return (
          <a 
            key={index} 
            href={link.url || "#"} 
            target={link.url ? "_blank" : "_self"}
            rel="noopener noreferrer"
            style={{ 
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: `${iconSize + 16}px`,
              height: `${iconSize + 16}px`,
              textDecoration: "none",
              color: link.color || "#ffffff",
              borderRadius: "50%",
              border: `2px solid ${link.color || "#ffffff"}`,
              transition: "all 0.2s ease",
              opacity: link.url ? 1 : 0.5,
              cursor: link.url ? "pointer" : "default",
              marginLeft: link.marginLeft ?? 0,
              marginRight: link.marginRight ?? 0,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
            onMouseOver={(e) => {
              if (link.url) {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "translateY(-2px) scale(1.1)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "translateY(0) scale(1)";
            }}
            onClick={(e) => {
              if (!link.url) {
                e.preventDefault();
              }
            }}
            title={link.url}
          >
            {hasIcon && (
              <i 
                className={isBootstrapIcon(link.icon) ? link.icon : "bi bi-link-45deg"} 
                style={{ 
                  color: link.color || "#ffffff",
                  fontSize: `${iconSize}px`,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-hidden="true"
              ></i>
            )}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
