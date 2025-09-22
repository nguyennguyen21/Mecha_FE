import React, { useState, useRef, useEffect } from "react";
import { type CustomStyles } from "../../../types";

interface StylePreviewProps {
  customStyles: CustomStyles;
  onOrderChange?: (newOrder: { [key: string]: number }) => void;
}

const StylePreview: React.FC<StylePreviewProps> = ({ customStyles, onOrderChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMinimized) return;
    
    e.preventDefault();
    setIsDragging(true);
    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isMinimized) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Smooth movement with better constraints
    const panelWidth = panelRef.current?.offsetWidth || 400;
    const panelHeight = panelRef.current?.offsetHeight || 600;
    
    // Allow some overflow for better UX
    const minX = -panelWidth * 0.3;
    const maxX = window.innerWidth - panelWidth * 0.7;
    const minY = 0;
    const maxY = window.innerHeight - panelHeight * 0.5;
    
    setPanelPosition({
      x: Math.max(minX, Math.min(newX, maxX)),
      y: Math.max(minY, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Item drag handlers
  const handleItemDragStart = (e: React.DragEvent, itemType: string) => {
    setDraggedItem(itemType);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', itemType);
  };

  const handleItemDragOver = (e: React.DragEvent, itemType: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(itemType);
  };

  const handleItemDragLeave = () => {
    setDragOverItem(null);
  };

  const handleItemDrop = (e: React.DragEvent, targetItemType: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetItemType) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    // Get current orders
    const currentOrders = {
      avatar: customStyles.avatarOrder || 1,
      username: customStyles.usernameOrder || 2,
      description: customStyles.descriptionOrder || 3,
      socialLinks: (customStyles.descriptionOrder || 3) + 1,
      location: customStyles.locationOrder || 5,
      audio: customStyles.audioOrder || 6,
    };

    // Swap orders
    const draggedOrder = currentOrders[draggedItem as keyof typeof currentOrders];
    const targetOrder = currentOrders[targetItemType as keyof typeof currentOrders];

    const newOrders = { ...currentOrders };
    newOrders[draggedItem as keyof typeof currentOrders] = targetOrder;
    newOrders[targetItemType as keyof typeof currentOrders] = draggedOrder;

    // Call parent callback to save changes
    if (onOrderChange) {
      onOrderChange(newOrders);
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  // Helper function to parse margin string
  const parseMargin = (margin: string) => {
    if (!margin) return { top: '0px', right: '0px', bottom: '0px', left: '0px' };
    
    const cleanMargin = margin.trim()
      .replace(/ox/g, 'px')
      .replace(/(\d)\s+(\d)/g, '$1px $2')
      .replace(/^\s+/, '');
    
    const values = cleanMargin.split(/\s+/).filter(v => v.length > 0);
    
    const addPxIfNeeded = (val: string) => {
      if (!val) return '0px';
      if (val === '0') return '0px';
      if (/^\d+$/.test(val)) return val + 'px';
      return val;
    };
    
    switch (values.length) {
      case 1:
        const all = addPxIfNeeded(values[0]);
        return { top: all, right: all, bottom: all, left: all };
      case 2:
        const vertical = addPxIfNeeded(values[0]);
        const horizontal = addPxIfNeeded(values[1]);
        return { top: vertical, right: horizontal, bottom: vertical, left: horizontal };
      case 3:
        return { 
          top: addPxIfNeeded(values[0]), 
          right: addPxIfNeeded(values[1]), 
          bottom: addPxIfNeeded(values[2]), 
          left: addPxIfNeeded(values[1]) 
        };
      case 4:
      default:
        return { 
          top: addPxIfNeeded(values[0] || '0'), 
          right: addPxIfNeeded(values[1] || '0'), 
          bottom: addPxIfNeeded(values[2] || '0'), 
          left: addPxIfNeeded(values[3] || '0') 
        };
    }
  };

  // Get container styles
  const getContainerStyles = () => {
    return {
      border: `${customStyles.profileBorderWidth || '1px'} ${customStyles.profileBorderStyle || 'solid'} ${customStyles.profileBorderColor || '#8b5cf6'}`,
      borderRadius: customStyles.profileBorderRadius || '16px',
      padding: customStyles.profilePadding || '16px',
      backgroundColor: customStyles.profileBackgroundColor || 'transparent',
      opacity: customStyles.profileOpacity || 1,
      boxShadow: customStyles.profileBoxShadow || '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    };
  };

  // Get avatar styles with margin
  const getAvatarStyles = () => {
    const margin = parseMargin(customStyles.avatarMargin || '0px 0px 0px 0px');
    return {
      borderRadius: customStyles.avatarBorderRadius || '50%',
      // border: customStyles.avatarShowBorder 
      //   ? `${customStyles.avatarBorderWidth || '4px'} ${customStyles.avatarBorderStyle || 'solid'} ${customStyles.avatarBorderColor || '#888'}`
     //   : '4px solid #888'z,
      // marginTop: margin.top,
      marginRight: margin.right,
      marginBottom: margin.bottom,
      marginLeft: margin.left,
    };
  };

  // Get username styles with margin
  const getUsernameStyles = () => {
    const margin = parseMargin(customStyles.usernameMargin || '10px 0px 10px 0px');
    return {
      fontSize: customStyles.usernameFontSize || 'clamp(16px, 3vw, 24px)',
      fontStyle: customStyles.usernameFontStyle || 'normal',
      fontWeight: customStyles.usernameFontWeight || '700',
      color: customStyles.usernameColor || '#fff',
      textShadow: customStyles.usernameTextShadow || 'none',
      textTransform: customStyles.usernameTextTransform as any || 'none',
      letterSpacing: customStyles.usernameLetterSpacing || 'normal',
      marginTop: margin.top,
      marginRight: margin.right,
      marginBottom: margin.bottom,
      marginLeft: margin.left,
    };
  };

  // Get description styles with margin
  const getDescriptionStyles = () => {
    const margin = parseMargin(customStyles.descriptionMargin || '8px 0px 8px 0px');
    return {
      display: 'block', 
      fontSize: customStyles.descriptionFontSize || '14px',
      color: customStyles.descriptionColor || '#ccc',
      textAlign: (customStyles.descriptionTextAlign || 'center') as 'left' | 'center' | 'right' | 'justify',
      marginTop: margin.top,
      marginRight: margin.right,
      marginBottom: margin.bottom,
      marginLeft: margin.left,
    };
  };

  // Get location styles with margin
  const getLocationStyles = () => {
    const margin = parseMargin(customStyles.locationMargin || '4px 0px 4px 0px');
    return {
      fontSize: customStyles.locationFontSize || '12px',
      color: customStyles.locationColor || '#aaa',
      fontStyle: customStyles.locationFontStyle || 'italic',
      fontWeight: customStyles.locationFontWeight || '400',
      marginTop: margin.top,
      marginRight: margin.right,
      marginBottom: margin.bottom,
      marginLeft: margin.left,
    };
  };

  // Get audio title styles with margin
  const getAudioTitleStyles = () => {
    const margin = parseMargin(customStyles.audioTitleMargin || '0px 0px 0px 0px');
    return {
      fontSize: customStyles.audioTitleFontSize || '14px',
      fontWeight: customStyles.audioTitleFontWeight || '400',
      color: customStyles.audioTitleColor || '#ffffff',
      letterSpacing: customStyles.audioTitleLetterSpacing || '0px',
      marginTop: margin.top,
      marginRight: margin.right,
      marginBottom: margin.bottom,
      marginLeft: margin.left,
    };
  };

  // Get cover image styles
  const getCoverImageStyles = () => {
    return {
      width: parseInt(customStyles.coverImageWidth || '45') * 0.8 + 'px', // Smaller for preview
      height: parseInt(customStyles.coverImageHeight || '45') * 0.8 + 'px',
      borderRadius: customStyles.coverImageBorderRadius || '8px',
      border: `${customStyles.coverImageBorderWidth || '0px'} ${customStyles.coverImageBorderStyle || 'solid'} ${customStyles.coverImageBorderColor || '#ffffff'}`,
      objectFit: customStyles.coverImageObjectFit as any || 'cover',
      boxShadow: customStyles.coverImageBoxShadow || '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    };
  };

  // Toggle button
  if (!isVisible) {
    return (
      <button
        onClick={() => {
          console.log('Button clicked, setting visible to true');
          setIsVisible(true);
        }}
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform border border-purple-400/50"
        title="Show Preview"
      >
        👁
      </button>
    );
  }

  if (isMinimized) {
    return (
      <div 
        className="fixed z-50 border border-blue-500/50 rounded-lg p-3 shadow-2xl cursor-pointer hover:scale-105 transition-transform"
        onClick={() => setIsMinimized(false)}
        style={{
          transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)`
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xs">👁</div>
          <span className="text-white text-sm font-medium">Preview</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toggle button when panel is visible */}
      <button
        onClick={() => setIsVisible(false)}
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform border border-red-400/50"
        title="Hide Preview"
      >
        ✕
      </button>
      
      {/* Main panel */}
      <div 
        ref={panelRef}
        className="fixed z-40 bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-sm border border-gray-700 shadow-2xl overflow-y-auto rounded-lg transition-transform duration-75 ease-out"
        style={{ 
          width: '400px',
          height: '600px',
          top: '20px',
          right: '20px',
          transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)`,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
      >
      {/* Header - Draggable */}
      <div 
        className="sticky top-0 bg-gray-900/90 backdrop-blur-sm border-b border-gray-700 p-4 cursor-grab select-none"
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            👁 Live Preview
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Minimize"
            >
              ➖
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              title="Hide Preview"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-4">
        <div className="text-center text-xs text-gray-400 mb-4">
          Updates in real-time as you make changes
        </div>
        
        {/* Main Profile Preview */}
        <div style={getContainerStyles()} className="mx-auto text-center">
          {/* Sub Container with flex layout */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '8px',
            position: 'relative'
          }}>
            
            {/* Avatar */}
            <div 
              draggable
              onDragStart={(e) => handleItemDragStart(e, 'avatar')}
              onDragOver={(e) => handleItemDragOver(e, 'avatar')}
              onDragLeave={handleItemDragLeave}
              onDrop={(e) => handleItemDrop(e, 'avatar')}
              style={{ 
                order: customStyles.avatarOrder || 1,
                ...getAvatarStyles(),
                opacity: draggedItem === 'avatar' ? 0.5 : 1,
                border: dragOverItem === 'avatar' ? '2px dashed #8b5cf6' : 'none',
                borderRadius: '8px',
                padding: '4px',
                cursor: 'grab'
              }}
            >
              <div 
                className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg mx-auto"
                style={{ 
                  borderRadius: customStyles.avatarBorderRadius || '50%',
                  border: customStyles.avatarShowBorder 
                    ? `${customStyles.avatarBorderWidth || '4px'} ${customStyles.avatarBorderStyle || 'solid'} ${customStyles.avatarBorderColor || '#888'}`
                    : '4px solid #888'
                }}
              >
                👤
              </div>
            </div>

            {/* Username */}
            <div 
              draggable
              onDragStart={(e) => handleItemDragStart(e, 'username')}
              onDragOver={(e) => handleItemDragOver(e, 'username')}
              onDragLeave={handleItemDragLeave}
              onDrop={(e) => handleItemDrop(e, 'username')}
              style={{ 
                order: customStyles.usernameOrder || 2,
                ...getUsernameStyles(),
                opacity: draggedItem === 'username' ? 0.5 : 1,
                border: dragOverItem === 'username' ? '2px dashed #8b5cf6' : 'none',
                borderRadius: '8px',
                padding: '4px',
                cursor: 'grab'
              }}
            >
              Sample Username
            </div>

            {/* Description */}
            {(customStyles.description || customStyles.descriptionFontSize) && (
              <div 
                draggable
                onDragStart={(e) => handleItemDragStart(e, 'description')}
                onDragOver={(e) => handleItemDragOver(e, 'description')}
                onDragLeave={handleItemDragLeave}
                onDrop={(e) => handleItemDrop(e, 'description')}
                style={{ 
                  order: customStyles.descriptionOrder || 3,
                  ...getDescriptionStyles(),
                  opacity: draggedItem === 'description' ? 0.5 : 1,
                  border: dragOverItem === 'description' ? '2px dashed #8b5cf6' : 'none',
                  borderRadius: '8px',
                  padding: '4px',
                  cursor: 'grab'
                }}
              >
                {customStyles.description || "Welcome to my profile!"}
              </div>
            )}

            {/* Social Links */}
            <div 
              draggable
              onDragStart={(e) => handleItemDragStart(e, 'socialLinks')}
              onDragOver={(e) => handleItemDragOver(e, 'socialLinks')}
              onDragLeave={handleItemDragLeave}
              onDrop={(e) => handleItemDrop(e, 'socialLinks')}
              style={{ 
                order: (customStyles.descriptionOrder || 3) + 1,
                marginTop: '10px',
                opacity: draggedItem === 'socialLinks' ? 0.5 : 1,
                border: dragOverItem === 'socialLinks' ? '2px dashed #8b5cf6' : 'none',
                borderRadius: '8px',
                padding: '4px',
                cursor: 'grab'
              }}
            >
              <div className="flex justify-center gap-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm">📱</div>
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm">🐦</div>
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm">💼</div>
              </div>
            </div>

            {/* Location */}
            <div 
              draggable
              onDragStart={(e) => handleItemDragStart(e, 'location')}
              onDragOver={(e) => handleItemDragOver(e, 'location')}
              onDragLeave={handleItemDragLeave}
              onDrop={(e) => handleItemDrop(e, 'location')}
              style={{ 
                order: customStyles.locationOrder || 5,
                ...getLocationStyles(),
                opacity: draggedItem === 'location' ? 0.5 : 1,
                border: dragOverItem === 'location' ? '2px dashed #8b5cf6' : 'none',
                borderRadius: '8px',
                padding: '4px',
                cursor: 'grab'
              }}
            >
              📍 Ho Chi Minh City
            </div>
            
            {/* Audio Section */}
            <div 
              draggable
              onDragStart={(e) => handleItemDragStart(e, 'audio')}
              onDragOver={(e) => handleItemDragOver(e, 'audio')}
              onDragLeave={handleItemDragLeave}
              onDrop={(e) => handleItemDrop(e, 'audio')}
              style={{ 
                order: customStyles.audioOrder || 6,
                marginTop: '12px',
                opacity: draggedItem === 'audio' ? 0.5 : 1,
                border: dragOverItem === 'audio' ? '2px dashed #8b5cf6' : 'none',
                borderRadius: '8px',
                padding: '4px',
                cursor: 'grab'
              }}
            >
              <div className="bg-black/20 rounded-lg p-3 flex items-center gap-3 justify-center min-w-0">
                {/* Cover Image */}
                <div 
                  className="bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold shrink-0 rounded-lg"
                  style={{
                    ...getCoverImageStyles(),
                    minWidth: '48px',
                    minHeight: '48px',
                    width: '48px',
                    height: '48px'
                  }}
                >
                  🎵
                </div>
                
                {/* Audio Title */}
                <div className="text-left flex-grow min-w-0">
                  <div style={getAudioTitleStyles()}>
                    Sample Audio
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    </>
  );
};

export default StylePreview;