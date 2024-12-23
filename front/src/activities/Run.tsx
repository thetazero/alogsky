import React, { useEffect, useState } from "react";
import { InverseSpeed, RunData } from "../types";
import { miles } from "@buge/ts-units/length";
import { fmt_minutes_per_mile } from "../utils/format";
import { celsius } from "@buge/ts-units/temperature";

// Move the pretty_date function outside of the component for better readability
function pretty_date(date: Date): string {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

interface RunProps {
    data: RunData;
}

const Run: React.FC<RunProps> = ({
    data: { date, distance, moving_time, temperature },
}: RunProps) => {
    const [minutesPerMile, setMinutesPerMile] = useState<InverseSpeed>(moving_time.per(distance));

    useEffect(() => {
        setMinutesPerMile(moving_time.per(distance));
    }, [distance, moving_time]);

    return (
        <div className="space-y-4">
            <div className="text-left">
                {pretty_date(date)}
                {
                    temperature && (
                        <p className="text-sm">
                            Feels like: {temperature.in(celsius).amount}°C
                        </p>
                    )
                }
            </div>
            {
                JSON.stringify(temperature)
            }

            <div className="text-lg font-semibold">
                <p>
                    {distance.in(miles).amount.toFixed(2)} miles |{" "}
                    {fmt_minutes_per_mile(minutesPerMile)}
                </p>
            </div>
        </div>
    );
};

export default Run;
