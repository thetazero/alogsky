import React, { useEffect, useState } from "react";
import Analysis from "../analysis/analysis";
import BottomGrows from "../components/BottomGrows";
import BarChart, { BarChartData, BarChartDataSet } from "../charts/BarChart";
import { get_week_start } from "../utils/time";
import { Metric } from "../types";

function getDataForMetric(analysis: Analysis, metric: Metric, weeks: number): BarChartData {
    const data: {
        label: string;
        data: number[];
        backgroundColor: string;
    } = {
        label: metric,
        data: [],
        backgroundColor: metric === Metric.Mileage ? "#6366f1" : "red"
    }
    for (let i = 0; i < weeks; i++) {
        const week_data = analysis.get_metric_for_week(metric, i)
        data.data.push(week_data);
    }
    return data
}

export interface TrainingSummaryTileProps {
    analysis: Analysis;
}

const TrainingSummaryTile: React.FC<TrainingSummaryTileProps> = ({ analysis }) => {
    const [barData, setBarData] = React.useState<BarChartDataSet>({ labels: [], datasets: [] });
    const [metrics, setMetrics] = useState<Metric[]>([Metric.Mileage, Metric.Tonage])

    useEffect(() => {
        if (analysis.training_data.length === 0) return
        const first_date = get_week_start(analysis._get_oldest_date() as Date);
        const labels = []
        while (first_date <= new Date()) {
            labels.push(first_date.toDateString());
            first_date.setDate(first_date.getDate() + 7);
        }
        setBarData({
            labels: labels,
            datasets: metrics.map((metric) => getDataForMetric(analysis, metric, labels.length)),
        });
    }, [analysis]);

    return (
        <BottomGrows
            topChild={
                <></>
            }
            bottomChild={
                <div className="mb-4 card level-2">
                    <BarChart
                        data={barData} title="Weekly Mileage"
                    />
                </div>
            }
        />
    );
};

export default TrainingSummaryTile;
