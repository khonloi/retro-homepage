import React, { memo } from "react";
import { useWindowInstance } from "../hooks/useWindowInstance";
import "../css/Window.css";

const Window = memo(
  ({
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
    isFocused = false,
  }) => {
    const {
      elementRef,
      position,
      isLoading,
      isMaximized,
      isMobile,
      isFullScreenActive,
      windowDimensions,
      previewPosition,
      isDragging,
      hasCentered,
      handleTitleBarMouseDown,
      handleTouchStart,
      handleTouchEnd,
      handleMinimizeClick,
      handleMaximizeClick,
      handleCloseClick,
      MENU_BAR_HEIGHT,
    } = useWindowInstance({
      id,
      title,
      icon,
      onClose,
      onMinimize,
      onFocus,
      onFullScreenChange,
      onLoadingChange,
      initialPosition,
      isMinimized,
      isFullScreen,
    });

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
                  aria-label={
                    isMaximized ? "Restore Window" : "Maximize Window"
                  }
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

    // Hide window until it's centered (if it needs centering and not on mobile)
    // On mobile, windows are automatically maximized so don't hide them
    const needsCentering =
      !isMobile && !isFullScreenActive && initialPosition?.shouldCenter && !hasCentered;

    const windowStyle = {
      position: "absolute",
      left: isFullScreenActive
        ? 0
        : isMaximized || isMobile
          ? 0
          : `${position.x}px`,
      top: isFullScreenActive
        ? 0
        : isMaximized || isMobile
          ? MENU_BAR_HEIGHT
          : `${position.y}px`,
      width: isFullScreenActive
        ? "100vw"
        : isMaximized || isMobile
          ? "100vw"
          : "auto",
      height: isFullScreenActive
        ? "100vh"
        : isMaximized || isMobile
          ? `calc(100vh - ${MENU_BAR_HEIGHT}px)`
          : "auto",
      zIndex: isFullScreenActive ? 10000 : zIndex,
      visibility: needsCentering ? "hidden" : "visible",
    };

    return (
      <>
        <div
          ref={elementRef}
          className={`windows-window 
        ${isFullScreenActive ? "fullscreen" : ""} 
        ${isMaximized || isMobile ? "maximized" : ""} 
        ${isFocused ? "focused" : ""}
        ${isDragging ? "dragging" : ""}`}
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
        {isDragging && !isMaximized && !isMobile && !isFullScreenActive && (
          <div
            className="window-outline"
            style={{
              left: `${previewPosition.x}px`,
              top: `${previewPosition.y}px`,
              width: `${windowDimensions.width}px`,
              height: `${windowDimensions.height}px`,
            }}
          />
        )}
      </>
    );
  }
);

Window.displayName = "Window";

export default Window;
