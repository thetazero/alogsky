import React, { useEffect, useState } from "react";
import { minutes_per_mile, RunData } from "../types";
import Chart from "../components/Chart";
import { DataPoint } from "../components/Chart";
import { fmt_minutes_per_mile } from "../utils/format";
import { miles } from "@buge/ts-units/length";
import { minutes } from "@buge/ts-units/time";

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
        <div>
            <div style={{ marginBottom: "20px" }}>
                <label htmlFor="metric">Metric: </label>
                <select name="metric" id="metric"
                    value={metric}
                    onChange={(e) => setMetric(e.target.value as Metrics)}
                    style={{ marginLeft: "10px", padding: "5px" }}
                >
                    {
                        allMetrics.map((metric) => (
                            <option key={metric} value={metric}>{metric}</option>
                        ))
                    }
                </select>
                <br />
                <label htmlFor="rolling-window">Rolling Average Window Size: </label>
                <input
                    id="rolling-window"
                    type="number"
                    min="1"
                    value={rollingAverageWindow}
                    onChange={(e) => setRollingAverageWindow(Number(e.target.value))}
                    style={{ marginLeft: "10px", padding: "5px" }}
                />
            </div>
            <Chart
                data={data}
                title={title}
                yTitle={yTitle}
                yUnit={yUnit}
                labelFn={labelFn}
                options={{ rollingAverageWindow }}
            />
        </div>
    );
};

export default SingleMetricChart;
