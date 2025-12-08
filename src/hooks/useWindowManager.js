import { useState, useCallback } from 'react';
import { desktopItems } from "../config/programConfig";
import { playSound } from '../utilities/sounds';

export const useWindowManager = () => {
  const [minimizedWindows, setMinimizedWindows] = useState([]);
  const [loadingWindows, setLoadingWindows] = useState(new Set());
  
  // Sound effects for window operations
  const playWindowSound = useCallback(async (soundType) => {
    await playSound(soundType);
  }, []);
  
  // Handle window operations
  const handleItemDoubleClick = useCallback((id, label, openWindows, openWindow, focusWindow) => {
    const item = desktopItems.find(item => item.id === id) || 
                 desktopItems
                   .flatMap(folder => folder.contents || [])
                   .find(item => item.id === id);
    
    if (!item) {
      console.warn(`Item with id ${id} not found`);
      return;
    }

    // Check if item has a link property
    if (item.link) {
      window.open(item.link, "_blank", "noopener,noreferrer");
      // Play a sound for opening a link
      playWindowSound('open');
      return;
    }

    const isMaximizable = item.isMaximizable ?? true;
    const isFullScreen = item.isFullScreen ?? false; // Add isFullScreen
    const iconSrc = item.iconSrc;

    const isWindowOpen = openWindows.some(win => win.id === id);
    const isWindowMinimized = minimizedWindows.some(win => win.id === id);

    if (isWindowOpen) {
      if (isWindowMinimized) {
        // Restore window
        setMinimizedWindows(prev => prev.filter(w => w.id !== id));
        setTimeout(() => focusWindow(id), 10);
        // Play maximize sound
        playWindowSound('maximize');
      } else {
        // Just focus the window
        focusWindow(id);
      }
      return;
    }

    // Add window to loading state
    setLoadingWindows(prev => new Set(prev).add(id));

    // Remove from loading state after 2 seconds
    setTimeout(() => {
      setLoadingWindows(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 2000);

    // Pass window data including isFullScreen
    openWindow({
      id,
      title: label,
      type: item.type,
      folderId: item.type === "folder" ? id : undefined,
      isMaximizable,
      isFullScreen, // Include isFullScreen
      iconSrc,
    });
  }, [minimizedWindows, playWindowSound]);

  const handleMinimizeWindow = useCallback(async (windowId, windowData) => {
    const item = desktopItems.find(item => item.id === windowId) || 
                 desktopItems
                   .flatMap(folder => folder.contents || [])
                   .find(item => item.id === windowId);
    
    const iconSrc = item?.iconSrc;

    setMinimizedWindows(prev => {
      if (prev.find(w => w.id === windowId)) return prev;
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