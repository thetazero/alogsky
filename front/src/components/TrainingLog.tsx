import React, { useCallback, useEffect } from 'react';
import { VariableSizeList as List } from 'react-window';
import Run from '../activities/Run';
import { TrainingData } from '../types';
import Lift from '../activities/Lift';
import { format_time } from '../utils/format';
import SleepActivity from '../activities/Sleep';

// Define the data structure for the individual run
interface TrainingLogProps {
    processed: TrainingData[]; // The processed data array
    height?: number; // Optional height for the list
}

const TrainingLog: React.FC<TrainingLogProps> = ({ processed, height }) => {
    const [redrawKey, setRedrawKey] = React.useState(0);
    useEffect(() => {
        setRedrawKey((prev) => prev + 1);
    }, [processed, height]);

    // Dynamically get item size from the cached heights
    const getItemSize = useCallback(
        (index: number) => {
            const item = processed[index];
            if (item.type === "run") return 120;
            else if (item.type == "lift") return 300;
            else if (item.type == "sleep") return 100;
            else return 100;
        },
        [processed]
    );

    // Row renderer for each item in the list
    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const activity = processed[index];

        return (
            <div style={style} className="border-b border-gray-600"> {/* Apply style for virtual scrolling */}
                {activity.type === 'run' ? (
                    <Run data={activity} height={getItemSize(index)} />
                ) : activity.type === 'lift' ? (
                    <Lift data={activity} height={getItemSize(index)} />
                ) : activity.type === 'sleep' ? (
                    <SleepActivity data={activity} height={getItemSize(index)} />
                )
                    :
                    (
                        <div>{activity.type} Not implemented</div>
                    )}
            </div>
        );
    };

    return (
        <div className="w-full p-4"
            style={
                height ? { height } : {}
            }
        >
            <List
                height={height || 500} // Default height for the list
                itemCount={processed.length} // Number of items to render
                itemSize={getItemSize} // Dynamic size of each row
                width="100%" // Full width
                className="scroll-smooth"
                key={redrawKey} // Re-render the list when the data changes
            >
                {Row}
            </List>
        </div>
    );
};

export default TrainingLog;
