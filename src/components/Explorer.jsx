import Icon from './Icon';
import Folder from './Folder';
import '../css/Explorer.css';

const Explorer = ({ 
  folderId, 
  folderData, 
  onIconDoubleClick, 
  onFolderDoubleClick,
  onIconSelect, 
  onFolderSelect,
  selectedItem,
  onMoveIcon,
}) => {
  const handleItemDoubleClick = (item) => {
    if (item.type === 'folder') {
      onFolderDoubleClick(item.id, item.label);
    } else {
      onIconDoubleClick(item.id, item.label);
    }
  };

  const handleDrop = (draggedIconId, targetFolderId) => {
    if (onMoveIcon) {
      onMoveIcon(draggedIconId, folderId, targetFolderId);
    }
  };

  const handleDragStart = (e, itemId) => {
    e.dataTransfer.setData('text/plain', itemId);
  };

  return (
    <div className="folder-window">
      <div className="folder-content-grid">
        {folderData.contents.map(item => {
          if (item.type === 'folder') {
            return (
              <Folder
                key={item.id}
                id={item.id}
                label={item.label}
                iconSrc={item.iconSrc}
                onDoubleClick={() => handleItemDoubleClick(item)}
                isSelected={selectedItem === item.id}
                onSelect={onFolderSelect}
                onDrop={handleDrop}
              />
            );
          } else {
            return (
              <Icon
                key={item.id}
                id={item.id}
                label={item.label}
                iconSrc={item.iconSrc}
                onDoubleClick={() => handleItemDoubleClick(item)}
                isSelected={selectedItem === item.id}
                onSelect={onIconSelect}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default Explorer;