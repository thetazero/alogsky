import React from "react";
import Analysis from "../analysis/analysis";
import TrainingLog from "../components/TrainingLog";
import TrainingSummary from "../components/TrainingSummary";

export interface TrainingLogTileProps {
    analysis: Analysis; 
}


const TrainingLogTile: React.FC<TrainingLogTileProps> = ({ analysis }) => {
    return (
        <div className="w-full p-4">
            <TrainingSummary analysis={analysis} />
            <TrainingLog processed={analysis.training_data} />
        </div>
    );
};

export default TrainingLogTile;
