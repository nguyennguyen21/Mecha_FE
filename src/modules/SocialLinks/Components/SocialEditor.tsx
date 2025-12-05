import React, { useCallback, useEffect, useState, useMemo } from "react";

export interface SocialLink {
  link: string;
  icon: string;
  color?: string;
  size?: number;
  marginLeft?: number;
  marginRight?: number;
}

interface SocialLinkDto {
  Url: string;
  Icon: string;
  Color?: string;
  Size?: number;
  MarginLeft?: number;
  MarginRight?: number;
}

interface DisplaySocialLink {
  icon: string;
  url: string;
  color?: string;
  size?: number;
  marginLeft?: number;
  marginRight?: number;
}

interface SocialEditorProps {
  userId: string;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:30052';

const SocialEditor: React.FC<SocialEditorProps> = ({ userId }) => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [, setDisplayLinks] = useState<DisplaySocialLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [showIconPicker, setShowIconPicker] = useState<number | null>(null);

  // Optimized message handler with auto-clear
  const showMessage = useCallback((msg: string, _isError: boolean = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }, []);

  // Default social icons (memoized) - defined early so it can be used in fetchSocialLinks
  const defaultIcons = useMemo(() => [
    { name: "Facebook", icon: "fab fa-facebook", color: "#1877F2" },
    { name: "Twitter", icon: "fab fa-twitter", color: "#1DA1F2" },
    { name: "Instagram", icon: "fab fa-instagram", color: "#E4405F" },
    { name: "GitHub", icon: "fab fa-github", color: "#181717" },
    { name: "LinkedIn", icon: "fab fa-linkedin", color: "#0A66C2" },
    { name: "YouTube", icon: "fab fa-youtube", color: "#FF0000" },
    { name: "Discord", icon: "fab fa-discord", color: "#5865F2" },
    { name: "TikTok", icon: "fab fa-tiktok", color: "#000000" },
    { name: "Snapchat", icon: "fab fa-snapchat", color: "#FFFC00" },
    { name: "Pinterest", icon: "fab fa-pinterest", color: "#BD081C" },
    { name: "Reddit", icon: "fab fa-reddit", color: "#FF4500" },
    { name: "Telegram", icon: "fab fa-telegram", color: "#26A5E4" },
  ], []);

  // Single fetch function that handles both data types
  const fetchSocialLinks = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/StyleSocial/byUser/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch social links");
      
      const data = await res.json();
      
      // Filter out links with empty/invalid URLs (placeholder links)
      const isValidUrl = (url: string | null | undefined): boolean => {
        if (!url || typeof url !== 'string') return false;
        const trimmed = url.trim();
        // Filter out empty, placeholder, or default URLs
        return trimmed !== '' && 
               trimmed !== '#' && 
               !trimmed.includes('yourpage') && 
               !trimmed.includes('your-username') &&
               trimmed.length > 5; // Minimum valid URL length
      };

