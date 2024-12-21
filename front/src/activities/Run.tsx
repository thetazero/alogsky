import React, { useEffect, useState } from "react";
import { RunData } from "../types";

interface RunProps {
    data: RunData;
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

    useEffect(() => {
        if (title.length == 0) {
            setName("Untitled")
        } else {
            setName(title)
        }
    }, [title])
    return (
        <div>
            <h3>{name} - {date.toString()}</h3>
            <p>{notes}</p>
            <p>
                {distance} miles in {duration} minutes
            </p>
        </div>
    );
}

export default Run;
