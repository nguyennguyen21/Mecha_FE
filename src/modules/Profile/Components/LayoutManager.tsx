import React, { useState } from 'react';

interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  preview: string;
  styles: {
    containerFlexDirection: string;
    containerJustifyContent: string;
    containerAlignItems: string;
    containerFlexWrap?: string;
    containerGap: string;
    containerTextAlign: string;
    avatarOrder: number;
    usernameOrder: number;
    locationOrder: number;
    descriptionOrder: number;
    audioOrder: number;
  };
}

interface LayoutManagerProps {
  customStyles: any;
  setCustomStyles: (styles: any) => void;
  userId: number;
  onApplyLayout: (styles: any) => Promise<void>;
}

const layoutPresets: LayoutPreset[] = [
  {
    id: 'centered-column',
    name: 'Centered Column',
    description: 'Classic centered layout with all elements stacked vertically',
    preview: '📱\n🎭\n👤\n📍\n📝\n🎵',
    styles: {
      containerFlexDirection: 'column',
      containerJustifyContent: 'center',
      containerAlignItems: 'center',
      containerFlexWrap: 'nowrap',
      containerGap: '12px',
      containerTextAlign: 'center',
      avatarOrder: 1,
      usernameOrder: 2,
      locationOrder: 4,
      descriptionOrder: 3,
      audioOrder: 5
    }
  },
  {
    id: 'left-aligned',
    name: 'Left Aligned',
    description: 'Left-aligned layout for a clean, professional look',
    preview: '📱\n🎭\n📝\n📍\n🎵',
    styles: {
      containerFlexDirection: 'column',
      containerJustifyContent: 'flex-start',
      containerAlignItems: 'flex-start',
      containerFlexWrap: 'nowrap',
      containerGap: '12px',
      containerTextAlign: 'left',
      avatarOrder: 1,
      usernameOrder: 2,
      descriptionOrder: 3,
      locationOrder: 4,
      audioOrder: 5
    }
  },
  {
    id: 'right-aligned',
    name: 'Right Aligned',
    description: 'Right-aligned layout for unique presentation',
    preview: '     📱\n     🎭\n     📝\n     📍\n     🎵',
    styles: {
      containerFlexDirection: 'column',
      containerJustifyContent: 'flex-end',
      containerAlignItems: 'flex-end',
      containerFlexWrap: 'nowrap',
      containerGap: '12px',
      containerTextAlign: 'right',
      avatarOrder: 1,
      usernameOrder: 2,
      descriptionOrder: 3,
      locationOrder: 4,
      audioOrder: 5
    }
  },
  {
    id: 'reverse-order',
    name: 'Reverse Order',
    description: 'Bottom-up layout with reversed element order',
    preview: '📍\n🎵\n📝\n👤\n🎭',
    styles: {
      containerFlexDirection: 'column-reverse',
      containerJustifyContent: 'center',
      containerAlignItems: 'center',
      containerFlexWrap: 'nowrap',
      containerGap: '14px',
      containerTextAlign: 'center',
      descriptionOrder: 1,
      avatarOrder: 2,
      usernameOrder: 3,
      audioOrder: 4,
      locationOrder: 5
    }
  },
  {
    id: 'compact-card',
    name: 'Compact Card',
    description: 'Card-style layout (layout only, no styling changes)',
    preview: '🃏\n👤\n📝',
    styles: {
      containerFlexDirection: 'column',
      containerJustifyContent: 'center',
      containerAlignItems: 'center',
      containerGap: '12px',
      containerTextAlign: 'center',
      avatarOrder: 1,
      usernameOrder: 2,
      descriptionOrder: 3,
      locationOrder: 4,
      audioOrder: 5
    }
  }
];

