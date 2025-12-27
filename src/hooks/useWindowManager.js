import { useState, useCallback, useMemo, useRef } from 'react';
import { desktopItems } from "../config/programConfig";
import { playSound } from '../utilities/sounds';

// Flatten desktop items for faster lookup - created at module level
const flattenDesktopItems = (items) => {
  const flatMap = new Map();
  items.forEach(item => {
    flatMap.set(item.id, item);
    if (item.contents) {
      item.contents.forEach(subItem => {
        flatMap.set(subItem.id, subItem);
      });
    }
  });
  return flatMap;
};

const desktopItemsMap = flattenDesktopItems(desktopItems);

export const useWindowManager = () => {
  const [minimizedWindows, setMinimizedWindows] = useState([]);
  const [loadingWindows, setLoadingWindows] = useState(new Set());
  const loadingTimeoutsRef = useRef(new Map()); // Track timeouts to avoid stale closures
  
  // Memoize minimized window IDs for faster lookup
  const minimizedWindowIds = useMemo(
    () => new Set(minimizedWindows.map(w => w.id)),
    [minimizedWindows]
  );
  
  // Sound effects for window operations
  const playWindowSound = useCallback(async (soundType) => {
    try {
      await playSound(soundType);
    } catch (error) {
      console.warn('Failed to play window sound:', error);
    }
  }, []);
  
  // Handle window operations - optimized with Map lookup
  const handleItemDoubleClick = useCallback((id, label, openWindows, openWindow, focusWindow) => {
    const item = desktopItemsMap.get(id);
    
    if (!item) {
      console.warn(`Item with id ${id} not found`);
      return;
    }

    // Check if item has a link property
    if (item.link) {
      window.open(item.link, "_blank", "noopener,noreferrer");
      playWindowSound('open');
      return;
    }

    const isMaximizable = item.isMaximizable ?? true;
    const isFullScreen = item.isFullScreen ?? false;
    const iconSrc = item.iconSrc;

    const isWindowOpen = openWindows.some(win => win.id === id);
    const isWindowMinimized = minimizedWindowIds.has(id);

    if (isWindowOpen) {
      if (isWindowMinimized) {
        // Restore window
        setMinimizedWindows(prev => prev.filter(w => w.id !== id));
        setTimeout(() => focusWindow(id), 10);
        playWindowSound('maximize');
      } else {
        // Just focus the window
        focusWindow(id);
      }
      return;
    }

    // Add window to loading state
    setLoadingWindows(prev => new Set(prev).add(id));

    // Clear any existing timeout for this window
    const existingTimeout = loadingTimeoutsRef.current.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Remove from loading state after 2 seconds
    const timeoutId = setTimeout(() => {
      setLoadingWindows(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      loadingTimeoutsRef.current.delete(id);
    }, 2000);
    
    loadingTimeoutsRef.current.set(id, timeoutId);

    // Pass window data including isFullScreen
    openWindow({
      id,
      title: label,
      type: item.type,
      folderId: item.type === "folder" ? id : undefined,
      isMaximizable,
      isFullScreen,
      iconSrc,
    });
  }, [minimizedWindowIds, playWindowSound]);

  const handleMinimizeWindow = useCallback(async (windowId, windowData) => {
    const item = desktopItemsMap.get(windowId);
    const iconSrc = item?.iconSrc;

    setMinimizedWindows(prev => {
      // Check if already minimized
      if (prev.some(w => w.id === windowId)) return prev;
      return [...prev, {
        id: windowId,
        title: windowData.title,
        icon: iconSrc,
      }];
    });

    // Play minimize sound
    await playWindowSound('minimize');
  }, [playWindowSound]);

  const handleRestoreWindow = useCallback(async (windowId, focusWindow) => {
    setMinimizedWindows(prev => prev.filter(w => w.id !== windowId));
    setTimeout(() => focusWindow(windowId), 10);
    
    // Play maximize sound
    await playWindowSound('maximize');
  }, [playWindowSound]);

  const handleCloseWindow = useCallback((windowId, closeWindow) => {
    closeWindow(windowId);
    setMinimizedWindows(prev => prev.filter(w => w.id !== windowId));
  }, []);

  return {
    minimizedWindows,
    loadingWindows,
    handleItemDoubleClick,
    handleMinimizeWindow,
    handleRestoreWindow,
    handleCloseWindow
  };
};