      // Handle both DTO format and display format
      if (data.length > 0) {
        if ('Url' in data[0] && 'Icon' in data[0]) {
          // DTO format (PascalCase: Url, Icon, Color, Size)
          const convertedData = data
            .filter((item: SocialLinkDto | any) => isValidUrl(item.Url || item.url)) // Filter valid URLs
            .map((item: SocialLinkDto | any) => {
              const defaultIcon = defaultIcons.find((di: { icon: string; color: string }) => di.icon === (item.Icon || item.icon));
              // Check for Size in multiple possible formats
              const sizeValue = item.Size ?? item.size ?? (item as any).Size ?? 36;
              const result = {
                link: item.Url || item.url || "",
                icon: item.Icon || item.icon || "",
                color: item.Color || item.color || (defaultIcon ? defaultIcon.color : "#ffffff"),
                size: sizeValue,
                marginLeft: item.MarginLeft ?? item.marginLeft ?? 0,
                marginRight: item.MarginRight ?? item.marginRight ?? 0
              };
              return result;
            });
          setSocialLinks(convertedData);
          // Also set display format
          setDisplayLinks(convertedData.map((item: SocialLink) => ({
            url: item.link,
            icon: item.icon,
            color: item.color,
            size: item.size
          })));
        } else {
          // Display format (camelCase: icon, url, color, size)
          const filteredData = data.filter((item: DisplaySocialLink | any) => isValidUrl(item.url || item.Url));
          setDisplayLinks(filteredData);
          // Also set editor data from display data
          const editorData = filteredData.map((item: DisplaySocialLink | any) => {
            const defaultIcon = defaultIcons.find((di: { icon: string; color: string }) => di.icon === item.icon);
            // Check for size in multiple possible formats (camelCase, PascalCase, or missing)
            const sizeValue = item.size ?? item.Size ?? (item as any).Size ?? 36;
            const result = {
              link: item.url || item.Url || "",
              icon: item.icon || item.Icon || "",
              color: item.color || item.Color || (defaultIcon ? defaultIcon.color : "#ffffff"),
              size: sizeValue,
              marginLeft: item.marginLeft ?? item.MarginLeft ?? 0,
              marginRight: item.marginRight ?? item.MarginRight ?? 0
            };
            return result;
          });
          setSocialLinks(editorData);
        }
      } else {
        // If no data, initialize with empty arrays
        setSocialLinks([]);
        setDisplayLinks([]);
      }
    } catch (err) {
      showMessage("Error loading social links", true);
    }
  }, [userId, showMessage]);

  useEffect(() => {
    fetchSocialLinks();
  }, [fetchSocialLinks]);

  const handleLinkChange = useCallback((index: number, value: string) => {
    setSocialLinks(prev => {
      const newLinks = [...prev];
      newLinks[index].link = value;
      return newLinks;
    });
  }, []);

  const handleIconUpload = useCallback(async (index: number, file: File) => {
    if (!file) return;
    
    setUploadingIndex(index);
    const formData = new FormData();
    formData.append("iconFile", file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/StyleSocial/byUser/${userId}/upload-icon`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setSocialLinks(prev => {
        const newLinks = [...prev];
        newLinks[index].icon = data.iconUrl;
        return newLinks;
      });

      showMessage("Icon uploaded successfully!");
    } catch (err) {
      showMessage(`Error uploading icon: ${err instanceof Error ? err.message : "Unknown error"}`, true);
    } finally {
      setUploadingIndex(null);
    }
  }, [userId, showMessage]);

  const addSocial = useCallback(() => {
    setSocialLinks(prev => [...prev, { link: "", icon: "", color: "#ffffff", size: 36, marginLeft: 0, marginRight: 0 }]);
  }, []);

  const removeSocial = useCallback((index: number) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const dtoData: SocialLinkDto[] = socialLinks.map(item => {
        // Ensure size is always a number, default to 36 if undefined/null
        // Important: Always include Size, even if it's the default value
        const sizeValue = (item.size !== undefined && item.size !== null && item.size > 0) ? item.size : 36;
        const result = {
          Url: item.link || "",
          Icon: item.icon || "",
          Color: item.color || "",
          Size: sizeValue,
          MarginLeft: item.marginLeft ?? 0,
          MarginRight: item.marginRight ?? 0
        };
        console.log(`Mapping item:`, item, `-> Size:`, sizeValue); // Debug log
        return result;
      });

      console.log("Saving social links with data:", JSON.stringify(dtoData, null, 2)); // Debug log

      const res = await fetch(`${API_BASE_URL}/api/StyleSocial/byUser/${userId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Accept: "application/json" 
        },
        body: JSON.stringify(dtoData),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errorMessage = `HTTP ${res.status} ${res.statusText}`;
        
        if (contentType?.includes("application/json")) {
          const errorData = await res.json();
          errorMessage = errorData.message || errorData.title || JSON.stringify(errorData);
        } else {
          const errorText = await res.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(`Failed to update social links: ${errorMessage}`);
      }

      showMessage("Social links updated successfully!");
      // Don't refresh to preserve user's current edits (size, color, etc.)
      // await fetchSocialLinks();
    } catch (err) {
      showMessage(`Error updating social links: ${err instanceof Error ? err.message : "Unknown error"}`, true);
    } finally {
      setLoading(false);
    }
  }, [socialLinks, userId, showMessage, fetchSocialLinks]);

  // Optimized image URL builder
  const getImageUrl = useCallback((iconPath: string) => {
    if (!iconPath) return "";
    return iconPath.startsWith("http") ? iconPath : `${API_BASE_URL}${iconPath}`;
  }, []);

  // Check if icon is Font Awesome class
  const isFontAwesomeIcon = useCallback((icon: string): boolean => {
    if (!icon) return false;
    return icon.startsWith("fa ") || icon.startsWith("fab ") || icon.startsWith("fas ") || icon.startsWith("far ") || icon.startsWith("fal ");
  }, []);

  // Handle icon selection
  const handleIconSelect = useCallback((index: number, iconClass: string) => {
    setSocialLinks(prev => {
      const newLinks = [...prev];
      const defaultIcon = defaultIcons.find((di: { icon: string; color: string }) => di.icon === iconClass);
      
      // Always set icon
      newLinks[index].icon = iconClass;
      
      // Always set default color when selecting icon (first time or when changing icon)
      if (defaultIcon) {
        newLinks[index].color = defaultIcon.color;
      } else if (!newLinks[index].color) {
        newLinks[index].color = "#ffffff";
      }
      
      // Set default size if not set
      if (!newLinks[index].size) {
        newLinks[index].size = 36;
      }
      
      return newLinks;
    });
  }, [defaultIcons]);

  // Handle color change
  const handleColorChange = useCallback((index: number, color: string) => {
    setSocialLinks(prev => {
      const newLinks = [...prev];
      newLinks[index].color = color;
      return newLinks;
    });
  }, []);

  // Handle size change
  const handleSizeChange = useCallback((index: number, size: number) => {
    setSocialLinks(prev => {
      const newLinks = [...prev];
      // Ensure size is a valid number between 12 and 64
      const validSize = Math.max(12, Math.min(64, size || 36));
      newLinks[index].size = validSize;
      return newLinks;
    });
  }, []);

  // Handle margin change
  const handleMarginChange = useCallback((index: number, type: 'left' | 'right', value: number) => {
    setSocialLinks(prev => {
      const newLinks = [...prev];
      const validValue = Math.max(0, Math.min(100, value || 0));
      if (type === 'left') {
        newLinks[index].marginLeft = validValue;
      } else {
        newLinks[index].marginRight = validValue;
      }
      return newLinks;
    });
  }, []);

  // Render social link item
  const renderSocialLinkItem = useCallback((s: SocialLink, i: number) => (
    <div key={i} className="bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 space-y-4">
      <div>
        <label className="block text-sm text-gray-300 mb-1 font-medium">Link</label>
        <input
          type="text"
          value={s.link}
          onChange={(e) => handleLinkChange(i, e.target.value)}
          placeholder="https://facebook.com/yourpage"
          className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2 font-medium">Icon</label>
        
        {/* Part 1: Choose from default icons */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowIconPicker(showIconPicker === i ? null : i)}
            className="text-sm text-blue-400 hover:text-blue-300 mb-2 flex items-center gap-2 transition"
          >
            <i className="fas fa-th"></i>
            {showIconPicker === i ? "Hide Icon Picker" : "Choose Icon"}
          </button>
          
          {showIconPicker === i && (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              {defaultIcons.map((defaultIcon) => (
                <button
                  key={defaultIcon.icon}
                  type="button"
                  onClick={() => {
                    handleIconSelect(i, defaultIcon.icon);
                    setShowIconPicker(null);
                  }}
                  className={`
                    w-12 h-12 flex items-center justify-center rounded-lg border-2 transition-all
                    ${s.icon === defaultIcon.icon 
                      ? 'border-blue-500 bg-blue-500/20 scale-110' 
                      : 'border-gray-600 bg-gray-700 hover:border-gray-500 hover:scale-105'
                    }
                  `}
                  title={defaultIcon.name}
                >
                  <i className={`${defaultIcon.icon} text-xl`} style={{ color: defaultIcon.color }}></i>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Current icon preview */}
        {s.icon && (
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2">Current Icon:</label>
            <div className="w-16 h-16 flex items-center justify-center bg-gray-700 rounded-lg border border-gray-600">
              {isFontAwesomeIcon(s.icon) ? (
                <i 
                  className={s.icon} 
                  style={{ 
                    color: s.color || "#ffffff",
                    fontSize: `${s.size ?? 36}px`
                  }}
                ></i>
              ) : (
                <img
                  src={getImageUrl(s.icon)}
                  alt="Icon preview"
                  style={{
                    width: `${s.size ?? 36}px`,
                    height: `${s.size ?? 36}px`
                  }}
                  className="object-contain"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              )}
            </div>
          </div>
        )}

        {/* Part 1.5: Custom Icon Color & Size */}
        {s.icon && (
          <div className="mb-4 space-y-4">
            {/* Icon Color (only for Font Awesome icons) */}
            {isFontAwesomeIcon(s.icon) && (
              <div>
                <label className="block text-xs text-gray-400 mb-2">Icon Color:</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={s.color || "#ffffff"}
                    onChange={(e) => handleColorChange(i, e.target.value)}
                    className="w-16 h-10 rounded-lg border border-gray-600 cursor-pointer bg-gray-700"
                    title="Choose icon color"
                  />
                  <input
                    type="text"
                    value={s.color || "#ffffff"}
                    onChange={(e) => handleColorChange(i, e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                  <button
                    type="button"
                    onClick={() => handleColorChange(i, "#ffffff")}
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition text-sm"
                    title="Reset to white"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Icon Size */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Icon Size: <span className="text-blue-400 font-semibold">{s.size ?? 36}px</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="64"
                  step="2"
                  value={s.size ?? 36}
                  onChange={(e) => handleSizeChange(i, parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  title="Adjust icon size"
                />
                <input
                  type="number"
                  min="12"
                  max="64"
                  step="2"
                  value={s.size ?? 36}
                  onChange={(e) => {
                    const newSize = parseInt(e.target.value);
                    if (!isNaN(newSize) && newSize >= 12 && newSize <= 64) {
                      handleSizeChange(i, newSize);
                    }
                  }}
                  className="w-20 px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  placeholder="36"
                />
                <button
                  type="button"
                  onClick={() => handleSizeChange(i, 36)}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition text-sm"
                  title="Reset to default size"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Icon Margins */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-2">
                  Margin Left: <span className="text-blue-400 font-semibold">{s.marginLeft ?? 0}px</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={s.marginLeft ?? 0}
                    onChange={(e) => handleMarginChange(i, 'left', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    title="Adjust left margin"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={s.marginLeft ?? 0}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value);
                      if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
                        handleMarginChange(i, 'left', newValue);
                      }
                    }}
                    className="w-20 px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                    placeholder="0"
                  />
                  <button
                    type="button"
                    onClick={() => handleMarginChange(i, 'left', 0)}
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition text-sm"
                    title="Reset left margin"
                  >
                    Reset
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">
                  Margin Right: <span className="text-blue-400 font-semibold">{s.marginRight ?? 0}px</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={s.marginRight ?? 0}
                    onChange={(e) => handleMarginChange(i, 'right', parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    title="Adjust right margin"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={s.marginRight ?? 0}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value);
                      if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
                        handleMarginChange(i, 'right', newValue);
                      }
                    }}
                    className="w-20 px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                    placeholder="0"
                  />
                  <button
                    type="button"
                    onClick={() => handleMarginChange(i, 'right', 0)}
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition text-sm"
                    title="Reset right margin"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Part 2: Upload custom icon */}
        <div>
          <label className="block text-xs text-gray-400 mb-2">Or Upload Custom Icon:</label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleIconUpload(i, e.target.files[0])}
              disabled={uploadingIndex === i}
              className="file:bg-blue-600 file:text-white file:py-2 file:px-4 file:rounded-lg file:border-0 hover:file:bg-blue-700 transition cursor-pointer disabled:opacity-50 text-sm"
            />
            {uploadingIndex === i && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-400 text-sm">Uploading...</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => removeSocial(i)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 text-sm"
            disabled={uploadingIndex === i}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  ), [handleLinkChange, handleIconUpload, uploadingIndex, getImageUrl, removeSocial, isFontAwesomeIcon, handleIconSelect, handleColorChange, handleSizeChange, handleMarginChange, defaultIcons, showIconPicker]);

  // Note: Edit/delete individual link functions were removed as they were not used
  // The component uses renderSocialLinkItem which handles all editing inline

  const isDisabled = loading || uploadingIndex !== null;

  return (
    <div className="space-y-8">
      {/* Social Links Editor */}
      <div className="p-6 max-w-3xl mx-auto bg-gray-900 rounded-2xl shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">Social Links Editor</h3>
          {socialLinks.length === 0 && (
            <span className="text-gray-400 text-sm">No links added yet</span>
          )}
        </div>

        {socialLinks.map(renderSocialLinkItem)}

        <div className="flex flex-wrap gap-3 justify-end">
          <button
            onClick={addSocial}
            disabled={isDisabled}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            Add Social Link
          </button>
          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition flex items-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            {loading ? "Saving..." : "Save All"}
          </button>
        </div>

        {message && (
          <div
            className={`text-sm p-3 rounded-xl transition-all duration-300 ${
              message.includes("Error") 
                ? "bg-red-900 text-red-300 border border-red-700" 
                : "bg-green-900 text-green-300 border border-green-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>

    </div>
  );
};

export default SocialEditor;