import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { InjurySnapshots } from '../types';
import PrettyDate from './Date';

// Define the data structure for the individual run
interface InjurtyDataHorizontalScrollerProps {
    snapshots: InjurySnapshots[]; // The processed data array
    width?: number; // Optional height for the list (fallback)
}

const InjurySnapshotHorizontalScroller: React.FC<InjurtyDataHorizontalScrollerProps> = ({ snapshots, width }) => {
    const [containerWidth, setContainerWidth] = useState(width || 500);
    const [snapShot, setSnapShot] = useState<InjurySnapshots>(snapshots[0]);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<List>(null);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
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
    }, []);

    const Column = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const snapshot = snapshots[index];

        // Interpolate the background color based on pain level (0 to 10)
        const painLevel = snapshot.pain || 0; // Default to 0 if pain is undefined
        const backgroundColor = `rgba(255, 0, 0, ${painLevel / 10})`; // From transparent to red

        return (
            <div
                style={{ ...style, backgroundColor }}
                className="relative h-full w-full p-2"
                onMouseEnter={() => setSnapShot(snapshot)}
            >
                <div className="flex items-center justify-center h-full w-full text-xl">
                    {snapshot.pain}
                </div>
            </div>
        );
    };


    return (
        <div ref={containerRef} className="w-full h-full level-2 card">
            <div className="p-4 overflow-clip" style={{
                height: 100
            }}>
                <PrettyDate date={snapShot.date} />: {" "}
                {snapShot.description}
            </div>
            <List
                ref={listRef}
                width={containerWidth}
                itemCount={snapshots.length}
                itemSize={80}
                height={80}
                className="scroll-smooth"
                layout="horizontal"
            >
                {Column}
            </List>
        </div>
    );
};

export default InjurySnapshotHorizontalScroller;
