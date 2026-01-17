// src/components/DraggableItem.jsx
import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import { useDragDrop } from '../hooks/useDragDrop';
import { useContrastColor } from '../hooks/useContrastColor';

const DraggableItem = memo(({
  id,
  label,
  iconSrc,
  defaultIcon,
  position,
  onPositionChange,
  onDoubleClick,
  onSelect,
  isSelected,
  className,
  children,
  onDrop,
  onDragOver,
  onDragLeave,
  isDraggable = false,
  onDragStart,
  isFlashing = false
}) => {
  // Provide default position if not specified (for grid items)
  const effectivePosition = position || null;
  const effectiveOnPositionChange = position ? onPositionChange : () => { };

  // State for drop target styling
  const [isDropTarget, setIsDropTarget] = useState(false);

  // State for image loading
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Ref for the image element to check if it's already loaded (cached)
  const imageRef = useRef(null);

  // Reset loading state when image source changes
  const currentImageSrc = iconSrc || defaultIcon;
  useEffect(() => {
    setIsImageLoaded(false);

    // Check if image is already loaded from cache
    // This handles the case where the browser loads cached images synchronously
    // Use setTimeout to ensure the DOM has updated with the new src
    const checkImageLoaded = () => {
      if (imageRef.current) {
        const img = imageRef.current;
        // Check if image is complete (loaded from cache or already loaded)
        if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
          setIsImageLoaded(true);
        }
      }
    };

    // Check immediately and also after a short delay to handle race conditions
    checkImageLoaded();
    const timeoutId = setTimeout(checkImageLoaded, 0);

    return () => clearTimeout(timeoutId);
  }, [currentImageSrc]);

  // Get drag-drop functionality from hook
  const { elementRef, handleMouseDown, handleTouchStart, elementStyle } = useDragDrop(
    id, effectivePosition, effectiveOnPositionChange, onSelect
  );

  // Get contrast-appropriate text color
  const textColor = useContrastColor(elementRef);

  // Memoized event handlers for better performance
  const handleDragOver = useCallback((e) => {
    if (!onDrop) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDropTarget(true);
    onDragOver?.(e, id);
  }, [onDrop, onDragOver, id]);

  const handleDragLeave = useCallback((e) => {
    if (!elementRef.current?.contains(e.relatedTarget)) {
      setIsDropTarget(false);
    }
    onDragLeave?.(e);
  }, [elementRef, onDragLeave]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDropTarget(false);

    try {
      const draggedData = e.dataTransfer.getData('text/plain');
      if (draggedData && onDrop) {
        // Try to parse as JSON first
        try {
          const parsedData = JSON.parse(draggedData);
          onDrop(parsedData.id || draggedData, id);
        } catch {
          // If not JSON, use as plain text
          onDrop(draggedData, id);
        }
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  }, [id, onDrop]);

  const handleDragStart = useCallback((e) => {
    e.dataTransfer.setData('text/plain', id);
    onDragStart?.(e, id);
  }, [id, onDragStart]);

  // Double tap detection for mobile devices
  const [lastTap, setLastTap] = useState(0);
  const handleTap = useCallback(() => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // ms
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      onDoubleClick?.();
    }
    setLastTap(now);
  }, [lastTap, onDoubleClick]);

  // Handle image load - works for both fresh loads and cached images
  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      // Double-check that image is actually loaded
      if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
        setIsImageLoaded(true);
      }
    } else {
      setIsImageLoaded(true);
    }
  }, []);

  // Handle image error fallback
  const handleImageError = useCallback((e) => {
    if (defaultIcon && e.target.src !== defaultIcon) {
      e.target.src = defaultIcon;
      // Reset loaded state when switching to fallback
      setIsImageLoaded(false);
    }
  }, [defaultIcon]);

  // Consolidated props for the main div
  const itemProps = {
    ref: elementRef,
    className: `${className} ${isSelected ? 'selected' : ''} ${isDropTarget ? 'drop-target' : ''} ${!isImageLoaded ? 'image-loading' : ''}`,
    style: {
      ...elementStyle,
      visibility: isImageLoaded ? 'visible' : 'hidden',
      opacity: isImageLoaded ? 1 : 0,
    },
    onMouseDown: handleMouseDown,
    onTouchStart: (e) => {
      handleTouchStart(e);
      handleTap();
    },
    onDoubleClick,
    tabIndex: 0,
    role: "button",
    "aria-label": label,
    ...(onDrop && {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    }),
    ...(isDraggable && {
      draggable: true,
      onDragStart: handleDragStart,
    })
  };

  return (
    <div {...itemProps}>
      <div className="item-image">
        <img
          ref={imageRef}
          src={iconSrc || defaultIcon}
          alt={label}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
      <div
        className="item-label"
        style={{ color: (isSelected || isFlashing) ? undefined : textColor }}
      >
        {label}
      </div>
      {children}
    </div>
  );
});

DraggableItem.displayName = 'DraggableItem';

export default DraggableItem;