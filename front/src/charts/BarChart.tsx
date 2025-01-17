import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { hue_from_string } from "../utils/color";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export type BarChartData = {
    label: string;
    data: number[];
}


export type BarChartDataSet = {
    labels: string[];
    datasets: BarChartData[];
}

export interface BarChartProps {
    data: BarChartDataSet;
    title?: string;
}

type BarChartInternalData = {
    label: string;
    data: number[];
    backgroundColor: string;
}

type BarChartInternalDataSet = {
    labels: string[];
    datasets: BarChartInternalData[];
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
    const [internalData, setInternalData] = React.useState<BarChartInternalDataSet>(
        { labels: [], datasets: [] }
    );

    useEffect(() => {
        const starting_hue = hue_from_string(data.labels.reduce((acc, label) => acc + label, ''));
        setInternalData({
            labels: data.labels,
            datasets: data.datasets.map((dataset, i) => {
                const hue = Math.floor(Math.abs(starting_hue + i * (360 / data.datasets.length)));
                return {
                    label: dataset.label,
                    data: dataset.data,
                    backgroundColor: `hsl(${hue}, 50%, 50%)`,
                }
            }),
        });
    }, [data]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#d1d5db', // Tailwind text-gray-300
                },
            },
            title: {
                display: !!title,
                text: title,
                color: '#f9fafb', // Tailwind text-gray-100
                font: { size: 18 },
            },
        },
        scales: {
            x: {
                ticks: { color: '#d1d5db' }, // Tailwind text-gray-300
                grid: { color: '#374151' }, // Tailwind bg-gray-600
            },
            y: {
                ticks: { color: '#d1d5db' }, // Tailwind text-gray-300
                grid: { color: '#374151' }, // Tailwind bg-gray-600
            },
        },
    };

    return (
        <div className="w-full h-full">
            <Bar options={options} data={internalData} height={300} />
        </div>
    );
};

export default BarChart;
