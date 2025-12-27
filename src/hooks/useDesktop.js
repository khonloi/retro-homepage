import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { desktopItems } from "../config/programConfig";

// Constants for positioning - extracted for better maintainability
const POSITIONING_CONSTANTS = {
  EDGE_PADDING: 20,
  EDGE_PADDING_RESIZE: 24,
  ICON_SPACING: 92,
  ICON_WIDTH: 80,
  TOP_PADDING: 16,
};

export const useDesktop = () => {
  // Create memoized desktop items
  const allDesktopItems = useMemo(() => desktopItems, []);
  
  // Use ref to track if positions are initialized
  const positionsInitialized = useRef(false);

  // Initialize positions - memoized calculation
  const initialPositions = useMemo(() => {
    const positions = {};
    let leftIconIndex = 0;
    let rightIconIndex = 0;
    
    const { EDGE_PADDING, ICON_SPACING, ICON_WIDTH, TOP_PADDING } = POSITIONING_CONSTANTS;
    
    allDesktopItems.forEach((item) => {
      if (item.positionRight) {
        positions[item.id] = {
          x: window.innerWidth - ICON_WIDTH - EDGE_PADDING,
          y: TOP_PADDING + rightIconIndex * ICON_SPACING,
        };
        rightIconIndex++;
      } else {
        positions[item.id] = {
          x: EDGE_PADDING,
          y: TOP_PADDING + leftIconIndex * ICON_SPACING,
        };
        leftIconIndex++;
      }
    });
    
    positionsInitialized.current = true;
    return positions;
  }, [allDesktopItems]);

  const [itemPositions, setItemPositions] = useState(initialPositions);

  // Memoize right-aligned items for resize handler
  const rightAlignedItems = useMemo(
    () => allDesktopItems.filter(item => item.positionRight),
    [allDesktopItems]
  );

  // Handle window resize to update icon positions - optimized with debouncing
  useEffect(() => {
    let resizeTimer;
    
    const handleResize = () => {
      // Debounce resize events for better performance
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setItemPositions(prev => {
          const newPositions = { ...prev };
          const { EDGE_PADDING_RESIZE, ICON_WIDTH } = POSITIONING_CONSTANTS;
          
          // Only update positions of right-aligned items
          rightAlignedItems.forEach(item => {
            if (newPositions[item.id]) {
              newPositions[item.id] = {
                ...newPositions[item.id],
                x: window.innerWidth - ICON_WIDTH - EDGE_PADDING_RESIZE,
              };
            }
          });
          
          return newPositions;
        });
      }, 100); // 100ms debounce
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [rightAlignedItems]);

  // Handle item position changes - optimized callback
  const handleItemPositionChange = useCallback((id, newPosition, contextFolderId = null) => {
    if (contextFolderId) {
      // Folder items are handled by CSS Grid, no state update needed
      return;
    }
    
    setItemPositions(prev => {
      // Only update if position actually changed
      const currentPos = prev[id];
      if (
        currentPos &&
        currentPos.x === newPosition.x &&
        currentPos.y === newPosition.y
      ) {
        return prev;
      }
      
      return {
        ...prev,
        [id]: newPosition,
      };
    });
  }, []);

  return {
    allDesktopItems,
    itemPositions,
    handleItemPositionChange
  };
};