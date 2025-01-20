import React from "react";
import Analysis from "../analysis/analysis";
import TrainingLog from "../components/TrainingLog";
import TrainingSummary from "../components/TrainingSummary";
import BottomGrows from "../components/BottomGrows";
import Tile from "../components/Tile";

export interface TrainingLogTileProps {
    analysis: Analysis;
}


const TrainingLogTile: React.FC<TrainingLogTileProps> = ({ analysis }) => {
    return (
        <Tile title="Training Log">
            <BottomGrows
                topChild={
                    <div className="mb-4">
                        <TrainingSummary analysis={analysis} />
                    </div>
                }
                bottomChild={
                    <TrainingLog processed={analysis.training_data} />
                }
            />
        </Tile>
    );
};

export default TrainingLogTile;
