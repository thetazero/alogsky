import { useEffect, useState } from "react";
import Tile from "../components/Tile";
import panelComponentType from "./tileType";
import { Exercise, RepData } from "../types";
import { fmt_rep } from "../utils/format";
import ScrollableTable from "../components/Table";
import SelectSearch from "../components/SelectSearch";

type LiftHistory = {
    reps: RepData[],
    date: Date
}[]

const ParticularLiftTile: panelComponentType = ({ dataset, id }) => {
    const [exercise, setExercise] = useState<Exercise>(Exercise.Squat);

    const [history, setHistory] = useState<LiftHistory>([]);

    useEffect(() => {
        const lifts = dataset.lifts
        setHistory(
            lifts.map(lift => {
                return {
                    reps: lift.reps.filter(rep => rep.exercise === exercise),
                    date: lift.date
                }
            }).filter(
                lift => lift.reps.length > 0
            )
        )
    }, [dataset, exercise])


    return (
        <Tile title={`${exercise} history`} id={id}>
            <div className="mb-4 flex items-center space-x-4">
                <SelectSearch
                    options={Object.values(Exercise)}
                    selected={exercise}
                    onChange={setExercise}
                    renderOption={(option: Exercise) => option}
                />
            </div>
            {
                <ScrollableTable
                    headers={["Date", "Reps"]}
                    table={history.map(lift => {
                        return [
                            lift.date.toDateString(),
                            lift.reps.map(fmt_rep).join(", ")
                        ]
                    })}
                />
            }
        </Tile>
    )
}

export default ParticularLiftTile
