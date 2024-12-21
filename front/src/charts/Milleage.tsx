import React, { useEffect, useState } from "react";
import { RunData, SecondsPerMeter } from "../types";
import { meters_to_miles, seconds_per_meter_to_minutes_per_mile } from "../utils/unit_conversion";
import Chart from "../components/Chart";
import { DataPoint } from "../components/Chart";

interface MileageChartProps {
    runs: RunData[];
}

const MileageChart: React.FC<MileageChartProps> = ({ runs }) => {
    const [rollingAverageWindow, setRollingAverageWindow] = useState(3); // Default rolling average window size
    const [data, setData] = useState<DataPoint[]>([]);

    useEffect(() => {
        const mileageData = runs.map((run) => ({
            date: run.date,
            y: parseFloat(meters_to_miles(run.distance).toFixed(2)), // Convert meters to miles
        }));
        const paceData = runs.map((run) => ({
            date: run.date,
            y: seconds_per_meter_to_minutes_per_mile(run.moving_time / run.distance as SecondsPerMeter), // Convert seconds per meter to minutes per mile
        }));
        const activeTimeData = runs.map((run) => ({
            date: run.date,
            y: run.moving_time / 60, // Convert seconds to minutes
        }));
        setData(activeTimeData);
    }, [runs]);
    return (
        <div>
            <div style={{ marginBottom: "20px" }}>
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
                title="Mileage Over Time"
                yTitle="Miles"
                yUnit="mi"
                options={{ rollingAverageWindow }}
            />
        </div>
    );
};

export default MileageChart;
