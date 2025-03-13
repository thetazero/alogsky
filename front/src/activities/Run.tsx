import React, { useEffect, useState } from "react";
import { InverseSpeed, RunData } from "../types";
import { miles } from "@buge/ts-units/length";
import { fmt_minutes_per_mile } from "../utils/format";
import { celsius } from "@buge/ts-units/temperature";
import Activity from "../components/Activity";
import WorkoutSummary from "../components/WorkoutSummary";

interface RunProps {
    data: RunData;
    height: number;  // Fixed height for each run
    style?: React.CSSProperties;  // Allow passing style as a prop
}

const Run: React.FC<RunProps> = ({
    data: { date, distance, moving_time, temperature, title, shoe, workout },
    height,
}: RunProps) => {
    const [minutesPerMile, setMinutesPerMile] = useState<InverseSpeed>(moving_time.per(distance));

    useEffect(() => {
        setMinutesPerMile(moving_time.per(distance));
    }, [distance, moving_time]);

    return (
        <Activity title={title} date={date} height={height}>
            <>
                {
                    workout ? <WorkoutSummary data={workout} /> : null
                }
            </>
            <p>
                {distance.in(miles).amount.toFixed(2)} miles |{" "}
                {fmt_minutes_per_mile(minutesPerMile)} | {""}
                {
                    shoe
                }
            </p>
        </Activity>
    );
};


export default Run;
