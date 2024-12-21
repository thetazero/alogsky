
import React, { useEffect, useState } from "react";
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
    ChartData,
    ChartOptions,
} from "chart.js";

export interface DataPoint {
    date: Date,
    y: number,
}

export interface ChartProps {
    data: DataPoint[],
    title: string,
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


const Chart: React.FC<ChartProps> = ({ data, options, yTitle, yUnit, title }) => {
    const [graphData, setGraphData] = useState<ChartData | null>(null);
    const [graphOptions, setGraphOptions] = useState<ChartOptions | null>(null);
    const [sortedData, setSortedData] = useState<DataPoint[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [yValues, setYValues] = useState<number[]>([]);
    const [smoothedYValues, setSmoothedYValues] = useState<number[]>([]);

    useEffect(() => {
        setSortedData(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    }, [data]);

    useEffect(() => {
        setLabels(sortedData.map((run) => run.date.toDateString()));
    }, [sortedData]);

    useEffect(() => {
        setYValues(sortedData.map((run) => run.y));
    }, [sortedData]);

    useEffect(() => {
        setSmoothedYValues(calculateRollingAverage(yValues, options.rollingAverageWindow));
    }, [yValues, options.rollingAverageWindow]);

    useEffect(() => {
        setGraphData({
            labels: labels,
            datasets: [
                {
                    label: `${yTitle} (${yUnit})`,
                    data: smoothedYValues,
                    borderColor: "#4CAF50",
                    backgroundColor: "rgba(76, 175, 80, 0.2)",
                    borderWidth: 2,
                    pointRadius: 2, // Smaller point radius to reduce spikiness
                    pointBackgroundColor: "#4CAF50",
                    tension: 0.4, // Add smoothing to the line
                },
            ],
        });
    }, [smoothedYValues, labels, yTitle, yUnit]);

    useEffect(() => {
        setGraphOptions({
            responsive: true,
            plugins: {
                legend: {
                    position: "top" as const,
                },
                title: {
                    display: true,
                    text: title,
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
                        text: yTitle,
                    },
                    beginAtZero: true,
                },
            },
        });
    }, [title, yTitle]);

    return (
        <div>
            {
                graphData != null ? (
                    <Line data={graphData} options={graphOptions} />
                ) : (
                    <div>loading...</div>
                )
            }
        </div>
    );
};

export default Chart;
