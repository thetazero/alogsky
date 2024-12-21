
import React from "react";
import { Line } from "react-chartjs-2";
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

export interface DataPoint {
    date: Date,
    y: number,
}

export interface ChartProps {
    data: DataPoint[],
    title: string,
    xTitle: string,
    yTitle: string,
    yUnit: string,
    options: {
        rollingAverageWindow: number,
    }
}
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

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


const Chart: React.FC<ChartProps> = ({ data, options }) => {

    const sortedRuns = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const labels = sortedRuns.map((run) => run.date.toDateString());
    const y_values = sortedRuns.map((run) => run.y);

    // Apply rolling average
    const smoothedDistances = calculateRollingAverage(y_values, options.rollingAverageWindow);

    const data_holder = {
        labels,
        datasets: [
            {
                label: "Distance (miles)",
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

    const graph_options = {
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
            <Line data={data_holder} options={graph_options} />
        </div>
    );
};

export default Chart;
