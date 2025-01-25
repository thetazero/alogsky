import { useEffect, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai"; // Import icons from react-icons
import Analysis, { TrainingDataSet } from "../analysis/analysis";
import DateRange from "../components/DateRange";
import TrainingLog from "../components/TrainingLog";
import TrainingSummary from "../components/TrainingSummary";
import BottomGrows from "../components/BottomGrows";
import Tile from "../components/Tile";
import panelComponentType from "./tileType";

const WeekOverview: panelComponentType = ({ dataset, id }) => {
    const [totalWeeks, setTotalWeeks] = useState<number>(0);
    const [week, setWeek] = useState<number>(0);
    const [weekAnalysis, setWeekAnalysis] = useState<Analysis>(new Analysis(new TrainingDataSet([])));
    const [startDay, setStartDay] = useState<Date>(new Date());
    const [endDay, setEndDay] = useState<Date>(new Date());

    useEffect(() => {
        const weeks = dataset.number_of_weeks();
        setTotalWeeks(weeks);
        setWeek(weeks - 1);
    }, [dataset]);

    useEffect(() => {
        const analysis = dataset.analysis_for_week(week);
        setWeekAnalysis(analysis);
        if (dataset.data.length > 0) {
            const [start, end] = dataset.date_range_for_week(week);
            setStartDay(start);
            setEndDay(end);
        }
    }, [week, dataset]);

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
        <Tile title="Weekly Overview" id={id}>
            <BottomGrows
                topChild={
                    <>
                        <div className="mb-6 flex items-center justify-between p-2 shadow-lg card level-2">
                            <button
                                onClick={handlePreviousWeek}
                                className="p-2 rounded-full bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-20"
                                disabled={week === 0}
                            >
                                <AiOutlineLeft className="w-6 h-6 text-white" />
                            </button>
                            <div className="text-center">
                                <div className="text-l emph">
                                    Week {week + 1} of {totalWeeks}
                                </div>
                                <div className="text-sm font-light mt-1 deemph">
                                    <DateRange startDate={startDay} endDate={endDay} />
                                </div>
                            </div>
                            <button
                                onClick={handleNextWeek}
                                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                disabled={week === totalWeeks - 1}
                            >
                                <AiOutlineRight className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        <TrainingSummary analysis={weekAnalysis} />
                    </>
                }
                bottomChild={
                    <TrainingLog
                        processed={weekAnalysis.dataset.data}
                        height={400}
                    />
                }
            />

        </Tile>
    );
};

export default WeekOverview;
