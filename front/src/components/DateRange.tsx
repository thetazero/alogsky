import React from "react";
import PrettyDate from "../components/Date";

export interface DateRangeProps {
    startDate: Date;
    endDate: Date;
}

const DateRange: React.FC<DateRangeProps> = ({ startDate, endDate }) => {
    return (
        <span>
            <PrettyDate date={startDate} compact={true}/> - <PrettyDate date={endDate} compact={true}/>
        </span>
    );
};

export default DateRange;
