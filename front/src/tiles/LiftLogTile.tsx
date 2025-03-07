import TrainingLog from "../components/TrainingLog";
import Tile from "../components/Tile";
import panelComponentType from "./tileType";


const LiftLogTile: panelComponentType = ({ dataset, id }) => {
    return (
        <Tile title="Lift Log" id={id}>
            <TrainingLog processed={dataset.lifts} />
        </Tile>
    );
};

export default LiftLogTile;
