import { useEffect } from 'react';

export function useResizeObserver(containerRef: React.RefObject<HTMLDivElement>, callback: (width: number, height: number) => void) {
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                callback(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
            }
        };

        // Create a ResizeObserver to monitor changes in the container's size
        const resizeObserver = new ResizeObserver(handleResize);

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [callback, containerRef]);
}
