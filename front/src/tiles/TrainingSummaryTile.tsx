import React, { useEffect } from "react";
import Analysis from "../analysis/analysis";
import BottomGrows from "../components/BottomGrows";
import BarChart, { BarChartData } from "../charts/BarChart";
import { get_week_start } from "../utils/time";
import { pounds } from "../types";
import { miles } from "@buge/ts-units/length";

export interface TrainingSummaryTileProps {
    analysis: Analysis;
}


const TrainingSummaryTile: React.FC<TrainingSummaryTileProps> = ({ analysis }) => {
    const [barData, setBarData] = React.useState<BarChartData>({ labels: [], datasets: [] });

    useEffect(() => {
        if(analysis.training_data.length === 0) return
        const first_date = get_week_start(analysis._get_oldest_date() as Date);
        const lables = []
        while (first_date <= new Date()) {
            lables.push(first_date.toDateString());
            first_date.setDate(first_date.getDate() + 7);
        }
        const milleage_data: {
            label: string;
            data: number[];
            backgroundColor: string;
        } = {
            label: "Mileage",
            data: [],
            backgroundColor: "#6366f1"
        }
        for (let i = 0; i < lables.length; i++) {
            const week_data = analysis.get_data_for_week(i);
            const milleage = week_data.filter(e => e.type === "run").reduce((acc, e) => acc.plus(e.distance), miles(0));
            milleage_data.data.push(milleage.in(miles).amount);
        }
        setBarData({ labels: lables, datasets: [milleage_data] });
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
