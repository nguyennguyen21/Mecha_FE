import React, { useState } from 'react';
import { layoutPresets, type LayoutPreset } from './layoutPresets';

interface LayoutManagerProps {
  customStyles: any;
  setCustomStyles: (styles: any) => void;
  userId: number;
  onApplyLayout: (styles: any) => Promise<void>;
}

const LayoutManager: React.FC<LayoutManagerProps> = ({
  customStyles,
  setCustomStyles,
  userId,
  onApplyLayout
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [isApplying, setIsApplying] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(true);

  // Layout keys including position clearing
  const pureLayoutKeys: (keyof LayoutPreset['styles'])[] = [
    'containerFlexDirection',
    'containerJustifyContent',
    'containerAlignItems',
    'containerFlexWrap',
    'containerGap',
    'containerTextAlign',
    'avatarOrder',
    'usernameOrder',
    'locationOrder',
    'iconOrder',
    'descriptionOrder',
    'audioOrder',
    // Position clearing keys
    'containerPositionX',
    'containerPositionY',
    'avatarPositionX',
    'avatarPositionY',
    'usernamePositionX',
    'usernamePositionY',
    'descriptionPositionX',
    'descriptionPositionY',
    'locationPositionX',
    'locationPositionY',
    'socialPositionX',
    'socialPositionY',
    'audioPositionX',
    'audioPositionY',
  ];

  const handlePresetSelect = (preset: LayoutPreset) => {
    setSelectedPreset(preset.id);

    const newStyles = { ...customStyles };
    
    // Apply layout styles
    pureLayoutKeys.forEach((key) => {
      if (key.includes('Position')) {
        // Clear all position keys when selecting a preset
        delete newStyles[key];
      } else if (preset.styles[key] !== undefined) {
        newStyles[key] = preset.styles[key];
      }
    });

    setCustomStyles(newStyles);
  };

  const handleApplyLayout = async (preset: LayoutPreset) => {
    setIsApplying(preset.id);
    try {
      const mergedStyles = { ...customStyles };
      
      // Apply layout styles
      pureLayoutKeys.forEach((key) => {
        if (!key.includes('Position') && preset.styles[key] !== undefined) {
          mergedStyles[key] = preset.styles[key];
        }
      });

      const layoutData = {
        idUser: userId,
        styles: mergedStyles
      };
      
      await onApplyLayout(layoutData);
      
      // Update local state after successful apply
      setCustomStyles(mergedStyles);
    } catch (error) {
      console.error('Error applying layout:', error);
    } finally {
      setIsApplying('');
    }
  };

  const renderPreviewElements = (preset: LayoutPreset) => {
    const elementIcons = {
      avatar: <i className="fas fa-user-circle text-purple-400 text-2xl"></i>,
      username: <i className="fas fa-at text-blue-400 text-lg"></i>,
      description: <i className="fas fa-align-left text-green-400 text-lg"></i>,
      location: <i className="fas fa-map-marker-alt text-red-400 text-lg"></i>,
      social: <i className="fas fa-share-alt text-pink-400 text-lg"></i>,
      audio: <i className="fas fa-music text-yellow-400 text-lg"></i>
    };

    const elements = [
      { order: preset.styles.avatarOrder, icon: elementIcons.avatar, label: 'Avatar', color: 'purple' },
      { order: preset.styles.usernameOrder, icon: elementIcons.username, label: 'Username', color: 'blue' },
      { order: preset.styles.descriptionOrder, icon: elementIcons.description, label: 'Description', color: 'green' },
      { order: preset.styles.locationOrder, icon: elementIcons.location, label: 'Location', color: 'red' },
      { order: preset.styles.iconOrder, icon: elementIcons.social, label: 'Social Links', color: 'pink' },
      { order: preset.styles.audioOrder, icon: elementIcons.audio, label: 'Audio Player', color: 'yellow' }
    ].filter(e => e.order !== undefined);

    const sortedElements = elements.sort((a, b) => a.order - b.order);

    if (preset.styles.containerFlexDirection === 'column-reverse') {
      sortedElements.reverse();
    }

    const isColumn = preset.styles.containerFlexDirection?.includes('column');
    const isRow = preset.styles.containerFlexDirection?.includes('row');

    const isLeftAligned = preset.styles.containerAlignItems === 'flex-start' || preset.styles.containerTextAlign === 'left';
    
    // For left-aligned layout, show avatar on left with info on right
    if (isLeftAligned) {
      const avatarElement = sortedElements.find(e => e.label === 'Avatar');
      const otherElements = sortedElements.filter(e => e.label !== 'Avatar');
      
      return (
        <div 
          className={`
            flex p-6 bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl min-h-[300px] 
            border border-purple-700/30 backdrop-blur-md shadow-xl
            flex-col gap-4
          `}
        >
          {/* Avatar and info row */}
          <div className="flex items-start gap-4 w-full">
            {avatarElement && (
              <div className={`
                flex items-center justify-center
                w-16 h-16 rounded-full bg-purple-800/30 border-2 border-purple-600/40
                transition-all hover:scale-105 hover:bg-purple-700/40 hover:border-purple-500/60
                backdrop-blur-sm flex-shrink-0
              `}>
                {avatarElement.icon}
              </div>
            )}
            <div className="flex-1 flex flex-col gap-2">
              {otherElements.filter(e => ['Username', 'Description', 'Location'].includes(e.label)).map((element, idx) => (
                <div 
                  key={idx}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-800/20 border border-purple-600/20
                    transition-all hover:bg-purple-700/30 hover:border-purple-500/40
                    backdrop-blur-sm text-left
                    ${element.label === 'Username' ? 'text-base font-bold' : 'text-sm'}
                  `}
                >
                  <span className="text-purple-300">{element.icon}</span>
                  <span className="text-gray-200 font-medium">{element.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Social Links and Audio below */}
          <div className="flex flex-col gap-2 w-full">
            {otherElements.filter(e => ['Social Links', 'Audio Player'].includes(e.label)).map((element, idx) => (
              <div 
                key={idx}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-lg bg-purple-800/20 border border-purple-600/20
                  transition-all hover:bg-purple-700/30 hover:border-purple-500/40
                  backdrop-blur-sm text-left
                `}
              >
                <span className="text-purple-300">{element.icon}</span>
                <span className="text-gray-200 font-medium">{element.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Default centered layout
    return (
      <div 
        className={`
          flex p-6 bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-2xl min-h-[300px] 
          border border-purple-700/30 backdrop-blur-md shadow-xl
          ${isColumn ? 'flex-col' : isRow ? 'flex-row' : 'flex-col'}
          ${preset.styles.containerJustifyContent === 'center' ? 'justify-center' : 
            preset.styles.containerJustifyContent === 'flex-start' ? 'justify-start' : 
            preset.styles.containerJustifyContent === 'flex-end' ? 'justify-end' :
            preset.styles.containerJustifyContent === 'space-around' ? 'justify-around' : 'justify-center'}
          ${preset.styles.containerAlignItems === 'center' ? 'items-center' : 
            preset.styles.containerAlignItems === 'flex-start' ? 'items-start' : 'items-end'}
          ${preset.styles.containerTextAlign === 'center' ? 'text-center' : 
            preset.styles.containerTextAlign === 'left' ? 'text-left' : 'text-right'}
          ${preset.styles.containerFlexWrap === 'wrap' ? 'flex-wrap' : ''}
        `}
        style={{ gap: preset.styles.containerGap || '20px' }}
      >
        {sortedElements.map((element, index) => (
          <div 
            key={index} 
            className={`
              flex flex-col items-center justify-center
              px-4 py-3 rounded-xl bg-purple-800/20 border border-purple-600/20
              transition-all hover:scale-105 hover:bg-purple-700/30 hover:border-purple-500/40
              backdrop-blur-sm
              ${isColumn ? 'w-full max-w-sm' : 'min-w-[100px]'}
            `}
          >
            <div className="mb-2 flex items-center justify-center">
              {element.icon}
            </div>
            <span className="text-xs text-gray-200 font-medium">{element.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mt-8 border border-gray-700/50 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <i className="fas fa-th-large text-purple-400 text-xl"></i>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Layout Presets</h3>
            <p className="text-gray-400 text-sm">Choose a layout style inspired by guns.lol</p>
          </div>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg transition-all text-sm text-gray-200 flex items-center gap-2"
        >
          <i className={`fas ${showPreview ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {layoutPresets.map((preset) => (
          <div
            key={preset.id}
            className={`
              group relative border-2 rounded-xl p-6 cursor-pointer transition-all duration-300
              bg-gray-800/40 backdrop-blur-sm
              ${selectedPreset === preset.id 
                ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20 scale-[1.01]' 
                : 'border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/50 hover:shadow-lg'
              }
            `}
            onClick={() => handlePresetSelect(preset)}
          >
            {/* Selected Badge */}
            {selectedPreset === preset.id && (
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <i className="fas fa-check-circle"></i>
                Selected
              </div>
            )}

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <i className={`fas ${preset.icon} text-purple-400 text-xl`}></i>
                </div>
                <h4 className="font-bold text-white text-xl">{preset.name}</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed ml-12">{preset.description}</p>
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="mb-6">
                {renderPreviewElements(preset)}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePresetSelect(preset);
                }}
                className={`
                  flex-1 px-5 py-3 rounded-lg text-sm font-semibold transition-all
                  flex items-center justify-center gap-2
                  ${selectedPreset === preset.id
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/30'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600/50'
                  }
                `}
              >
                <i className="fas fa-eye"></i>
                Preview
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApplyLayout(preset);
                }}
                disabled={isApplying === preset.id}
                className="flex-1 px-5 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed rounded-lg text-sm font-semibold text-white transition-all shadow-md shadow-green-500/20 flex items-center justify-center gap-2"
              >
                {isApplying === preset.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Applying...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    Apply Layout
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayoutManager;
