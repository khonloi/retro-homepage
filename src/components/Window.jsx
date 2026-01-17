import React, { useState, useEffect, useCallback, memo } from "react";
import { useDragDrop } from "../hooks/useDragDrop";
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
    // Extract position from initialPosition (handles both {x, y} and {x, y, shouldCenter} formats)
    const getInitialPos = (pos) => {
      if (!pos) return { x: 100, y: 100 };
      if (pos.shouldCenter) return { x: 0, y: 0 };
      return { x: pos.x || 100, y: pos.y || 100 };
    };

    const [position, setPosition] = useState(getInitialPos(initialPosition));
    const [isLoading, setIsLoading] = useState(true);
    const [isMaximized, setIsMaximized] = useState(false);
    const [preMaximizePosition, setPreMaximizePosition] = useState(
      getInitialPos(initialPosition)
    );
    const [preMobileState, setPreMobileState] = useState(null);
    const [isFullScreenActive, setIsFullScreenActive] = useState(isFullScreen);
    const [touchStartTime, setTouchStartTime] = useState(null);
    const [hasCentered, setHasCentered] = useState(false);
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

    // Handle mobile detection and state transitions - debounced for performance
    useEffect(() => {
      let resizeTimer;

      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const mobile = window.innerWidth <= 768;

          if (mobile && !isMobile && !isMinimized && !isFullScreenActive) {
            setPreMobileState({
              position,
              isMaximized,
            });
            setPreMaximizePosition(position);
            setPosition({ x: 0, y: MENU_BAR_HEIGHT });
            setIsMaximized(true);
          } else if (
            !mobile &&
            isMobile &&
            preMobileState &&
            !isMinimized &&
            !isFullScreenActive
          ) {
            setPosition(preMobileState.position);
            setIsMaximized(preMobileState.isMaximized);
            setPreMobileState(null);
          }

          setIsMobile(mobile);
        }, 150); // Debounce resize events
      };

      window.addEventListener("resize", handleResize);
      handleResize();

      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(resizeTimer);
      };
    }, [
      isMobile,
      isMinimized,
      position,
      isMaximized,
      preMobileState,
      MENU_BAR_HEIGHT,
      isFullScreenActive,
    ]);

    // Handle ESC key to close full-screen window
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "Escape" && isFullScreenActive) {
          onFullScreenChange?.(false); // Notify parent before closing
          onClose(id);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isFullScreenActive, id, onClose, onFullScreenChange]);

    const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

    const handlePositionChange = useCallback(
      (_, newPos) => {
        if (!isMaximized && !isMobile && !isFullScreenActive)
          setPosition(newPos);
      },
      [isMaximized, isMobile, isFullScreenActive]
    );

    const {
      elementRef,
      isDragging,
      previewPosition,
      handleMouseDown,
      handleTouchStart: dragTouchStart,
    } = useDragDrop(id, position, handlePositionChange, onFocus, { useOutline: true });

    // Track dimensions when dragging starts
    useEffect(() => {
      if (isDragging && elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setWindowDimensions({ width: rect.width, height: rect.height });
      }
    }, [isDragging, elementRef]);

    const handleTitleBarMouseDown = useCallback(
      (e) => {
        if (
          !e.target.closest(".window-title-bar") ||
          e.target.closest(".control-button") ||
          isMaximized ||
          isMobile ||
          isFullScreenActive
        )
          return;
        handleMouseDown(e);
      },
      [handleMouseDown, isMaximized, isMobile, isFullScreenActive]
    );

    const handleTitleBarTouchStart = useCallback(
      (e) => {
        if (
          !e.target.closest(".window-title-bar") ||
          e.target.closest(".control-button") ||
          isMaximized ||
          isMobile ||
          isFullScreenActive
        )
          return;
        dragTouchStart(e);
      },
      [dragTouchStart, isMaximized, isMobile, isFullScreenActive]
    );

    const handleTouchStart = useCallback(
      (e) => {
        if (isFullScreenActive && isMobile) {
          setTouchStartTime(Date.now());
        }
        handleTitleBarTouchStart(e);
      },
      [isFullScreenActive, isMobile, handleTitleBarTouchStart]
    );

    const handleTouchEnd = useCallback(() => {
      if (isFullScreenActive && isMobile && touchStartTime) {
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration >= 1000) {
          onFullScreenChange?.(false); // Notify parent before closing
          onClose(id);
        }
      }
      setTouchStartTime(null);
    }, [
      isFullScreenActive,
      isMobile,
      touchStartTime,
      id,
      onClose,
      onFullScreenChange,
    ]);

    useEffect(() => {
      const loadingTimer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(loadingTimer);
    }, []);

    // Center window after it's rendered and measured
    useEffect(() => {
      // Wait for loading to complete
      if (isLoading) return;

      // On mobile, windows are automatically maximized - mark as ready immediately
      if (isMobile) {
        setHasCentered(true);
        return;
      }

      if (isMinimized || isMaximized || isFullScreenActive || hasCentered)
        return;

      // If window doesn't need centering, mark as ready immediately
      if (!initialPosition || !initialPosition.shouldCenter) {
        setHasCentered(true);
        return;
      }

      if (!elementRef.current) return;

      // Wait for next frame to ensure window is fully rendered
      const centerWindow = () => {
        if (!elementRef.current) return;

        const windowElement = elementRef.current;
        const windowRect = windowElement.getBoundingClientRect();
        const windowWidth = windowRect.width;
        const windowHeight = windowRect.height;

        // If dimensions are 0, wait a bit more
        if (windowWidth === 0 || windowHeight === 0) {
          requestAnimationFrame(centerWindow);
          return;
        }

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate center position
        const centerX = (viewportWidth - windowWidth) / 2;
        // Center vertically in the available space below the menu bar
        const availableHeight = viewportHeight - MENU_BAR_HEIGHT;
        const centerY = MENU_BAR_HEIGHT + (availableHeight - windowHeight) / 2;

        // Ensure window stays within viewport bounds
        const finalX = Math.max(
          0,
          Math.min(centerX, viewportWidth - windowWidth)
        );
        const finalY = Math.max(
          MENU_BAR_HEIGHT,
          Math.min(centerY, viewportHeight - windowHeight)
        );

        setPosition({ x: finalX, y: finalY });
        setPreMaximizePosition({ x: finalX, y: finalY });
        setHasCentered(true);
      };

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(centerWindow);
      });
    }, [
      isLoading,
      isMinimized,
      isMaximized,
      isMobile,
      isFullScreenActive,
      hasCentered,
      initialPosition,
      MENU_BAR_HEIGHT,
    ]);

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
    }, [
      isMaximized,
      position,
      preMaximizePosition,
      MENU_BAR_HEIGHT,
      isMobile,
      isFullScreenActive,
    ]);

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
    // On mobile, windows are always maximized so don't hide them
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
