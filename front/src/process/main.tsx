import { Exercise, LiftData, RepData, RunData } from "../types";
import { meters } from "@buge/ts-units/length";
import { seconds, minutes } from "@buge/ts-units/time";
import { celsius } from "@buge/ts-units/temperature";
import { kilograms } from "@buge/ts-units/mass";
import { Mass as MassDimension } from "@buge/ts-units/mass/dimension";
import { Mass } from "@buge/ts-units/mass";
import { pounds } from "../types";
import { Unit } from "@buge/ts-units";

export type ActivityData = RunData | LiftData;

function process(data: any[]): ActivityData[] {
    return data.map(_process);
}

const proc_map: { [key: string]: (point: any, date: Date) => ActivityData } = {
    "run1": process_run_v1,
    "run2": process_run_v2,
    "lift1": process_liftv1,
}

function _process(point: any) {
    const version = point.version;
    const type = point.type;
    const date = new Date(point.date);
    const data = point.data;
    return proc_map[`${type}${version}`](data, date);
}

function process_run_v1(data: any, date: Date): RunData {
    const title: string = data.title;
    const notes: string = data.notes;
    const distance = meters(parseFloat(data.distance));
    const duration = seconds(parseFloat(data.duration));
    return { title, notes, distance, moving_time: duration, date, type: "run" };
}
function process_run_v2(data: any, date: Date): RunData {
    const title: string = data.title;
    const distance = meters(parseFloat(data.distance));
    const moving_time = seconds(parseFloat(data.moving_time));
    const elapsed_time = seconds(parseFloat(data.elapsed_time));

    const temperature = data.temperature !== '' ? celsius(parseFloat(data.temperature)) : undefined;
    const feels_like = data.feels_like !== '' ? celsius(parseFloat(data.feels_like)) : undefined;

    return {
        title,
        notes: "",
        distance,
        moving_time,
        elapsed_time,
        temperature,
        feels_like,
        date,
        type: "run"
    };
}

function parse_weight(weight: string): Mass {
    const [value, unit] = weight.split(" ");
    const unit_map: { [key: string]: Unit<number, MassDimension> } = {
        "lbs": pounds,
        "kg": kilograms,
    }
    if (unit in unit_map) {
        return unit_map[unit](parseFloat(value));
    } else {
        return pounds(parseFloat(value));
    }
}

const exercise_map: Map<string, Exercise> = new Map(
    [
        ["Squat", Exercise.Squat],
        ["Bench", Exercise.Bench],
        ["Romanian Deadlift", Exercise.RomanianDeadLift],
        ["Oxidative Squat", Exercise.OxidativeSquat],
        ["Bicep Curl", Exercise.BicepCurl],
        ["Rows", Exercise.Row],
        ["Pullups", Exercise.Pullup],
        ["Single Leg Calf Raise", Exercise.SingleLegCalfRaise],
        ["Lateral Raise", Exercise.LateralRaise],
        ["Overhead Press", Exercise.OverheadPress],
        ["Pushup", Exercise.Pushup],
        ["Situp", Exercise.Situp],
    ],
);

function parse_exercise(exercise: string): Exercise {
    const res = exercise_map.get(exercise)
    if (res) return res
    throw `${exercise} is not a valid exercise`
}

function process_liftv1(data: any, date: Date): LiftData {
    const title: string = data.title ?? "Lift"
    const notes: string = data.notes ?? undefined;
    const duration = minutes(data.duration);
    const reps = data.exercises.map((exercise: any) => {
        const rep_data: RepData = {
            exercise: parse_exercise(exercise.exercise),
            reps: exercise.reps,
            weight: parse_weight(`${exercise.weight}`),
        }
        return rep_data;
    });
    return {
        title,
        notes,
        duration,
        date,
        type: "lift",
        reps,
    };
}


export default process
