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
import zoomPlugin from 'chartjs-plugin-zoom';

export interface DataPoint {
    date: Date,
    y: number,
    label: string
}

export interface ChartProps {
    data: DataPoint[],
    title: string,
    yTitle: string,
    yUnit: string,
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin,
);

const Chart: React.FC<ChartProps> = ({ data, yTitle, yUnit, title }) => {
    const [graphData, setGraphData] = useState<ChartData | null>(null);
    const [graphOptions, setGraphOptions] = useState<ChartOptions | null>(null);
    const [sortedData, setSortedData] = useState<DataPoint[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [yValues, setYValues] = useState<number[]>([]);
    const [pointLabels, setPointLabels] = useState<string[]>([]); // To store labels for each data point

    useEffect(() => {
        setSortedData(data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    }, [data]);

    useEffect(() => {
        setLabels(sortedData.map((run) => run.date.toLocaleDateString('en-GB', {
            year: "numeric",
            day: "numeric",
            month: "numeric",
        })));
        setYValues(sortedData.map((run) => run.y));
        setPointLabels(sortedData.map((run) => run.label)); // Update point labels
    }, [sortedData]);

    useEffect(() => {
        setGraphData({
            labels: labels,
            datasets: [
                {
                    label: `${yTitle} (${yUnit})`,
                    data: yValues,
                    borderColor: "#4CAF50",
                    backgroundColor: "rgba(76, 175, 80, 0.2)",
                    borderWidth: 2,
                    pointRadius: 2,
                    pointBackgroundColor: "#4CAF50",
                    tension: 0.4,
                },
            ],
        });
    }, [labels, yTitle, yUnit, yValues]);

    useEffect(() => {
        setGraphOptions({
            responsive: true,
            plugins: {
                legend: {
                    position: "top" as const,
                },
                title: {
                    display: false,
                    text: title,
                    font: {
                        size: 24,
                    }
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        mode: 'x', // Zooming on both axes
                    },
                    pan: {
                        enabled: true,
                        mode: 'x', // Panning on both axes
                        threshold: 10,
                    },
                },
                tooltip: {
                    callbacks: {
                        // Show the label in the tooltip
                        label: (tooltipItem) => {
                            const index = tooltipItem.dataIndex;
                            return pointLabels[index];
                        },
                    },
                },
            },
            scales: {
                x: {
                    title: {
                        display: false,
                        text: "Date",
                        font: {
                            size: 16,
                        }
                    },
                },
                y: {
                    title: {
                        display: false,
                        text: `${yTitle} (${yUnit})`,
                        font: {
                            size: 16,
                        }
                    },
                    ticks: {
                        callback: (value) => {
                            return `${value} ${yUnit}`;
                        },
                    },
                },
            },
        });
    }, [title, yTitle, pointLabels, yUnit]);

    return (
        <div className="w-full h-full">
            {
                graphData != null ? (
                    // @ts-ignore
                    <Line data={graphData} options={graphOptions} /> 
                ) : (
                    <div>loading...</div>
                )
            }
        </div>
    );
};

export default Chart;
