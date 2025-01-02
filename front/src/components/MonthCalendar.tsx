import React, { useEffect, useState } from "react";
import { get_week_start } from "../utils/time";

export interface MonthCalendarProps {
    date: Date;
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({ date }) => {
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const [days, setDays] = useState<number[]>([])

    useEffect(() => {
        let new_days = getNDays(getStartDay(date), 35)
        setDays(new_days)
    }, [date])

    function getStartDay(date: Date): Date {
        let x: Date = new Date(date)
        x.setDate(0)
        return get_week_start(x)
    }

    const getNDays = (date: Date, n: number): number[] => {
        const newDate = new Date(date);
        const days = [date.getDate()];

        for (let i = 0; i < n - 1; i++) {
            newDate.setDate(newDate.getDate() + 1);
            days.push(newDate.getDate())
        }
        return days;
    };

    return (
         <div className="w-full max-w-md mx-auto level-2 card p-2">
            {/* Header */}
            <div className="text-center my-2">
                <h2 className="text-xl font-bold">
                    {date.toLocaleString("default", { month: "long" })} {date.getFullYear()}
                </h2>
                <hr className="line mt-2 mb-4" />
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
                {daysOfWeek.map((day, index) => (
                    <div key={index} className="emph bold">
                        {day}
                    </div>
                ))}

                {days.map((day, i) => (
                    <div
                        key={i}
                        className="p-2 rounded-full deemph"
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthCalendar;
