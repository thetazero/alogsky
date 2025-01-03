import React from 'react';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export type BarChartData = {
    label: string;
    data: number[];
    backgroundColor: string;
}

export type BarChartDataSet = {
    labels: string[];
    datasets: BarData[];
}

export interface BarChartProps {
    data: BarChartDataSet;
    title?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {

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
            <Bar options={options} data={data} height={300} />
        </div>
    );
};

export default BarChart;
