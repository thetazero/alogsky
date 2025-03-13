import React from "react";
import { RunningWorkoutData } from "../types";

interface WorkoutSummaryProps {
    data: RunningWorkoutData;
}

function computeWorkoutName(data: RunningWorkoutData): string {
    let summary : string[] =[];
    let cur: string | null = null;
    let count = 0;
    for (let i = 0; i < data.intervals.length; i++) {
        let interval = data.intervals[i];
        if (interval.distance) {
            if (!cur || cur !== interval.distance.toString()) {
                if (cur) {
                    summary.push(`${count} x ${cur}`);
                }
                cur = interval.distance.toString();
                count = 1;
            } else {
                count++;
            }
        }
    }
    if (cur) {
        summary.push(`${count} x ${cur}`);
    }
    return summary.join(", ");
}

const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({
    data
}: WorkoutSummaryProps) => {

    return (
        <>
            {
                computeWorkoutName(data)
            }
        </>
    );
};


export default WorkoutSummary;
