import React, { useState, useEffect } from 'react';
import DialogWindow from './DialogWindow';
import '../css/ShutdownDialog.css';
import monitorMoonIcon from '../assets/icons/Microsoft Windows 3 Post-It.ico';

const ShutdownDialog = ({ isVisible, onClose, onShutdown }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload the icon image when dialog becomes visible
  useEffect(() => {
    if (isVisible && !imageLoaded) {
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true);
      };
      img.onerror = () => {
        // Even if image fails to load, allow the dialog to render
        setImageLoaded(true);
      };
      img.src = monitorMoonIcon;
    }
    
    // Reset image loaded state when dialog is hidden
    if (!isVisible) {
      setImageLoaded(false);
    }
  }, [isVisible, imageLoaded]);

  if (!isVisible) return null;

  const handleOK = () => {
    onClose();
    onShutdown?.();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="shutdown-overlay">
      {imageLoaded && (
      <DialogWindow
        id="shutdown-dialog"
        title="Exit Session"
        onClose={onClose}
        onFocus={() => {}}
        zIndex={20000}
        centered={true}
      >
        <div className="shutdown-dialog-content">
          <p>
            <img src={monitorMoonIcon} alt="Monitor Moon Icon" className="dialog-icon" />
            Do you want to end your Pane?
          </p>
          <div className="shutdown-dialog-buttons">
            <button className="window-button program-button" onClick={handleOK}>
              Yes
            </button>
            <button className="window-button program-button" onClick={handleCancel}>
              No
            </button>
          </div>
        </div>
      </DialogWindow>
      )}
    </div>
  );
};

export default ShutdownDialog;