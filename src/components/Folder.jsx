// src/components/Folder.jsx
import React, { memo, useCallback } from 'react';
import DraggableItem from './DraggableItem';
import "../css/Icon.css";
import folderIcon from '../assets/icons/Microsoft Windows 3 Folder.ico';

const Folder = memo(({ onDrop, id, isDraggable = true, ...props }) => {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const draggedIconId = e.dataTransfer.getData('text/plain');
    if (onDrop && draggedIconId) {
      onDrop(draggedIconId, id);
    }
  }, [onDrop, id]);

  const handleDragOver = useCallback((e) => {
    // Only prevent default if we're receiving a drop from another item
    // Don't interfere if this folder itself is being dragged
    if (e.dataTransfer.effectAllowed !== 'none' && e.dataTransfer.effectAllowed !== 'uninitialized') {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ display: 'inline-block' }}
    >
      <DraggableItem
        {...props}
        defaultIcon={folderIcon}
        className="windows-icon"
        isDraggable={isDraggable}
      />
    </div>
  );
});

Folder.displayName = 'Folder';

export default Folder;