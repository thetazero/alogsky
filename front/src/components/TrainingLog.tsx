import React from 'react';
import { FixedSizeList as List } from 'react-window'; // Import from react-window
import Run from '../activities/Run';
import { RunData } from '../types';

// Define the data structure for the individual run
interface TrainingLogProps {
    processed: RunData[]; // The processed data array
}

const TrainingLog: React.FC<TrainingLogProps> = ({ processed }) => {
    const itemHeight = 200;  // Height of each row

    // Row renderer for each item in the list
    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const run = processed[index]; // Get the corresponding run data
        return (
            <div style={style} className="py-2"> {/* Apply style for virtual scrolling */}
                <Run data={run} height={itemHeight} />
            </div>
        );
    };

    return (
        <div className="w-full p-4">
            <List
                height={500}  // Set the visible height of the list
                itemCount={processed.length}  // Number of items to render
                itemSize={itemHeight}  // Fixed size of each row
                width="100%"  // Full width
                className='scroll-smooth'
            >
                {Row}
            </List>
        </div>
    );
};


export default TrainingLog;