const LayoutManager: React.FC<LayoutManagerProps> = ({
  customStyles,
  setCustomStyles,
  userId,
  onApplyLayout
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [isApplying, setIsApplying] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(true);

  // Chỉ các key liên quan layout thuần túy với proper typing
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
    'descriptionOrder',
    'audioOrder'
  ];

  const handlePresetSelect = (preset: LayoutPreset) => {
    setSelectedPreset(preset.id);

    // Merge chỉ các thuộc tính layout, giữ nguyên tất cả các style khác
    const newStyles = { ...customStyles };
    pureLayoutKeys.forEach((key) => {
      if (preset.styles[key] !== undefined) {
        newStyles[key] = preset.styles[key];
      }
    });

    setCustomStyles(newStyles);
  };

  const handleApplyLayout = async (preset: LayoutPreset) => {
    setIsApplying(preset.id);
    try {
      // Tạo object chứa tất cả styles hiện tại
      const mergedStyles = { ...customStyles };
      
      // Chỉ override các layout properties
      pureLayoutKeys.forEach((key) => {
        if (preset.styles[key] !== undefined) {
          mergedStyles[key] = preset.styles[key];
        }
      });

      const layoutData = {
        idUser: userId,
        styles: mergedStyles // Gửi toàn bộ styles (bao gồm styling + layout mới)
      };
      
      await onApplyLayout(layoutData);
    } catch (error) {
      console.error('Error applying layout:', error);
    } finally {
      setIsApplying('');
    }
  };

  const renderPreviewElements = (preset: LayoutPreset) => {
    const elements = [
      { order: preset.styles.avatarOrder, component: '🎭', label: 'Avatar' },
      { order: preset.styles.usernameOrder, component: '👤', label: 'Username' },
      { order: preset.styles.descriptionOrder, component: '📝', label: 'Description' },
      { order: preset.styles.locationOrder, component: '📍', label: 'Location' },
      { order: preset.styles.audioOrder, component: '🎵', label: 'Audio' }
    ];

    const sortedElements = elements.sort((a, b) => a.order - b.order);
    
    if (preset.styles.containerFlexDirection === 'column-reverse') {
      sortedElements.reverse();
    }

    return (
      <div 
        className={`
          flex p-4 bg-gray-800/50 rounded-lg min-h-[120px] items-center justify-center
          ${preset.styles.containerFlexDirection.includes('column') ? 'flex-col' : 'flex-row'}
          ${preset.styles.containerJustifyContent === 'center' ? 'justify-center' : 
            preset.styles.containerJustifyContent === 'flex-start' ? 'justify-start' : 'justify-end'}
          ${preset.styles.containerAlignItems === 'center' ? 'items-center' : 
            preset.styles.containerAlignItems === 'flex-start' ? 'items-start' : 'items-end'}
          ${preset.styles.containerTextAlign === 'center' ? 'text-center' : 
            preset.styles.containerTextAlign === 'left' ? 'text-left' : 'text-right'}
        `}
        style={{ gap: preset.styles.containerGap }}
      >
        {sortedElements.map((element, index) => (
          <div key={index} className="flex flex-col items-center">
            <span className="text-2xl mb-1">{element.component}</span>
            <span className="text-xs text-gray-400">{element.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Layout Manager</h3>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {layoutPresets.map((preset) => (
          <div
            key={preset.id}
            className={`
              border rounded-lg p-4 cursor-pointer transition-all duration-200
              ${selectedPreset === preset.id 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-gray-600 hover:border-gray-400 bg-gray-800/30'
              }
            `}
            onClick={() => handlePresetSelect(preset)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-white text-sm">{preset.name}</h4>
                <p className="text-gray-400 text-xs mt-1">{preset.description}</p>
              </div>
              <div className="flex gap-2">
                {selectedPreset === preset.id && (
                  <span className="text-blue-400 text-xs">Selected</span>
                )}
              </div>
            </div>

            {showPreview && renderPreviewElements(preset)}

            <div className="mt-3 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePresetSelect(preset);
                }}
                className={`
                  flex-1 px-3 py-2 rounded text-xs font-medium transition-colors
                  ${selectedPreset === preset.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }
                `}
              >
                Preview
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApplyLayout(preset);
                }}
                disabled={isApplying === preset.id}
                className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed rounded text-xs font-medium text-white transition-colors"
              >
                {isApplying === preset.id ? (
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                    Applying
                  </div>
                ) : (
                  'Apply'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPreset && (
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-sm font-medium text-white mb-2">Current Layout Configuration:</h4>
          <div className="text-xs text-gray-300 font-mono">
            <div>Direction: {customStyles.containerFlexDirection || 'column'}</div>
            <div>Justify: {customStyles.containerJustifyContent || 'center'}</div>
            <div>Align: {customStyles.containerAlignItems || 'center'}</div>
            <div>Text Align: {customStyles.containerTextAlign || 'center'}</div>
            <div>Gap: {customStyles.containerGap || '12px'}</div>
            <div className="mt-2">
              Order: Avatar({customStyles.avatarOrder || 1}), 
              Username({customStyles.usernameOrder || 2}), 
              Description({customStyles.descriptionOrder || 3}), 
              Location({customStyles.locationOrder || 4}), 
              Audio({customStyles.audioOrder || 5})
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayoutManager;