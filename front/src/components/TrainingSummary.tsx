import React, { useEffect, useState } from "react";
import Analysis from "../analysis/analysis";
import { miles } from "@buge/ts-units/length";
import { hours } from "@buge/ts-units/time";
import Chip from "./Chip";
import { tons } from "../types";
import { format_time, nice_number } from "../utils/format";

export interface TrainingSummaryProps {
    analysis: Analysis;
}

const TrainingSummary: React.FC<TrainingSummaryProps> = ({ analysis }) => {
    const [sleepTimeStr, setSleepTimeStr] = useState<string>("")
    useEffect(()=>{
        const sleep_time = analysis.average_sleep_time()
        if (sleep_time) setSleepTimeStr(format_time(sleep_time))
        else setSleepTimeStr("???")
    }, [analysis])

    return (
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-4 text-sm mt-4">
            <Chip title={nice_number(analysis.total_tonage().in(tons).amount)} subtitle="Tons Lifted" />
            <Chip title={nice_number(analysis.total_distance().in(miles).amount)} subtitle="Miles Ran" />
            <Chip title={nice_number(analysis.training_time().in(hours).amount)} subtitle="Hours Trained" />
            <Chip title={analysis.runs.length.toString()} subtitle="Runs" />
            <Chip title={analysis.lifts.length.toString()} subtitle="Lifts" />
            <Chip title={sleepTimeStr} subtitle="Average Sleep" />
        </div>
    );
};

export default TrainingSummary;
