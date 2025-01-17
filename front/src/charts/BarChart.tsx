import React, { useEffect, useState } from 'react';
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
import { Dimensions, Quantity, Unit } from '@buge/ts-units';
import { fmt_quantity } from '../utils/format';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export type BarChartData = {
    label: string;
    data: Quantity<number, Dimensions>[];
    unit: Unit<number, Dimensions>;
}


export type BarChartDataSet = {
    labels: string[];
    datasets: BarChartData[];
}

export interface BarChartProps {
    data_set: BarChartDataSet;
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

const BarChart: React.FC<BarChartProps> = ({ data_set, title }) => {
    const [internalData, setInternalData] = useState<BarChartInternalDataSet>(
        { labels: [], datasets: [] }
    );
    const [dataSetMap, setDataSetMap] = useState<Map<string, BarChartData>>(new Map());

    useEffect(() => {
        const starting_hue = hue_from_string(data_set.labels.reduce((acc, label) => acc + label, ''));
        setInternalData({
            labels: data_set.labels,
            datasets: data_set.datasets.map((dataset, i) => {
                const hue = Math.floor(Math.abs(starting_hue + i * (360 / data_set.datasets.length)));
                const data = dataset.data.map((d) => d.amount);
                return {
                    label: dataset.label,
                    data,
                    backgroundColor: `hsl(${hue}, 50%, 50%)`,
                }
            }),
        });
        const newDataSetMap = new Map<string, BarChartData>();
        data_set.datasets.forEach((dataset) => {
            newDataSetMap.set(dataset.label, dataset);
        });
        setDataSetMap(newDataSetMap);
    }, [data_set]);

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
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const datasetLabel = context.dataset.label || '';
                        const dataSet = dataSetMap.get(datasetLabel);
                        const value = dataSet?.data[context.dataIndex];
                        return fmt_quantity(value as Quantity<number, Dimensions>);
                    },
                },
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
