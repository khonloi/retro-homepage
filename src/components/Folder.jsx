// src/components/Folder.jsx
import DraggableItem from './DraggableItem';
import "../css/Icon.css";
import folderIcon from '../assets/icons/Microsoft Windows 3 Folder.ico';

const Folder = ({ onDrop, ...props }) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const draggedIconId = e.dataTransfer.getData('text/plain');
    if (onDrop && draggedIconId) {
      onDrop(draggedIconId, props.id);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <DraggableItem
        {...props}
        defaultIcon={folderIcon}
        className="windows-icon"
      />
    </div>
  );
};

export default Folder;