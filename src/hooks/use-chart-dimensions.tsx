
import { useState, useEffect, useRef } from 'react';

interface Dimensions {
  width: number;
  height: number;
}

export function useChartDimensions(minHeight = 250): [React.RefObject<HTMLDivElement>, Dimensions] {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: minHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Get the width of the container
        const boundingRect = containerRef.current.getBoundingClientRect();
        
        // Set height based on aspect ratio or minimum height
        const aspectHeight = boundingRect.width * 0.6; // 3:5 aspect ratio
        const height = Math.max(aspectHeight, minHeight);
        
        setDimensions({
          width: boundingRect.width,
          height
        });
      }
    };

    // Initial measurement
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Handle zoom events as well which might not trigger resize
    window.addEventListener('zoom', handleResize);
    
    // Create a ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(handleResize);
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('zoom', handleResize);
      resizeObserver.disconnect();
    };
  }, [minHeight]);

  return [containerRef, dimensions];
}
