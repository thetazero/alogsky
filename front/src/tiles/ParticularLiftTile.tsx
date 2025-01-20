import { useEffect, useState } from "react";
import Tile from "../components/Tile";
import panelComponentType from "./tileType";
import { Exercise, RepData } from "../types";
import { fmt_quantity } from "../utils/format";
import ScrollableTable from "../components/Table";

type LiftHistory = {
    reps: RepData[],
    date: Date
}[]

const ParticularLiftTile: panelComponentType = ({ analysis, id }) => {
    const [exercise, setExercise] = useState<Exercise>(Exercise.Squat);

    const [history, setHistory] = useState<LiftHistory>([]);

    useEffect(() => {
        const lifts = analysis.lifts
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
    }, [analysis, exercise])


    return (
        <Tile title={`${exercise} history`} id={id}>
            {exercise}
            {
                <ScrollableTable
                    headers={["Date", "Reps"]}
                    table={history.map(lift => {
                        return [
                            lift.date.toDateString(),
                            lift.reps.map(rep => {
                                return `${rep.reps}x${fmt_quantity(rep.weight)}`
                            }).join(", ")
                        ]
                    })}
                    height={400}
                />
            }
        </Tile>
    )
}

export default ParticularLiftTile
