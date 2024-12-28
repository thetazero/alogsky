import React from "react";

export interface DateProps {
    date: Date;
    showDay?: boolean;
    compact?: boolean;
}

const PrettyDate: React.FC<DateProps> = ({ date, showDay = true, compact=false }) => {
    if (compact) {
        return (
            <span>
                {date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                })}
            </span>
        );
    }
    return (
        <span>
            {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: showDay ? "numeric" : undefined,
            })}
        </span>
    );
}

export default PrettyDate
