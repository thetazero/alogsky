import React from "react";
import { useEffect, useState } from "react";
import Analysis from "../analysis/analysis";
import PrettyDate from "../components/Date";

export interface WeekLogProps {
    analysis: Analysis;
}

const WeekOverview: React.FC<WeekLogProps> = ({ analysis }) => {
    const [totalWeeks, setTotalWeeks] = useState<number>(0);
    const [week, setWeek] = useState<number>(0);
    const [weekAnalysis, setWeekAnalysis] = useState<Analysis>(new Analysis([]));
    const [startDay, setStartDay] = useState<Date>(new Date());
    const [endDay, setEndDay] = useState<Date>(new Date());

    useEffect(() => {
        const weeks = analysis.number_of_weeks();
        setTotalWeeks(weeks);
        setWeek(weeks - 1);
    }, [analysis]);

    useEffect(() => {
        setWeekAnalysis(new Analysis(analysis.get_data_for_week(week)));
        if (analysis.training_data.length > 0) {
        const [start, end] = analysis.date_range_for_week(week);
        setStartDay(start)
        setEndDay(end)
        }
    }, [week]);

    const handleWeekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setWeek(Number(event.target.value));
    };

    return (
        <>
            <div className="mb-4">
                <label htmlFor="week-selector" className="block text-sm font-medium mb-2">
                    Select Week:
                </label>
                <select
                    id="week-selector"
                    value={week}
                    onChange={handleWeekChange}
                    className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white focus:outline-none focus:ring focus:ring-indigo-500"
                >
                    {Array.from({ length: totalWeeks }, (_, index) => (
                        <option key={index} value={index}>
                            Week {index + 1}
                        </option>
                    ))}
                </select>
            </div>

            <div className="text-lg font-semibold">
                Week: {week + 1} / {totalWeeks}
            </div>

            <div className="text-sm mt-2">
                Tonage: {weekAnalysis.total_tonage().amount.toFixed(0)} lbs
            </div>

            <div className="text-sm mt-2">
                Runs: {weekAnalysis.runs.length}
            </div>

            <div className="text-sm mt-2">
                Lifts: {weekAnalysis.lifts.length}
            </div>

            start: <PrettyDate date={startDay} />
            end: <PrettyDate date={endDay} />
        </>
    );
};

export default WeekOverview;
