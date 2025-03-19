import React, { useEffect, useState } from "react";

import { get_unit_for_metric, TrainingDataSet } from "../analysis/analysis";
import BarChart, { BarChartData, BarChartDataSet } from "../charts/BarChart";
import BottomGrows from "../components/BottomGrows";
import SelectMultiple from "../components/SelectMultiple";
import { Metric } from "../types";
import Tile from "../components/Tile";
import panelComponentType from "./tileType";
import NumberInput from "../components/NumberInput";

function getDataForMetric(dataset: TrainingDataSet, metric: Metric, weeks: number): BarChartData {
    const unit = get_unit_for_metric(metric)
    const data: BarChartData = {
        label: metric,
        data: [],
        unit,
    }
    for (let i = 0; i < weeks; i++) {
        const analysis = dataset.analysis_for_week(i)
        const week_data = analysis.get_metric(metric)
        data.data.push(week_data);
    }
    return data
}

const TrainingSummaryTile: panelComponentType = ({ dataset, id }) => {
    const [barData, setBarData] = React.useState<BarChartDataSet>({ labels: [], datasets: [] })
    const [metrics, setMetrics] = useState<Metric[]>([
        Metric.MeanFatigueScore,
        Metric.Mileage,
        Metric.Tonage,
    ])
    const [weeksToShow, setWeeksToShow] = useState<number>(8)

    useEffect(() => {
        if (dataset.data.length === 0) return
        const [first_date, _] = dataset.date_range_for_week(0)
        const labels = []
        while (first_date <= new Date()) {
            labels.push(first_date.toDateString());
            first_date.setDate(first_date.getDate() + 7);
        }
        setBarData({
            labels: labels.slice(-weeksToShow),
            datasets: metrics.map((metric) => {
                const data = getDataForMetric(dataset, metric, labels.length)
                data.data = data.data.slice(-weeksToShow)
                return data
            }
            ),
        });
    }, [dataset, metrics, weeksToShow]);

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
                        <NumberInput
                            value={weeksToShow}
                            onChange={setWeeksToShow}
                            label="Weeks"
                        />
                    </div>
                }
                bottomChild={
                    <div className="mb-4 card level-2">
                        <BarChart
                            data_set={barData} title="Metrics"
                        />
                    </div>
                }
            />
        </Tile>
    );
};

export default TrainingSummaryTile;
