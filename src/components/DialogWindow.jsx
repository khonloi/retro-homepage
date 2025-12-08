import React, { useState, useEffect, useCallback, memo } from "react";
import { useDragDrop } from "../hooks/useDragDrop";
import "../css/Window.css";

const DialogWindow = memo(({
  id,
  title,
  onClose,
  onFocus,
  children,
  initialPosition = { x: 100, y: 100 },
  zIndex = 1000,
  centered = false,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isLoading, setIsLoading] = useState(true);
  const MENU_BAR_HEIGHT = 30; // Height of the menu bar

  // Memoize position update handler for better performance
  const handlePositionChange = useCallback((_, newPos) => {
    setPosition(newPos);
  }, []);

  const { elementRef, handleMouseDown, handleTouchStart } = useDragDrop(
    id,
    position,
    handlePositionChange,
    onFocus
  );

  // Simulate loading delay - only run once
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Memoize event handlers
  const handleTitleBarMouseDown = useCallback((e) => {
    if (!e.target.closest(".window-title-bar")) return;
    handleMouseDown(e);
  }, [handleMouseDown]);
  
  const handleTitleBarTouchStart = useCallback((e) => {
    if (!e.target.closest(".window-title-bar")) return;
    handleTouchStart(e);
  }, [handleTouchStart]);

  const handleCloseClick = useCallback(() => {
    if (onClose) {
      onClose(id);
    }
  }, [id, onClose]);

  // Don't render if still loading
  if (isLoading) {
    return null;
  }

  // Compute window style
  const windowStyle = centered ? {
    position: "relative",
    width: "auto",
    height: "auto",
    zIndex: zIndex,
  } : {
    position: "absolute",
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: "auto",
    height: "auto",
    zIndex: zIndex,
  };

  return (
    <div
      ref={elementRef}
      className="windows-window"
      style={windowStyle}
      onMouseDown={handleTitleBarMouseDown}
      onTouchStart={handleTitleBarTouchStart}
    >
      <div className="window-title-bar">
        <span className="window-title">{title}</span>
        <div className="window-controls">
          <button
            className="window-button control-button"
            onClick={handleCloseClick}
            title="Close Window"
            aria-label="Close Window"
          >
            ×
          </button>
        </div>
      </div>
      <div className="window-content">{children}</div>
    </div>
  );
});

DialogWindow.displayName = 'DialogWindow';

export default DialogWindow; 