import React, { useState, useCallback, memo, useEffect, useMemo } from "react";
import Icon from "./Icon";
import Window from "./Window";
import Explorer from "./Explorer";
import Taskbar from "./Taskbar";
import MenuBar from "./MenuBar";
import LoadingScreen from "./LoadingScreen";
import { useWindow } from "../hooks/useWindow";
import { useDesktop } from "../hooks/useDesktop";
import { useLoadingScreen } from "../hooks/useLoadingScreen";
import { useWindowManager } from "../hooks/useWindowManager";
import { useShutdown } from "../hooks/useShutdown";
import { playSound } from "../utilities/sounds";
import { getCursorStyle } from "../utilities/cursors";
import "../css/Desktop.css";
import "../css/Explorer.css";
import "../css/Taskbar.css";
import "../css/MenuBar.css";
import { desktopItems, renderWindowContent } from "../config/programConfig";

const Desktop = memo(({ onFullScreenChange }) => {
  const { openWindows, openWindow, closeWindow, focusWindow, focusedWindow } = useWindow();
  const { allDesktopItems, itemPositions, handleItemPositionChange } =
    useDesktop();
  const { isLoading, isDelaying, progress, menuBarVisible, skipLoading } =
    useLoadingScreen();
  const {
    minimizedWindows,
    loadingWindows,
    handleItemDoubleClick: handleItemDoubleClickBase,
    handleMinimizeWindow,
    handleRestoreWindow: handleRestoreWindowBase,
    handleCloseWindow: handleCloseWindowBase,
  } = useWindowManager();
  const { isShuttingDown, shutdownStage, startShutdown } = useShutdown();

  const [selectedIcon, setSelectedIcon] = useState(null);
  const [isTaskbarCollapsed, setIsTaskbarCollapsed] = useState(false);
  const [windowLoadingStates, setWindowLoadingStates] = useState({});
  const [hasStarted, setHasStarted] = useState(false);
  // Track loading state of each window

  const handleItemDoubleClick = useCallback(
    (id, label) => {
      handleItemDoubleClickBase(
        id,
        label,
        openWindows,
        openWindow,
        focusWindow
      );
    },
    [handleItemDoubleClickBase, openWindows, openWindow, focusWindow]
  );

  const handleRestoreWindow = useCallback(
    (windowId) => {
      handleRestoreWindowBase(windowId, focusWindow);
    },
    [handleRestoreWindowBase, focusWindow]
  );

  const handleCloseWindow = useCallback(
    (windowId) => {
      handleCloseWindowBase(windowId, closeWindow);
      setWindowLoadingStates((prev) => {
        const newStates = { ...prev };
        delete newStates[windowId];
        return newStates;
      });
    },
    [handleCloseWindowBase, closeWindow]
  );

  const handleDesktopClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setSelectedIcon(null);
    }
  }, []);

  const handleShutdown = useCallback(() => {
    startShutdown();
  }, [startShutdown]);

  const handleToggleTaskbarCollapse = useCallback(async () => {
    const newCollapsedState = !isTaskbarCollapsed;
    setIsTaskbarCollapsed(newCollapsedState);
    const soundType = newCollapsedState ? "collapse" : "expand";
    await playSound(soundType);
  }, [isTaskbarCollapsed]);

  // Memoize folder data lookup for better performance
  const folderDataMap = useMemo(() => {
    const map = new Map();
    desktopItems.forEach((item) => {
      if (item.type === "folder") {
        map.set(item.id, item);
      }
    });
    return map;
  }, []);

  const renderFolderContent = useCallback(
    (folderId) => {
      const folderData = folderDataMap.get(folderId);
      if (!folderData) return <div role="alert">Folder not found</div>;

      return (
        <Explorer
          folderId={folderId}
          folderData={folderData}
          onIconDoubleClick={handleItemDoubleClick}
          onFolderDoubleClick={handleItemDoubleClick}
          onIconPositionChange={handleItemPositionChange}
          onFolderPositionChange={handleItemPositionChange}
          onIconSelect={setSelectedIcon}
          onFolderSelect={setSelectedIcon}
          selectedItem={selectedIcon}
        />
      );
    },
    [
      folderDataMap,
      handleItemDoubleClick,
      handleItemPositionChange,
      selectedIcon,
    ]
  );

  // Handle window loading state changes
  const handleWindowLoadingChange = useCallback((windowId, isLoading) => {
    setWindowLoadingStates((prev) => ({
      ...prev,
      [windowId]: isLoading,
    }));
  }, []);

  // Handle startup sequence
  useEffect(() => {
    if (!isLoading && !isDelaying && !hasStarted && !isShuttingDown) {
      const startup = async () => {
        try {
          await playSound("startup");
        } catch (error) {
          console.warn("Startup sound failed:", error);
        }

        const startups = desktopItems.filter((item) => item.startup === true);
        for (const item of startups) {
          handleItemDoubleClick(item.id, item.label);
        }

        setHasStarted(true);
      };

      startup();
    }
  }, [
    isLoading,
    isDelaying,
    hasStarted,
    isShuttingDown,
    handleItemDoubleClick,
  ]);

  // Handle cursor state during shutdown
  useEffect(() => {
    if (isShuttingDown && shutdownStage < 2) {
      document.body.style.cursor = getCursorStyle("wait");
    }
  }, [isShuttingDown, shutdownStage]);

  // Memoize minimized window IDs for faster lookup
  const minimizedWindowIds = useMemo(
    () => new Set(minimizedWindows.map((mw) => mw.id)),
    [minimizedWindows]
  );

  // Memoize full-screen window calculation to avoid duplicate computation
  const hasFullScreenWindow = useMemo(() => {
    return openWindows.some(
      (win) =>
        win.isFullScreen &&
        !minimizedWindowIds.has(win.id) &&
        windowLoadingStates[win.id] === false
    );
  }, [openWindows, minimizedWindowIds, windowLoadingStates]);

  // Notify parent of full-screen state
  useEffect(() => {
    onFullScreenChange?.(hasFullScreenWindow);
  }, [hasFullScreenWindow, onFullScreenChange]);

  if (isLoading) {
    return <LoadingScreen progress={progress} onSkip={skipLoading} />;
  }

  if (isShuttingDown && shutdownStage === 2) {
    return <LoadingScreen mode="shutdown" onComplete={() => window.close()} />;
  }

  if (isDelaying) {
    return (
      <>
        <MenuBar visible={menuBarVisible} />
        <div
          className="desktop delaying"
          onClick={handleDesktopClick}
          onDragOver={(e) => e.preventDefault()}
          role="main"
          aria-label="Desktop environment"
        >
          <Taskbar
            minimizedWindows={minimizedWindows}
            onRestore={handleRestoreWindow}
            isCollapsed={isTaskbarCollapsed}
            onToggleCollapse={handleToggleTaskbarCollapse}
            aria-label="System Taskbar"
          />
        </div>
      </>
    );
  }

  return (
    <>
      {!hasFullScreenWindow && (
        <MenuBar
          visible={menuBarVisible && shutdownStage === 0}
          onShutdown={handleShutdown}
        />
      )}
      <div
        className={`desktop ${loadingWindows.size > 0 ? "loading" : ""} ${shutdownStage === 1 ? "shutting-down" : ""
          } ${hasFullScreenWindow ? "fullscreen" : ""}`}
        onClick={handleDesktopClick}
        onDragOver={(e) => e.preventDefault()}
        role="main"
        aria-label="Desktop environment"
      >
        {allDesktopItems.map((item) => {
          return (
            <Icon
              key={item.id}
              id={item.id}
              label={item.label}
              iconSrc={item.iconSrc}
              type={item.type}
              position={itemPositions[item.id]}
              onPositionChange={handleItemPositionChange}
              onDoubleClick={() => handleItemDoubleClick(item.id, item.label)}
              isSelected={selectedIcon === item.id}
              onSelect={setSelectedIcon}
              aria-label={`${item.label} ${item.type === "folder" ? "folder" : "application"
                }`}
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  "text/plain",
                  JSON.stringify({ id: item.id })
                );
              }}
            />
          );
        })}

        {openWindows.map((win) => {
          const isMinimized = minimizedWindowIds.has(win.id);

          return (
            <Window
              key={win.id}
              id={win.id}
              title={win.title}
              icon={win.iconSrc}
              initialPosition={win.initialPosition}
              zIndex={win.zIndex}
              isMinimized={isMinimized}
              isMaximizable={win.isMaximizable}
              isFullScreen={win.isFullScreen}
              isFocused={win.id === focusedWindow}
              onClose={handleCloseWindow}
              onMinimize={handleMinimizeWindow}
              onFocus={focusWindow}
              onFullScreenChange={onFullScreenChange}
              onLoadingChange={handleWindowLoadingChange} // New prop
              aria-label={`${win.title} window`}
            >
              {win.type === "folder"
                ? renderFolderContent(win.folderId)
                : renderWindowContent(win.id, win.title)}
            </Window>
          );
        })}

        {!hasFullScreenWindow && (
          <Taskbar
            minimizedWindows={minimizedWindows}
            onRestore={handleRestoreWindow}
            isCollapsed={isTaskbarCollapsed}
            onToggleCollapse={handleToggleTaskbarCollapse}
            aria-label="System Taskbar"
          />
        )}
      </div>
    </>
  );
});

Desktop.displayName = "Desktop";

export default Desktop;
