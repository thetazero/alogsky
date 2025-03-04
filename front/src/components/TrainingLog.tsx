import React, { useCallback, useEffect, useRef, useState } from 'react';
import Activity from './Activity';
import Lift, { lift_estimate_height_px } from '../activities/Lift';
import PainCard from '../activities/Pain';
import Run from '../activities/Run';
import SleepActivity from '../activities/Sleep';
import { TrainingData } from '../types';
import { VariableSizeList as List } from 'react-window';

// Define the data structure for the individual run
interface TrainingLogProps {
    processed: TrainingData[]; // The processed data array
    height?: number; // Optional height for the list (fallback)
}

const TrainingLog: React.FC<TrainingLogProps> = ({ processed, height }) => {
    const [containerHeight, setContainerHeight] = useState(height || 500);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<List>(null);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setContainerHeight(containerRef.current.offsetHeight);
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

    const getItemSize = useCallback(
        (index: number) => {
            if (index % 2 == 1) return 2;
            index = index / 2;
            const item = processed[index];
            if (item.type === 'run') return 120;
            else if (item.type === 'lift') return lift_estimate_height_px(item);
            else if (item.type === 'sleep') return 44;
            else if (item.type === 'pain') return 130;
            else return 100;
        },
        [processed]
    );

    useEffect(() => {
        // Reset list cache when the processed data changes
        listRef.current?.resetAfterIndex(0, true);
    }, [processed]);

    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        if (index % 2 == 1) return <div style={style} className="bg-gray-400" />;
        index = index / 2;
        const activity = processed[index];

        return (
            <div style={style}>
                {activity.type === 'run' ? (
                    <Run data={activity} height={getItemSize(index)} />
                ) : activity.type === 'lift' ? (
                    <Lift data={activity} height={getItemSize(index)} />
                ) : activity.type === 'sleep' ? (
                    <SleepActivity data={activity} height={getItemSize(index)} />
                ) : activity.type === 'pain' ? (
                    <PainCard data={activity} height={getItemSize(index)} />
                ) :
                    (
                        <Activity date={activity.date} title={activity.type} height={getItemSize(index)}>
                            Card for {activity.type} data has not been implemented yet
                        </Activity>
                    )}
            </div>
        );
    };

    return (
        <div ref={containerRef} className="w-full h-full">
            <List
                ref={listRef} // Reference to the list
                height={containerHeight} // Dynamically updated height
                itemCount={Math.max(0, processed.length * 2 - 1)} // Number of items to render
                itemSize={getItemSize} // Dynamic size of each row
                width="100%" // Full width
                className="scroll-smooth"
            >
                {Row}
            </List>
        </div>
    );
};

export default TrainingLog;
