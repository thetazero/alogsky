import React, { useEffect, useState } from "react";
import { InverseSpeed, RunData, TimeOfDay } from "../types";
import { Length, miles } from "@buge/ts-units/length";
import { fmt_minutes_per_mile } from "../utils/format";
import { celsius } from "@buge/ts-units/temperature";

interface RunProps {
    data: RunData;
}

function get_time_of_day(date: Date): TimeOfDay {
    const hours = date.getHours()
    if (hours < 12) {
        return TimeOfDay.Morning
    } else if (hours < 18) {
        return TimeOfDay.Afternoon
    } else {
        return TimeOfDay.Evening
    }
}

function capitalize_first_letter(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function pretty_date(date: Date): string {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}


const Run: React.FC<RunProps> = (
    {
        data: {
            date,
            distance,
            moving_time,
            temperature,
        },
    }: RunProps
) => {
    const [minutesPerMile, setMinutesPerMile] = useState<InverseSpeed>(moving_time.per(distance))

    useEffect(() => {
        setMinutesPerMile(moving_time.per(distance))
    }, [distance, moving_time])

    return (
        <div
            className="card"
        >
            <p style={
                {
                    textAlign: "left",
                }
            }>
                Temp: {temperature ? temperature.in(celsius).amount : "???"} (C)
                <br />
                Date: {pretty_date(date)}
            </p>
            <p>
                {distance.in(miles).amount.toFixed(2)} miles | {fmt_minutes_per_mile(minutesPerMile)} /mi
            </p>
        </div>
    );
}

export default Run;
