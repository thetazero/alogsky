import Tile from "../components/Tile";
import panelComponentType from "./tileType";
import { RunData } from "../types";
import { miles } from "@buge/ts-units/length";
import { fmt_minutes_per_mile } from "../utils/format";
import Intervals from "../components/Intervals";


const RunTile: panelComponentType = ({ id, data }) => {
    const runData = data as RunData;
    return (
        <Tile title={runData.title} id={id}>
            <p>
                {
                    runData.workout ? <Intervals intervals={runData.workout.intervals} /> : ''
                }
                {data.distance.in(miles).amount.toFixed(2)} miles |{" "}
                {fmt_minutes_per_mile(data.moving_time.per(data.distance))} | {""}
                {
                    data.shoe
                }
            </p>
        </Tile>
    );
};

export default RunTile;
