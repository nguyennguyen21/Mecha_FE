import React, { useEffect, useState } from "react";

interface SocialLink {
  icon: string;
  url: string;
}

interface SocialLinksProps {
  userId: number; 
}

const SocialLinks: React.FC<SocialLinksProps> = ({ userId }) => {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const API_BASE_URL = import.meta.env.VITE_BASE_URL;

  // Function to construct proper image URL
  const getImageUrl = (iconPath: string): string => {
    console.log('Processing icon path:', iconPath);
    
    if (!iconPath) {
      console.warn('Empty icon path received');
      return '';
    }
    
    // If it's already a full URL, return as is
    if (iconPath.startsWith("http://") || iconPath.startsWith("https://")) {
      console.log('Full URL detected:', iconPath);
      return iconPath;
    }
    
    // If it starts with /, it's a relative path from server root
    if (iconPath.startsWith("/")) {
      const fullUrl = `${API_BASE_URL}${iconPath}`;
      console.log('Relative path detected, full URL:', fullUrl);
      return fullUrl;
    }
    
    // Otherwise, assume it's a filename in uploads directory
    // Try static files first, fallback to API endpoint
    const staticUrl = `${API_BASE_URL}/uploads/${iconPath}`;
    console.log('Filename detected, constructed static URL:', staticUrl);
    return staticUrl;
  };

  const getFallbackImageUrl = (iconPath: string): string => {
    if (!iconPath || iconPath.startsWith("http")) return iconPath;
    
    // Fallback to API endpoint if static files fail
    const apiUrl = `${API_BASE_URL}/api/file/uploads/${iconPath.startsWith('/') ? iconPath.substring(1) : iconPath}`;
    console.log('Using fallback API URL:', apiUrl);
    return apiUrl;
  };

  const handleImageError = (index: number, originalSrc: string, link: SocialLink) => {
    console.error(`Failed to load image at index ${index}:`, originalSrc);
    
    // Try fallback URL if not already tried
    if (!originalSrc.includes('/api/file/uploads/')) {
      const fallbackUrl = getFallbackImageUrl(link.icon);
      if (fallbackUrl !== originalSrc) {
        console.log(`Trying fallback URL for index ${index}:`, fallbackUrl);
        // Update the image src to try the fallback URL
        const imgElement = document.querySelector(`img[data-index="${index}"]`) as HTMLImageElement;
        if (imgElement) {
          imgElement.src = fallbackUrl;
          return; // Don't mark as error yet, let it try the fallback
        }
      }
    }
    
    // Mark as error if both URLs failed
    setImageErrors(prev => new Set(prev).add(index));
  };

  const handleImageLoad = (index: number) => {
    // Remove from error set if image loads successfully
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
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
        
        // Debug logging
        console.log('Social links data received:', data);
        data.forEach((link, index) => {
          const finalUrl = getImageUrl(link.icon);
          console.log(`Link ${index}:`, {
            originalIcon: link.icon,
            finalUrl: finalUrl,
            url: link.url
          });
        });
        
        setLinks(data);
      } catch (err: any) {
        console.error('Error fetching social links:', err);
        setError(err.message || "Failed to fetch social links");
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [userId]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>Loading social links...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red", fontSize: "14px" }}>
        Error loading social links: {error}
      </div>
    );
  }

  // if (links.length === 0) {
  //   return (
  //     <div style={{ color: "#666", fontSize: "14px" }}>
  //       No social links available.
  //     </div>
  //   );
  // }

  return (
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      {links.map((link, index) => {
        const imageUrl = getImageUrl(link.icon);
        const hasError = imageErrors.has(index);
        
        return (
          <a 
            key={index} 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: "inline-block",
              transition: "transform 0.2s ease",
              borderRadius: "8px",
              overflow: "hidden"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {hasError ? (
              <div
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  color: "#666",
                  border: "1px solid #ddd",
                  borderRadius: "4px"
                }}
                title={`Failed to load: ${imageUrl}`}
              >
                ❌
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={`Social link ${index + 1}`}
                data-index={index}
                style={{ 
                  width: 40, 
                  height: 40,
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
                onError={() => handleImageError(index, imageUrl, link)}
                onLoad={() => handleImageLoad(index)}
                title={link.url}
              />
            )}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;