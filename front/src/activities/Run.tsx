import React, { useEffect, useState } from "react";
import { Minutes, RunData, TimeOfDay, Miles } from "../types";

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

function format_minutes_per_mile(distance: Miles, duration: Minutes): string {
    const mpm = duration / distance
    const minutes = Math.floor(mpm)
    const seconds = Math.round((mpm - minutes) * 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}


const Run: React.FC<RunProps> = (
    {
        data: {
            title,
            notes,
            distance,
            duration,
            date,
        },
    }: RunProps
) => {
    let [name, setName] = useState<string>(title)
    const [minutesPerMile, setMinutesPerMile] = useState<string>(format_minutes_per_mile(distance, duration))

    useEffect(() => {
        if (title.length == 0) {
            const time_of_date = get_time_of_day(date)
            setName(`${capitalize_first_letter(time_of_date)} run`)
        } else {
            setName(title)
        }
    }, [title, date])

    useEffect(() => {
        setMinutesPerMile(format_minutes_per_mile(distance, duration))
    }, [distance, duration])
    return (
        <div
            className="card"
        >
            <h3>{name}</h3>
            <p style={
                {
                    textAlign: "left",
                }
            }>{notes}</p>
            <p>
                {distance} miles | {minutesPerMile} /mi
            </p>
        </div>
    );
}

export default Run;
