import React, { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { RunData } from "../types";
import { meters_to_miles } from "../utils/unit_conversion";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface MileageChartProps {
    runs: RunData[];
}

const calculateRollingAverage = (data: number[], windowSize: number): number[] => {
    const averages: number[] = [];
    for (let i = 0; i < data.length; i++) {
        const start = Math.max(0, i - windowSize + 1);
        const window = data.slice(start, i + 1);
        const average = window.reduce((sum, value) => sum + value, 0) / window.length;
        averages.push(average);
    }
    return averages;
};

const MileageChart: React.FC<MileageChartProps> = ({ runs }) => {
    const [rollingAverageWindow, setRollingAverageWindow] = useState(3); // Default rolling average window size

    // Prepare data for the chart
    const sortedRuns = runs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const labels = sortedRuns.map((run) => run.date.toDateString());
    const distances = sortedRuns.map((run) => parseFloat(meters_to_miles(run.distance).toFixed(2))); // Convert meters to miles

    // Apply rolling average
    const smoothedDistances = calculateRollingAverage(distances, rollingAverageWindow);

    const data = {
        labels,
        datasets: [
            {
                label: "Distance (miles, smoothed)",
                data: smoothedDistances,
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                borderWidth: 2,
                pointRadius: 2, // Smaller point radius to reduce spikiness
                pointBackgroundColor: "#4CAF50",
                tension: 0.4, // Add smoothing to the line
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Mileage Chart",
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Date",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Distance (miles)",
                },
                beginAtZero: true,
            },
        },
    };

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
            <Line data={data} options={options} />
        </div>
    );
};

export default MileageChart;
