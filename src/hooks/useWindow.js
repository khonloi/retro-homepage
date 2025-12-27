import { useState, useCallback, useMemo, useRef } from 'react';

export const useWindow = () => {
  const [openWindows, setOpenWindows] = useState([]);
  const [focusedWindow, setFocusedWindow] = useState(null);
  const nextZIndexRef = useRef(1000);

  const focusWindow = useCallback((id) => {
    if (focusedWindow === id) return; // Already focused, no need to update
    
    const newZIndex = nextZIndexRef.current + 1;
    nextZIndexRef.current = newZIndex;
    
    setFocusedWindow(id);
    setOpenWindows(prev => {
      return prev.map(win => 
        win.id === id ? { ...win, zIndex: newZIndex } : win
      );
    });
  }, [focusedWindow]);

  // Memoize window operations for better performance
  const openWindow = useCallback((windowData) => {
    setOpenWindows(prev => {
      // Check if window already exists
      const existingWindow = prev.find(win => win.id === windowData.id);
      if (existingWindow) {
        // Just focus the existing window
        focusWindow(windowData.id);
        return prev;
      }

      // Mark window for centering - actual dimensions will be measured after render
      const newZIndex = nextZIndexRef.current + 1;
      nextZIndexRef.current = newZIndex;
      
      const newWindow = {
        id: windowData.id,
        title: windowData.title,
        type: windowData.type || 'program',
        folderId: windowData.folderId || null,
        isMaximizable: windowData.isMaximizable !== false,
        isFullScreen: windowData.isFullScreen || false, // Add isFullScreen
        iconSrc: windowData.iconSrc || null,
        initialPosition: { x: 0, y: 0, shouldCenter: true }, // Will be recalculated after render
        zIndex: newZIndex,
      };

      setFocusedWindow(windowData.id);
      
      return [...prev, newWindow];
    });
  }, [focusWindow]);

  const closeWindow = useCallback((id) => {
    setOpenWindows(prev => {
      const remainingWindows = prev.filter(win => win.id !== id);
      
      // Update focused window if necessary
      if (focusedWindow === id && remainingWindows.length > 0) {
        // Find the window with highest z-index
        const topWindow = remainingWindows.reduce((highest, current) => 
          current.zIndex > highest.zIndex ? current : highest, remainingWindows[0]);
        setFocusedWindow(topWindow.id);
      } else if (remainingWindows.length === 0) {
        setFocusedWindow(null);
      }
      
      return remainingWindows;
    });
  }, [focusedWindow]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    openWindows,
    focusedWindow,
    openWindow,
    closeWindow,
    focusWindow,
  }), [openWindows, focusedWindow, openWindow, closeWindow, focusWindow]);
};