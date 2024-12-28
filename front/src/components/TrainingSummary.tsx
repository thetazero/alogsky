import React from "react";
import Analysis from "../analysis/analysis";
import { miles } from "@buge/ts-units/length";
import { hours } from "@buge/ts-units/time";
import Chip from "./Chip";

export interface TrainingSummaryProps {
    analysis: Analysis;
}

const TrainingSummary: React.FC<TrainingSummaryProps> = ({ analysis }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-4">
            <Chip title={analysis.total_tonage().amount.toFixed(0)} subtitle="Total Tonnage" />
            <Chip title={analysis.total_distance().in(miles).amount.toFixed(1)} subtitle="Total Mileage" />
            <Chip title={analysis.training_time().in(hours).amount.toFixed(1)} subtitle="Training Time" />
            <Chip title={analysis.runs.length.toString()} subtitle="Runs" />
            <Chip title={analysis.lifts.length.toString()} subtitle="Lifts" />
        </div>
    );
};

export default TrainingSummary;
