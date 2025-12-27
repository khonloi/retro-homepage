// src/components/Icon.jsx
import React, { memo } from 'react';
import DraggableItem from './DraggableItem';
import "../css/Icon.css";
import defaultIcon from '../assets/icons/Microsoft Windows 3 Window Blank.ico';
import folderIcon from '../assets/icons/Microsoft Windows 3 Folder.ico';

const Icon = memo(({ type, iconSrc, defaultIcon: propDefaultIcon, draggable, ...props }) => {
  // Use folder icon if type is folder, otherwise use provided default or fallback
  const effectiveDefaultIcon = type === 'folder' 
    ? folderIcon 
    : (propDefaultIcon || defaultIcon);
  
  // Determine if item should be draggable
  // Default to true for desktop items, respect draggable prop if provided
  const isDraggable = draggable !== undefined ? draggable : true;
  
  return (
    <DraggableItem
      {...props}
      iconSrc={iconSrc}
      defaultIcon={effectiveDefaultIcon}
      className="windows-icon"
      isDraggable={isDraggable}
    />
  );
});

Icon.displayName = 'Icon';

export default Icon;