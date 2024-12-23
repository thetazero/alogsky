import React, { useEffect, useState } from "react";
import { minutes_per_mile, RunData } from "../types";
import Chart from "../components/Chart";
import { DataPoint } from "../components/Chart";
import { fmt_minutes_per_mile } from "../utils/format";
import { miles } from "@buge/ts-units/length";
import { minutes } from "@buge/ts-units/time";
import NumberInput from "../components/NumberInput"; // Adjust the import path based on your project structure

interface MileageChartProps {
    runs: RunData[];
}

enum Metrics {
    Mileage = "Mileage",
    Pace = "Pace",
    ActiveTime = "Active Time",
}
const allMetrics: Metrics[] = Object.values(Metrics);

const SingleMetricChart: React.FC<MileageChartProps> = ({ runs }) => {
    const [data, setData] = useState<DataPoint[]>([]);

    const [rollingAverageWindow, setRollingAverageWindow] = useState(30); // Default rolling average window size
    const [metric, setMetric] = useState<Metrics>(Metrics.Mileage);

    const [title, setTitle] = useState<string>("");
    const [yTitle, setYTitle] = useState<string>("");
    const [yUnit, setYUnit] = useState<string>("");
    const [labelFn, setLabelFn] = useState<((value: number) => string) | null>(null);

    useEffect(() => {
        switch (metric) {
            case Metrics.Mileage:
                setTitle("Mileage");
                setYTitle("Mileage");
                setYUnit("miles");
                setData(
                    runs.map((run) => ({
                        date: run.date,
                        y: run.distance.in(miles).amount,
                    }))
                )
                setLabelFn(() => (value: number) => `${value.toFixed(1)} miles`);
                break;
            case Metrics.Pace:
                setTitle("Pace");
                setYTitle("Pace");
                setYUnit("minutes/miles");
                setData(
                    runs.map((run) => ({
                        date: run.date,
                        y: (run.moving_time.per(run.distance)).in(minutes_per_mile).amount,
                    }))
                )
                setLabelFn(() => (value: number) => fmt_minutes_per_mile(minutes_per_mile(value)));
                break;
            case Metrics.ActiveTime:
                setTitle("Active Time");
                setYTitle("Active Time");
                setYUnit("minutes");
                setData(
                    runs.map((run) => ({
                        date: run.date,
                        y: run.moving_time.in(minutes).amount,
                    }))
                )
                setLabelFn(() => (value: number) => `${value.toFixed(0)} minutes`);
                break;
        }
    }, [runs, metric]);

    return (
        <>
            <div className="mb-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <label htmlFor="metric" className="text-sm">Metric: </label>
                    <select
                        name="metric"
                        id="metric"
                        value={metric}
                        onChange={(e) => setMetric(e.target.value as Metrics)}
                        className="p-1.5 border border-gray-600 bg-gray-800 rounded-sm text-white text-sm w-32"
                    >
                        {allMetrics.map((metric) => (
                            <option key={metric} value={metric}>{metric}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center space-x-2">
                    <label htmlFor="rolling-window" className="text-sm">Rolling Average Window Size: </label>
                    <NumberInput
                        value={rollingAverageWindow}
                        onChange={setRollingAverageWindow}
                        min={1}
                        max={100}
                        step={1}
                        className="w-32"
                    />
                </div>
            </div>
            <Chart
                data={data}
                title={title}
                yTitle={yTitle}
                yUnit={yUnit}
                labelFn={labelFn}
                options={{ rollingAverageWindow }}
            />
        </>
    );
};

export default SingleMetricChart;
