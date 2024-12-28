import React from "react";

export interface DateProps {
    date: Date;
}

const PrettyDate: React.FC<DateProps> = ({ date }) => {
    return (
        <span>
            {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })}
        </span>
    );
}

export default PrettyDate
