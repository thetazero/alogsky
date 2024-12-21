import React, { useEffect, useState } from "react";
import { Seconds, RunData, TimeOfDay, Miles } from "../types";
import { meters_to_miles } from "../utils/unit_conversion";

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

function format_minutes_per_mile(distance: Miles, duration: Seconds): string {
    const rate = duration / distance
    const minutes = Math.floor(rate / 60)
    const seconds = Math.floor(rate % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
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
            title,
            date,
            distance,
            moving_time,
            temperature,
        },
    }: RunProps
) => {
    const [name, setName] = useState<string>(title)
    const [miles, setMiles] = useState<Miles>(meters_to_miles(distance))
    const [minutesPerMile, setMinutesPerMile] = useState<string>(format_minutes_per_mile(miles, moving_time))

    useEffect(() => {
        if (title.length == 0) {
            const time_of_date = get_time_of_day(date)
            setName(`${capitalize_first_letter(time_of_date)} run`)
        } else {
            setName(title)
        }
    }, [title, date])

    useEffect(() => {
        setMinutesPerMile(format_minutes_per_mile(miles, moving_time))
    }, [miles, moving_time])

    useEffect(() => {
        let dist = meters_to_miles(distance)
        setMiles(dist)
    }, [distance])
    return (
        <div
            className="card"
        >
            <h3>{name}</h3>
            <p style={
                {
                    textAlign: "left",
                }
            }>
                Temp: {temperature ? temperature : "???"} (C)
                <br />
                Date: {pretty_date(date)}
            </p>
            <p>
                {miles.toFixed(2)} miles | {minutesPerMile} /mi
            </p>
        </div>
    );
}

export default Run;
