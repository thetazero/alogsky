import React, { useEffect, useState } from "react";
import { InverseSpeed, RunData } from "../types";
import { miles } from "@buge/ts-units/length";
import { fmt_minutes_per_mile } from "../utils/format";
import Activity from "../components/Activity";
import WorkoutSummary from "../components/WorkoutSummary";
import { useCommand } from "../CommandProvider";

interface RunProps {
    data: RunData;
    height: number;  // Fixed height for each run
    style?: React.CSSProperties;  // Allow passing style as a prop
}

const Run: React.FC<RunProps> = ({
    data,
    height,
}: RunProps) => {
    const [minutesPerMile, setMinutesPerMile] = useState<InverseSpeed>(data.moving_time.per(data.distance));

    useEffect(() => {
        setMinutesPerMile(data.moving_time.per(data.distance));
    }, [data.distance, data.moving_time]);

    const { inspectRun } = useCommand();

    return (
        <Activity title={data.title} date={data.date} height={height} onClick={() => inspectRun(data)}>
            <div>
                {
                    data.workout ? <WorkoutSummary data={data.workout} /> : null
                }
            </div>
            <p>
                {data.distance.in(miles).amount.toFixed(2)} miles |{" "}
                {fmt_minutes_per_mile(minutesPerMile)} | {""}
                {
                    data.shoe
                }
            </p>
        </Activity>
    );
};


export default Run;
