// src/components/Icon.jsx
import React, { memo } from 'react';
import DraggableItem from './DraggableItem';
import "../css/Icon.css";
import defaultIcon from '../assets/icons/Microsoft Windows 3 Window Blank.ico';
import folderIcon from '../assets/icons/Microsoft Windows 3 Folder.ico';

const Icon = memo(({ type, iconSrc, defaultIcon: propDefaultIcon, draggable, ...props }) => {
  const [isFlashing, setIsFlashing] = React.useState(false);
  const { onDoubleClick, className, ...otherProps } = props;

  // Use folder icon if type is folder, otherwise use provided default or fallback
  const effectiveDefaultIcon = type === 'folder'
    ? folderIcon
    : (propDefaultIcon || defaultIcon);

  // Determine if item should be draggable
  // Default to true for desktop items, respect draggable prop if provided
  const isDraggable = draggable !== undefined ? draggable : true;

  const handleDoubleClick = React.useCallback((e) => {
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
    }, 500); // 500ms = 4 cycles of 0.125s animation

    if (onDoubleClick) {
      onDoubleClick(e);
    }
  }, [onDoubleClick]);

  return (
    <DraggableItem
      {...otherProps}
      onDoubleClick={handleDoubleClick}
      iconSrc={iconSrc}
      defaultIcon={effectiveDefaultIcon}
      className={`windows-icon ${className || ''} ${isFlashing ? 'flashing' : ''}`}
      isDraggable={isDraggable}
      isFlashing={isFlashing}
    />
  );
});

Icon.displayName = 'Icon';

export default Icon;