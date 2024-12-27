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
    height: number;  // Fixed height for each run
    style?: React.CSSProperties;  // Allow passing style as a prop
}

const Run: React.FC<RunProps> = ({
    data: { date, distance, moving_time, temperature, title },
    height,
}: RunProps) => {
    const [minutesPerMile, setMinutesPerMile] = useState<InverseSpeed>(moving_time.per(distance));

    useEffect(() => {
        setMinutesPerMile(moving_time.per(distance));
    }, [distance, moving_time]);

    return (
        <div
            className="space-y-6 p-6 bg-gray-900 dark:bg-gray-800 border-box"
            style={{ height }}  // Apply only height for the row
        >
            {/* Title with some visual prominence */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <span className="text-sm text-gray-400">{pretty_date(date)}</span>
            </div>

            {/* Temperature (if available) */}
            {temperature && (
                <p className="text-sm text-gray-400">
                    Feels like: {temperature.in(celsius).amount}°C
                </p>
            )}

            <div className="text-lg font-semibold text-gray-300">
                <p>
                    {distance.in(miles).amount.toFixed(2)} miles |{" "}
                    {fmt_minutes_per_mile(minutesPerMile)}
                </p>
            </div>
            <hr className="border-gray-600 dark:border-gray-700 mt-4" />
        </div>
    );
};


export default Run;
