import React, { memo, useCallback } from 'react';
import Icon from './Icon';
import '../css/Explorer.css';

const Explorer = memo(({
  folderId,
  folderData,
  onIconDoubleClick,
  onFolderDoubleClick,
  onIconSelect,
  onFolderSelect,
  selectedItem,
  onMoveIcon,
}) => {
  const handleItemDoubleClick = useCallback((item) => {
    if (item.type === 'folder') {
      onFolderDoubleClick(item.id, item.label);
    } else {
      onIconDoubleClick(item.id, item.label);
    }
  }, [onFolderDoubleClick, onIconDoubleClick]);

  const handleDrop = useCallback((draggedIconId, targetFolderId) => {
    if (onMoveIcon) {
      onMoveIcon(draggedIconId, folderId, targetFolderId);
    }
  }, [onMoveIcon, folderId]);

  const handleDragStart = useCallback((e, itemId) => {
    e.dataTransfer.setData('text/plain', itemId);
  }, []);

  return (
    <div className="folder-window">
      <div className="folder-content-grid">
        {folderData.contents.map(item => {
          return (
            <Icon
              key={item.id}
              id={item.id}
              label={item.label}
              iconSrc={item.iconSrc}
              type={item.type}
              onDoubleClick={() => handleItemDoubleClick(item)}
              isSelected={selectedItem === item.id}
              onSelect={item.type === 'folder' ? onFolderSelect : onIconSelect}
              onDrop={item.type === 'folder' ? handleDrop : undefined}
              draggable={false}
            />
          );
        })}
      </div>
    </div>
  );
});

Explorer.displayName = 'Explorer';

export default Explorer;