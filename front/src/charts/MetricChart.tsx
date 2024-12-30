import React, { useEffect, useState } from "react";
import Chart from "../components/Chart";
import Analysis from "../analysis/analysis";
import { Metric } from "../analysis/analysis";
import { DataPoint } from "../components/Chart";
import BottomGrows from "../components/BottomGrows";

interface MileageChartProps {
    analysis: Analysis
}

const allMetrics: Metric[] = Object.values(Metric);

const SingleMetricChart: React.FC<MileageChartProps> = ({ analysis }) => {
    const [weeklyAnalysis, setWeeklyAnalysis] = useState<Analysis[]>([]);
    const [data, setData] = useState<DataPoint[]>([]);

    const [metric, setMetric] = useState<Metric>(Metric.Mileage);

    const [title, setTitle] = useState<string>("");
    const [yTitle, setYTitle] = useState<string>("");
    const [yUnit, setYUnit] = useState<string>("");

    useEffect(() => {
        setWeeklyAnalysis(analysis.split_into_weeks())
    }, [analysis])

    useEffect(() => {
        setData(
            weeklyAnalysis.map(analysis => {
                return analysis.get_metric(metric)
            }).filter(e => e != null)
        )
        switch (metric) {
            case Metric.Mileage:
                setTitle("Mileage");
                setYTitle("Mileage");
                setYUnit("miles");
                break;
            case Metric.Pace:
                setTitle("Pace");
                setYTitle("Pace");
                setYUnit("minutes/miles");
                break;
            case Metric.ActiveTime:
                setTitle("Active Time");
                setYTitle("Active Time");
                setYUnit("minutes");
                break;
        }
    }, [weeklyAnalysis, metric]);

    return (
        <>
            <BottomGrows
                topChild={
                    <div className="mb-4 flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="metric" className="text-sm">Metric: </label>
                            <select
                                name="metric"
                                id="metric"
                                value={metric}
                                onChange={(e) => setMetric(e.target.value as Metric)}
                                className="p-1.5 border border-gray-600 bg-gray-800 rounded-sm text-white text-sm w-32"
                            >
                                {allMetrics.map((metric) => (
                                    <option key={metric} value={metric}>{metric}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                }
                bottomChild={
                    <Chart
                        data={data}
                        title={title}
                        yTitle={yTitle}
                        yUnit={yUnit}
                    />
                }
            />
        </>
    );
};

export default SingleMetricChart;
