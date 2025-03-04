import React from "react";
import Activity from "../components/Activity";
import { SleepData } from "../types";
import { format_time } from "../utils/format";

export interface SleepProps {
    data: SleepData;
    height: number;
}

const SleepActivity: React.FC<SleepProps> = ({ data, height }) => {
    return (
        <Activity title={`${format_time(data.duration)}`} height={height} date={data.date}></Activity>
    )
}

export default SleepActivity;
