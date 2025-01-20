import React, { useEffect, useState } from "react";

import Analysis from "../analysis/analysis";
import BarChart, { BarChartData, BarChartDataSet } from "../charts/BarChart";
import BottomGrows from "../components/BottomGrows";
import SelectMultiple from "../components/SelectMultiple";
import { Metric } from "../types";
import { get_week_start } from "../utils/time";
import Tile from "../components/Tile";
import panelComponentType from "./tileType";

function getDataForMetric(analysis: Analysis, metric: Metric, weeks: number): BarChartData {
    const data: BarChartData = {
        label: metric,
        data: [],
        unit: analysis.get_unit_for_metric(metric),
    }
    for (let i = 0; i < weeks; i++) {
        const week_data = analysis.get_metric_for_week(metric, i)
        data.data.push(week_data);
    }
    return data
}

const TrainingSummaryTile: panelComponentType = ({ analysis, id }) => {
    const [barData, setBarData] = React.useState<BarChartDataSet>({ labels: [], datasets: [] })
    const [metrics, setMetrics] = useState<Metric[]>([Metric.Mileage, Metric.Tonage])
    const [weeksToShow, setWeeksToShow] = useState<number>(15)

    useEffect(() => {
        if (analysis.training_data.length === 0) return
        const first_date = get_week_start(analysis._get_oldest_date() as Date);
        const labels = []
        while (first_date <= new Date()) {
            labels.push(first_date.toDateString());
            first_date.setDate(first_date.getDate() + 7);
        }
        setBarData({
            labels: labels.slice(-weeksToShow),
            datasets: metrics.map((metric) => {
                const data = getDataForMetric(analysis, metric, labels.length)
                data.data = data.data.slice(-weeksToShow)
                return data
            }
            ),
        });
    }, [analysis, metrics, weeksToShow]);

    return (
        <Tile title="Training Summary" id={id}>
            <BottomGrows
                topChild={
                    <div className="mb-4 flex items-center space-x-4">
                        <SelectMultiple
                            options={Object.values(Metric)}
                            selected={metrics}
                            onChange={setMetrics}
                            renderOption={(option) => option}
                        />
                    </div>
                }
                bottomChild={
                    <div className="mb-4 card level-2">
                        <BarChart
                            data_set={barData} title="Weekly Mileage"
                        />
                    </div>
                }
            />
        </Tile>
    );
};

export default TrainingSummaryTile;
