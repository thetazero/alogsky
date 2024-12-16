import React from "react";
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
        },
    }: RunProps
) => {
    return (
        <div>
            <h3>{title}</h3>
            <p>{notes}</p>
            <p>
                {distance} miles in {duration} minutes
            </p>
        </div>
    );
}

export default Run;
