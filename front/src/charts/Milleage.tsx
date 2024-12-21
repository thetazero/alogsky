import React, { useEffect, useState } from "react";
import { MinutesPerMile, RunData, SecondsPerMeter } from "../types";
import { meters_to_miles, seconds_per_meter_to_minutes_per_mile } from "../utils/unit_conversion";
import Chart from "../components/Chart";
import { DataPoint } from "../components/Chart";
import { fmt_minutes_per_mile } from "../utils/format";

interface MileageChartProps {
    runs: RunData[];
}

enum Metrics {
    Mileage = "Mileage",
    Pace = "Pace",
    ActiveTime = "Active Time",
}
const allMetrics: Metrics[] = Object.values(Metrics);

const MileageChart: React.FC<MileageChartProps> = ({ runs }) => {
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
                        y: parseFloat(meters_to_miles(run.distance).toFixed(2)), // Convert meters to miles
                    }))
                )
                setLabelFn(null);
                break;
            case Metrics.Pace:
                setTitle("Pace");
                setYTitle("Pace");
                setYUnit("minutes/miles");
                setData(
                    runs.map((run) => ({
                        date: run.date,
                        y: seconds_per_meter_to_minutes_per_mile(run.moving_time / run.distance as SecondsPerMeter), // Convert seconds per meter to minutes per mile
                    }))
                )
                const fn = (value: number) => {
                    const minutes_per_mile: MinutesPerMile = value as MinutesPerMile
                    return `${fmt_minutes_per_mile(minutes_per_mile)}/mile`
                }
                setLabelFn(() => fn);
                break;
            case Metrics.ActiveTime:
                setTitle("Active Time");
                setYTitle("Active Time");
                setYUnit("minutes");
                setData(
                    runs.map((run) => ({
                        date: run.date,
                        y: run.moving_time / 60, // Convert seconds to minutes
                    }))
                )
                setLabelFn(null);
                break;
        }
    }, [runs, metric]);
    console.log(labelFn);
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

export default MileageChart;
