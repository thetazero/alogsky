import React, { useCallback, useEffect, useRef, useState } from 'react';
import { VariableSizeList as List } from 'react-window';
import Run from '../activities/Run';
import { TrainingData } from '../types';
import Lift from '../activities/Lift';
import SleepActivity from '../activities/Sleep';
import Activity from './Activity';

// Define the data structure for the individual run
interface TrainingLogProps {
    processed: TrainingData[]; // The processed data array
    height?: number; // Optional height for the list (fallback)
}

const TrainingLog: React.FC<TrainingLogProps> = ({ processed, height }) => {
    const [containerHeight, setContainerHeight] = useState(height || 500);
    const containerRef = useRef<HTMLDivElement>(null);

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
            const item = processed[index];
            if (item.type === 'run') return 120;
            else if (item.type === 'lift') return 300;
            else if (item.type === 'sleep') return 100;
            else return 100;
        },
        [processed]
    );

    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const activity = processed[index];

        return (
            <div style={style}>
                {activity.type === 'run' ? (
                    <Run data={activity} height={getItemSize(index)} />
                ) : activity.type === 'lift' ? (
                    <Lift data={activity} height={getItemSize(index)} />
                ) : activity.type === 'sleep' ? (
                    <SleepActivity data={activity} height={getItemSize(index)} />
                ) : (
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
                height={containerHeight} // Dynamically updated height
                itemCount={processed.length} // Number of items to render
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
