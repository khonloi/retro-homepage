import React, { useState, useEffect, useCallback, memo } from "react";
import { useDragDrop } from "../hooks/useDragDrop";
import "../css/Window.css";

const Window = memo(({
  id,
  title,
  icon,
  onClose,
  onMinimize,
  onFocus,
  onFullScreenChange,
  onLoadingChange,
  children,
  initialPosition = { x: 100, y: 100 },
  zIndex = 1000,
  isMinimized = false,
  isMaximizable = true,
  isFullScreen = false,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isLoading, setIsLoading] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaximizePosition, setPreMaximizePosition] = useState(initialPosition);
  const [preMobileState, setPreMobileState] = useState(null);
  const [isFullScreenActive, setIsFullScreenActive] = useState(isFullScreen);
  const [touchStartTime, setTouchStartTime] = useState(null);
  const MENU_BAR_HEIGHT = 30;

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Notify parent of full-screen state changes
  useEffect(() => {
    onFullScreenChange?.(isFullScreenActive && !isMinimized);
  }, [isFullScreenActive, isMinimized, onFullScreenChange]);

  // Notify parent of loading state changes
  useEffect(() => {
    onLoadingChange?.(id, isLoading);
  }, [isLoading, id, onLoadingChange]);

  // Handle mobile detection and state transitions
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      
      if (mobile && !isMobile && !isMinimized && !isFullScreenActive) {
        setPreMobileState({
          position,
          isMaximized,
        });
        setPreMaximizePosition(position);
        setPosition({ x: 0, y: MENU_BAR_HEIGHT });
        setIsMaximized(true);
      } else if (!mobile && isMobile && preMobileState && !isMinimized && !isFullScreenActive) {
        setPosition(preMobileState.position);
        setIsMaximized(preMobileState.isMaximized);
        setPreMobileState(null);
      }
      
      setIsMobile(mobile);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, isMinimized, position, isMaximized, preMobileState, MENU_BAR_HEIGHT, isFullScreenActive]);

  // Handle ESC key to close full-screen window
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullScreenActive) {
        onFullScreenChange?.(false); // Notify parent before closing
        onClose(id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreenActive, id, onClose, onFullScreenChange]);

  const handlePositionChange = useCallback((_, newPos) => {
    if (!isMaximized && !isMobile && !isFullScreenActive) setPosition(newPos);
  }, [isMaximized, isMobile, isFullScreenActive]);

  const { elementRef, handleMouseDown, handleTouchStart: dragTouchStart } = useDragDrop(
    id,
    position,
    handlePositionChange,
    onFocus
  );

  const handleTitleBarMouseDown = useCallback((e) => {
    if (!e.target.closest(".window-title-bar") || isMaximized || isMobile || isFullScreenActive) return;
    handleMouseDown(e);
  }, [handleMouseDown, isMaximized, isMobile, isFullScreenActive]);

  const handleTitleBarTouchStart = useCallback((e) => {
    if (!e.target.closest(".window-title-bar") || isMaximized || isMobile || isFullScreenActive) return;
    dragTouchStart(e);
  }, [dragTouchStart, isMaximized, isMobile, isFullScreenActive]);

  const handleTouchStart = useCallback((e) => {
    if (isFullScreenActive && isMobile) {
      setTouchStartTime(Date.now());
    }
    handleTitleBarTouchStart(e);
  }, [isFullScreenActive, isMobile, handleTitleBarTouchStart]);

  const handleTouchEnd = useCallback(() => {
    if (isFullScreenActive && isMobile && touchStartTime) {
      const touchDuration = Date.now() - touchStartTime;
      if (touchDuration >= 1000) {
        onFullScreenChange?.(false); // Notify parent before closing
        onClose(id);
      }
    }
    setTouchStartTime(null);
  }, [isFullScreenActive, isMobile, touchStartTime, id, onClose, onFullScreenChange]);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const handleMinimizeClick = useCallback(() => {
    if (onMinimize) {
      setIsFullScreenActive(false);
      onMinimize(id, { title, icon, position });
    }
  }, [id, title, icon, position, onMinimize]);

  const handleMaximizeClick = useCallback(() => {
    if (isMobile || isFullScreenActive) return;
    if (isMaximized) {
      setPosition(preMaximizePosition);
      setIsMaximized(false);
    } else {
      setPreMaximizePosition(position);
      setPosition({ x: 0, y: MENU_BAR_HEIGHT });
      setIsMaximized(true);
    }
  }, [isMaximized, position, preMaximizePosition, MENU_BAR_HEIGHT, isMobile, isFullScreenActive]);

  const handleCloseClick = useCallback(() => {
    if (onClose) {
      setIsFullScreenActive(false);
      onClose(id);
    }
  }, [id, onClose]);

  if (isLoading) {
    return null;
  }

  if (isMinimized) {
    return (
      <div
        ref={elementRef}
        className="windows-window minimized"
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "auto",
          height: "auto",
          zIndex: zIndex,
          visibility: "hidden",
          pointerEvents: "none",
        }}
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
            {!isMobile && isMaximizable && (
              <button
                className="window-button control-button"
                onClick={handleMaximizeClick}
                title={isMaximized ? "Restore Window" : "Maximize Window"}
                aria-label={isMaximized ? "Restore Window" : "Maximize Window"}
              >
                •
              </button>
            )}
            <button
              className="window-button control-button"
              onClick={handleMinimizeClick}
              title="Minimize Window"
              aria-label="Minimize Window"
            >
              -
            </button>
          </div>
        </div>
        <div className="window-content">{children}</div>
      </div>
    );
  }

  const windowStyle = {
    position: "absolute",
    left: isFullScreenActive ? 0 : (isMaximized || isMobile) ? 0 : `${position.x}px`,
    top: isFullScreenActive ? 0 : (isMaximized || isMobile) ? MENU_BAR_HEIGHT : `${position.y}px`,
    width: isFullScreenActive ? "100vw" : (isMaximized || isMobile) ? "100vw" : "auto",
    height: isFullScreenActive ? "100vh" : (isMaximized || isMobile) ? `calc(100vh - ${MENU_BAR_HEIGHT}px)` : "auto",
    zIndex: isFullScreenActive ? 10000 : zIndex,
  };

  return (
    <div
      ref={elementRef}
      className={`windows-window ${isFullScreenActive ? "fullscreen" : (isMaximized || isMobile) ? "maximized" : ""}`}
      style={windowStyle}
      onMouseDown={handleTitleBarMouseDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={isFullScreenActive ? handleTouchEnd : undefined}
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
          {!isMobile && isMaximizable && !isFullScreenActive && (
            <button
              className="window-button control-button"
              onClick={handleMaximizeClick}
              title={isMaximized ? "Restore Window" : "Maximize Window"}
              aria-label={isMaximized ? "Restore Window" : "Maximize Window"}
            >
              •
            </button>
          )}
          <button
            className="window-button control-button"
            onClick={handleMinimizeClick}
            title="Minimize Window"
            aria-label="Minimize Window"
          >
            -
          </button>
        </div>
      </div>
      <div className="window-content">{children}</div>
    </div>
  );
});

Window.displayName = 'Window';

export default Window;