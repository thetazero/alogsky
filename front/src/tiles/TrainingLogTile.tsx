import React from "react";
import Analysis from "../analysis/analysis";
import TrainingLog from "../components/TrainingLog";
import TrainingSummary from "../components/TrainingSummary";

export interface TrainingLogTileProps {
    analysis: Analysis;
}


const TrainingLogTile: React.FC<TrainingLogTileProps> = ({ analysis }) => {
    return (
        <div className="w-full">
            <div className="mb-4">
                <TrainingSummary analysis={analysis} />
            </div>
            <TrainingLog processed={analysis.training_data} />
        </div>
    );
};

export default TrainingLogTile;
