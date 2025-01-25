import React, { useEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { PainSnapshotsData } from '../types';
import PrettyDate from './Date';
import { calendar_days_appart } from '../utils/time';

// Define the data structure for the individual run
interface InjurtyDataHorizontalScrollerProps {
    snapshots: PainSnapshotsData[]; // The processed data array
    width?: number; // Optional height for the list (fallback)
}

const InjurySnapshotHorizontalScroller: React.FC<InjurtyDataHorizontalScrollerProps> = ({ snapshots, width }) => {
    const [containerWidth, setContainerWidth] = useState(width || 500);
    const [snapShot, setSnapShot] = useState<PainSnapshotsData>(snapshots[snapshots.length - 1]);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<List>(null);
    const [listData, setListData] = useState<(PainSnapshotsData | null)[]>([]);

    useEffect(() => {
        const list_data : (PainSnapshotsData | null)[] = [];
        for (let i = 0; i < snapshots.length; i++) {
            const dates_not_contigous = i > 0 && calendar_days_appart(snapshots[i - 1].date, snapshots[i].date) > 1
            if (dates_not_contigous) list_data.push(null)
            list_data.push(snapshots[i])
        }
        setListData(list_data);
    }, [snapshots]);

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
        const snapshot = listData[index];

        if (!snapshot) {
            return (
                <div style={style} className="relative h-full w-full p-2">
                    <div className="flex items-center justify-center h-full w-full">
                        ...
                    </div>
                </div>
            );
        }

        const painLevel = snapshot.pain || 0;
        const backgroundColor = `rgba(255, 0, 0, ${painLevel / 10})`; // From transparent to red

        return (
            <div
                style={{ ...style, backgroundColor }}
                className="relative h-full w-full p-2"
                onMouseEnter={() => setSnapShot(snapshot)}
            >
                <div className="flex items-center justify-center h-full w-full text-sm">
                    <PrettyDate date={snapshot.date} compact={true} />
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
                itemCount={listData.length}
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
