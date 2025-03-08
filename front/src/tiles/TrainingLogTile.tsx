import Analysis from "../analysis/analysis";
import TrainingLog from "../components/TrainingLog";
import TrainingSummary from "../components/TrainingSummary";
import BottomGrows from "../components/BottomGrows";
import Tile from "../components/Tile";
import panelComponentType from "./tileType";


const TrainingLogTile: panelComponentType = ({ dataset, id }) => {
    return (
        <Tile title="Training Log" id={id}>
            <BottomGrows
                topChild={
                    <div className="mb-4">
                        <TrainingSummary analysis={new Analysis(dataset)} />
                    </div>
                }
                bottomChild={
                    <TrainingLog processed={dataset.data.slice().reverse()} />
                }
            />
        </Tile>
    );
};

export default TrainingLogTile;
