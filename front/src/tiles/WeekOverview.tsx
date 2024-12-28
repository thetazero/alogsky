import React from "react";
import { useEffect, useState } from "react";
import Analysis from "../analysis/analysis";
import DateRange from "../components/DateRange";
import { miles } from "@buge/ts-units/length";
import { hours } from "@buge/ts-units/time";
import TrainingLog from "../components/TrainingLog";
import TrainingSummary from "../components/TrainingSummary";

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
            <div className="mb-6 flex items-center justify-between bg-gray-900 text-gray-200 p-4 rounded-md shadow-lg">
                <button
                    onClick={handlePreviousWeek}
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    disabled={week === 0}
                >
                    &lt;
                </button>
                <div className="text-center">
                    <div className="text-xl font-semibold text-white">
                        Week {week + 1} of {totalWeeks}
                    </div>
                    <div className="text-sm font-light text-gray-400 mt-1">
                        <DateRange startDate={startDay} endDate={endDay} />
                    </div>
                </div>
                <button
                    onClick={handleNextWeek}
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    disabled={week === totalWeeks - 1}
                >
                    &gt;
                </button>
            </div>

            <TrainingSummary analysis={weekAnalysis} />

            <div className="mt-6">
                <TrainingLog
                    processed={weekAnalysis.training_data}
                    height={500}
                />
            </div>
        </>
    );
};

export default WeekOverview;
