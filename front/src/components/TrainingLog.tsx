import React, { useCallback, useRef, useState } from 'react';
import { VariableSizeList as List } from 'react-window';
import { ContentRect } from 'react-measure'; // Import react-measure
import Measure from 'react-measure';
import Run from '../activities/Run';
import { LiftData, RunData } from '../types';
import Lift from '../activities/Lift';

// Define the data structure for the individual run
interface TrainingLogProps {
    processed: (RunData | LiftData)[]; // The processed data array
}

const TrainingLog: React.FC<TrainingLogProps> = ({ processed }) => {
    // Dynamically get item size from the cached heights
    const getItemSize = useCallback(
        (index: number) => {
            const item = processed[index];
            if (item.type === "run") return 300;
            else if (item.type == "lift") return 300;
            else return 100;
        },
        [processed]
    );

    // Row renderer for each item in the list
    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const activity = processed[index];

        return (
            <div style={style} className="py-2"> {/* Apply style for virtual scrolling */}
                {activity.type === 'run' ? (
                    <Run data={activity} height={getItemSize(index)} />
                ) : activity.type === 'lift' ? (
                    <Lift data={activity} height={getItemSize(index)} />
                ) : (
                    <div>Not implemented</div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full p-4">
            <List
                height={500} // Set the visible height of the list
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
