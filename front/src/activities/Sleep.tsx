import React, { useEffect, useState } from "react";
import Activity from "../components/Activity";
import { SleepData, SleepQuality } from "../types";
import { format_time } from "../utils/format";

export interface SleepProps {
    data: SleepData;
    height: number;
}

const SleepQualityMap = new Map(
    [
        [SleepQuality.Poor, "bad"],
        [SleepQuality.Low, "bad"],
        [SleepQuality.Fair, "okay"]
    ]
)

const SleepActivity: React.FC<SleepProps> = ({ data, height }) => {
    const color = SleepQualityMap.get(data.quality ?? SleepQuality.Fair);
    return (
        <Activity title={`${format_time(data.duration)}`} height={height} date={data.date} color={color}></Activity>
    )
}

export default SleepActivity;
