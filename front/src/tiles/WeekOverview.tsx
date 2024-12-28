import React from "react";
import { useEffect, useState } from "react";
import Analysis from "../analysis/analysis";
import DateRange from "../components/DateRange";
import { miles } from "@buge/ts-units/length";
import { hours } from "@buge/ts-units/time";

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
            setStartDay(start);
            setEndDay(end);
        }
    }, [week]);

    const handlePreviousWeek = () => {
        if (week > 0) {
            setWeek(week - 1);
        }
    };

    const handleNextWeek = () => {
        if (week < totalWeeks - 1) {
            setWeek(week + 1);
        }
    };

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <button
                    onClick={handlePreviousWeek}
                    className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring focus:ring-indigo-500"
                    disabled={week === 0}
                >
                    &lt;
                </button>
                <div className="text-lg font-semibold">
                    Week: {week + 1} / {totalWeeks}  &nbsp;
                    <span className="text-sm font-normal">
                        (<DateRange
                            startDate={startDay}
                            endDate={endDay}
                        />)
                    </span>
                </div>
                <button
                    onClick={handleNextWeek}
                    className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring focus:ring-indigo-500"
                    disabled={week === totalWeeks - 1}
                >
                    &gt;
                </button>
            </div>

            <div className="text-sm mt-2">
                Tonage: {weekAnalysis.total_tonage().amount.toFixed(0)} lbs
            </div>

            <div className="text-sm mt-2">
                Milleage: {
                    weekAnalysis.total_distance().in(miles).amount.toFixed(1)
                } miles
            </div>

            <div className="text-sm mt-2">
                Training Time: {
                    weekAnalysis.training_time().in(hours).amount.toFixed(1)
                } hours
            </div>


            <div className="text-sm mt-2">
                Runs: {weekAnalysis.runs.length}
            </div>

            <div className="text-sm mt-2">
                Lifts: {weekAnalysis.lifts.length}
            </div>
        </>
    );
};

export default WeekOverview;
