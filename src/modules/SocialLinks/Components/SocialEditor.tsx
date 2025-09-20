import React, { useCallback, useEffect, useState } from "react";

export interface SocialLink {
  link: string;
  icon: string;
}

interface SocialLinkDto {
  Url: string;
  Icon: string;
}

interface DisplaySocialLink {
  icon: string;
  url: string;
}

interface SocialEditorProps {
  userId: string;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const SocialEditor: React.FC<SocialEditorProps> = ({ userId }) => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [displayLinks, setDisplayLinks] = useState<DisplaySocialLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  // Optimized message handler with auto-clear
  const showMessage = useCallback((msg: string, isError: boolean = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }, []);

  // Single fetch function that handles both data types
  const fetchSocialLinks = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/StyleSocial/byUser/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch social links");
      
      const data = await res.json();
      
      // Handle both DTO format and display format
      if (data.length > 0) {
        if ('Url' in data[0] && 'Icon' in data[0]) {
          // DTO format for editor
          const convertedData = data.map((item: SocialLinkDto) => ({
            link: item.Url,
            icon: item.Icon
          }));
          setSocialLinks(convertedData);
        } else {
          // Display format
          setDisplayLinks(data);
          // Also set editor data from display data
          const editorData = data.map((item: DisplaySocialLink) => ({
            link: item.url,
            icon: item.icon
          }));
          setSocialLinks(editorData);
        }
      }
    } catch (err) {
      console.error(err);
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
      console.error(err);
      showMessage(`Error uploading icon: ${err instanceof Error ? err.message : "Unknown error"}`, true);
    } finally {
      setUploadingIndex(null);
    }
  }, [userId, showMessage]);

  const addSocial = useCallback(() => {
    setSocialLinks(prev => [...prev, { link: "", icon: "" }]);
  }, []);

  const removeSocial = useCallback((index: number) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const dtoData: SocialLinkDto[] = socialLinks.map(item => ({
        Url: item.link || "",
        Icon: item.icon || ""
      }));

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
      // Refresh data after successful update
      await fetchSocialLinks();
    } catch (err) {
      console.error("Full error:", err);
      showMessage(`Error updating social links: ${err instanceof Error ? err.message : "Unknown error"}`, true);
    } finally {
      setLoading(false);
    }
  }, [socialLinks, userId, showMessage, fetchSocialLinks]);

  // Optimized image URL builder
  const getImageUrl = useCallback((iconPath: string) => {
    return iconPath.startsWith("http") ? iconPath : `${API_BASE_URL}${iconPath}`;
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
        <label className="block text-sm text-gray-300 mb-1 font-medium">Icon</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleIconUpload(i, e.target.files[0])}
            disabled={uploadingIndex === i}
            className="file:bg-blue-600 file:text-white file:py-2 file:px-4 file:rounded-lg file:border-0 hover:file:bg-blue-700 transition cursor-pointer disabled:opacity-50"
          />
          {s.icon && (
            <div className="w-14 h-14 flex items-center justify-center bg-gray-700 rounded-lg border border-gray-600">
              <img
                src={getImageUrl(s.icon)}
                alt="Icon preview"
                className="w-10 h-10 object-contain"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            </div>
          )}
          {uploadingIndex === i && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-400 text-sm">Uploading...</span>
            </div>
          )}
          <button
            onClick={() => removeSocial(i)}
            className="ml-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
            disabled={uploadingIndex === i}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  ), [handleLinkChange, handleIconUpload, uploadingIndex, getImageUrl, removeSocial]);

  // Edit individual social link
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = useCallback((index: number, currentUrl: string) => {
    setEditingIndex(index);
    setEditValue(currentUrl);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingIndex(null);
    setEditValue("");
  }, []);

  const saveEdit = useCallback(async (index: number) => {
    if (!editValue.trim()) return;
    
    try {
      setLoading(true);
      // Update local state first
      const newDisplayLinks = [...displayLinks];
      newDisplayLinks[index].url = editValue.trim();
      
      const newSocialLinks = [...socialLinks];
      newSocialLinks[index].link = editValue.trim();
      
      // Update backend
      const dtoData: SocialLinkDto[] = newSocialLinks.map(item => ({
        Url: item.link || "",
        Icon: item.icon || ""
      }));

      const res = await fetch(`${API_BASE_URL}/api/StyleSocial/byUser/${userId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Accept: "application/json" 
        },
        body: JSON.stringify(dtoData),
      });

      if (!res.ok) throw new Error("Failed to update social link");

      // Update states after successful API call
      setDisplayLinks(newDisplayLinks);
      setSocialLinks(newSocialLinks);
      setEditingIndex(null);
      setEditValue("");
      showMessage("Social link updated successfully!");
    } catch (err) {
      console.error("Edit error:", err);
      showMessage(`Error updating social link: ${err instanceof Error ? err.message : "Unknown error"}`, true);
    } finally {
      setLoading(false);
    }
  }, [editValue, displayLinks, socialLinks, userId, showMessage]);

  // Delete individual social link
  const deleteSocialLink = useCallback(async (index: number) => {
    if (!window.confirm("Are you sure you want to delete this social link?")) return;
    
    try {
      setLoading(true);
      // Remove from local state first
      const newDisplayLinks = displayLinks.filter((_, i) => i !== index);
      const newSocialLinks = socialLinks.filter((_, i) => i !== index);
      
      // Update backend
      const dtoData: SocialLinkDto[] = newSocialLinks.map(item => ({
        Url: item.link || "",
        Icon: item.icon || ""
      }));

      const res = await fetch(`${API_BASE_URL}/api/StyleSocial/byUser/${userId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Accept: "application/json" 
        },
        body: JSON.stringify(dtoData),
      });

      if (!res.ok) throw new Error("Failed to delete social link");

      // Update states after successful API call
      setDisplayLinks(newDisplayLinks);
      setSocialLinks(newSocialLinks);
      showMessage("Social link deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      showMessage(`Error deleting social link: ${err instanceof Error ? err.message : "Unknown error"}`, true);
    } finally {
      setLoading(false);
    }
  }, [displayLinks, socialLinks, userId, showMessage]);

  // Render display link item
  const renderDisplayLinkItem = useCallback((link: DisplaySocialLink, index: number) => (
    <div
      key={index}
      className="bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-750 group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-lg border border-gray-600 flex-shrink-0">
          <img
            src={getImageUrl(link.icon)}
            alt="Social icon"
            className="w-6 h-6 object-contain"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
          <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center text-gray-400 text-xs" style={{ display: "none" }}>
            IMG
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          {editingIndex === index ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 px-2 py-1 text-xs bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="Enter URL"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit(index);
                  if (e.key === 'Escape') cancelEdit();
                }}
              />
              <button
                onClick={() => saveEdit(index)}
                disabled={loading || !editValue.trim()}
                className="p-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded text-xs transition"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={cancelEdit}
                className="p-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs transition"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 break-all text-xs hover:underline block"
            >
              {link.url.length > 40 ? `${link.url.substring(0, 40)}...` : link.url}
            </a>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {editingIndex !== index && (
            <>
              <button
                onClick={() => startEdit(index, link.url)}
                disabled={loading}
                className="p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded transition-all duration-200"
                title="Edit this social link"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => deleteSocialLink(index)}
                disabled={loading}
                className="p-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded transition-all duration-200"
                title="Delete this social link"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  ), [getImageUrl, deleteSocialLink, loading, editingIndex, editValue, startEdit, cancelEdit, saveEdit]);

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

      {/* Display Section */}
      <div className="p-6 max-w-3xl mx-auto bg-gray-900 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">Current Social Links</h3>
          <button
            onClick={fetchSocialLinks}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition text-sm"
          >
            Refresh
          </button>
        </div>
        
        {displayLinks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayLinks.map(renderDisplayLinkItem)}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">
            <div className="text-4xl mb-2">🔗</div>
            <p>No social links found</p>
            <p className="text-sm mt-1">Add some links in the editor above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialEditor;