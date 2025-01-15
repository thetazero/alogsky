import { Exercise, PainLogData, KayakData, LiftData, RepData, RunData, SleepData, TrainingData, PainAtLocationLogData, PainAtLocationData } from "../types";
import { meters } from "@buge/ts-units/length";
import { seconds, minutes } from "@buge/ts-units/time";
import { celsius } from "@buge/ts-units/temperature";
import { kilograms } from "@buge/ts-units/mass";
import { Mass as MassDimension } from "@buge/ts-units/mass/dimension";
import { Mass } from "@buge/ts-units/mass";
import { pounds } from "../types";
import { Unit } from "@buge/ts-units";
import BodyLocation, { BodyLocationWithoutSide, Side } from "../pt/body_location";
import { get_day_string } from "../utils/time";

function parse(data: any[]): [TrainingData[], string[]] {
    const parsed = data.map(_parse);
    const training_data = parsed.filter(d => typeof d !== 'string')
    const errors = parsed.filter(d => typeof d === 'string')

    const [training_data_post, errors_post] = post_process(training_data)
    return [training_data_post, errors.concat(errors_post)]
}

function post_process(training_data: TrainingData[]): [TrainingData[], string[]] {
    const errors: string[] = []
    const sleep_days = new Set()
    training_data = training_data.filter((data) => {
        if (data.type === "sleep") {
            const day_string = get_day_string(data.date)
            if (sleep_days.has(day_string)) {
                errors.push(`Duplicate sleep log on ${day_string}`)
                return false
            } else {
                sleep_days.add(day_string)
                return true
            }
        }
        return true
    })
    return [training_data, errors]
}

const proc_map: { [key: string]: (point: any, date: Date) => TrainingData } = {
    "run1": parse_run_v1,
    "run2": parse_run_v2,
    "lift1": parse_liftv1,
    "sleep1": parse_sleepv1,
    "pain1": parse_painv1,
    "pain2": parse_painv2,
    "lift2": parse_liftv2,
    "kayak1": parse_kayakv1,
}

function _parse(point: any): TrainingData | string {
    const version = point.version;
    const type = point.type;
    const date = new Date(point.date);
    const data = point.data;
    const key = `${type}${version}`;
    if (!(key in proc_map)) {
        return `No processor for ${type} version ${version}`
    }
    try {
        return proc_map[key](data, date);
    } catch (error) {
        return `${error}`
    }
}

function parse_run_v1(data: any, date: Date): RunData {
    const title: string = data.title;
    const notes: string = data.notes;
    const distance = meters(parseFloat(data.distance));
    const duration = seconds(parseFloat(data.duration));
    return { title, notes, distance, moving_time: duration, date, type: "run" };
}
function parse_run_v2(data: any, date: Date): RunData {
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

function split_unit(input: string): [string, string] {
    const match = input.match(/^\s*([\d.]+)\s*([a-zA-Z]*)$/);
    if (match) {
        return [match[1], match[2] || ""];
    } else {
        throw new Error("Input string does not match the expected format.");
    }
}

export function parse_weight(weight: string | number | undefined): Mass {
    if (weight === undefined) return pounds(0)
    if (typeof weight === 'number') return pounds(weight)
    const [value, unit] = split_unit(weight)
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

const defaults_for_exercise_map: [string, Exercise][] = Object.values(Exercise).map((exc) => [exc.toLowerCase(), exc])
const exercise_map: Map<string, Exercise> = new Map(
    [
        ["rows", Exercise.Row],
        ["pullups", Exercise.Pullup],
        ["pull ups", Exercise.Pullup],
        ["pull up", Exercise.Pullup],
        ["push up", Exercise.Pushup],
        ["dumbell 1 leg, 1 arm rdl", Exercise.DumbellOneLegOneArmRomanialDeadLift],
        ["knee drive push leg thing", Exercise.SupineKneeDrive],
        ...defaults_for_exercise_map
    ],
);

function parse_exercise(exercise: string): Exercise {
    const res = exercise_map.get(exercise.toLowerCase())
    if (res) return res
    throw `${exercise} is not a valid exercise`
}

function parse_liftv1(data: any, date: Date): LiftData {
    const title: string = data.title ?? "Lift"
    const notes: string = data.notes ?? undefined;
    const duration = minutes(parseFloat(data.duration));
    const reps = data.exercises.map((exercise: any) => {
        const rep_data: RepData = {
            exercise: parse_exercise(exercise.exercise),
            reps: parseInt(exercise.reps),
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

export function natural_reps_parse(str: string): RepData[] {
    const [exercise, reps] = str.split(":")
    const exc = parse_exercise(exercise)
    return reps.split(",").map(rep_str => {
        if (rep_str.trim() === "") return null
        const [times, weight] = rep_str.split("x")
        const repdata: RepData = {
            exercise: exc,
            reps: parseInt(times),
            weight: parse_weight(weight)
        }
        return repdata
    }).filter(rep => rep !== null)
}

function parse_liftv2(data: any, date: Date): LiftData {
    const title = data.title
    const duration = minutes(parseFloat(data.duration ?? 0));
    const notes = data.notes
    const reps = data.exercises.map((exercise: any) => {
        if (typeof exercise === 'string') {
            return natural_reps_parse(exercise)
        } else {
            if (exercise.reps.length) {
                const exc_rep = []
                for (let i = 0; i < exercise.reps.length; i++) {
                    exc_rep.push({
                        exercise: parse_exercise(exercise.exercise),
                        reps: parseInt(exercise.reps[i]),
                        weight: parse_weight(exercise.weight[i]),
                    })
                }
                return exc_rep
            } else {
                return {
                    exercise: parse_exercise(exercise.exercise),
                    reps: parseInt(exercise.reps),
                    weight: parse_weight(`${exercise.weight}`),
                }
            }
        }
    }).flat()
    return {
        title,
        notes,
        duration,
        reps,
        date,
        type: "lift",
    }
}

function parse_sleepv1(data: any, date: Date): SleepData {
    return {
        date,
        duration: minutes(parseFloat(data.duration)),
        type: "sleep",
    };
}
const location_map_default: [string, BodyLocationWithoutSide][] = Object.values(BodyLocationWithoutSide).map((loc) => [loc.toLowerCase(), loc])
const locations_map: Map<string, BodyLocationWithoutSide> = new Map([
    ...location_map_default,
    ["lower shin", BodyLocationWithoutSide.Shin],
    ["both shins", BodyLocationWithoutSide.Shin],
    ["hamstrings", BodyLocationWithoutSide.Hamstring],
    ["achilles", BodyLocationWithoutSide.AchillesTendon],
]);

export function parse_body_location(str: string): BodyLocation {
    str = str.trim().toLocaleLowerCase()

    let side: Side;
    if (str.slice(0, 4) === "left") side = Side.Left
    else if (str.slice(0, 5) === "right") side = Side.Right
    else side = Side.NoSide

    const location = str.replace(/left|right/g, "").trim()
    const location_enum = locations_map.get(location)

    if (location_enum) return new BodyLocation(location_enum, side)
    throw `${str} is not a valid body location`
}

function parse_painv1(data: any, date: Date): PainLogData {
    const pains: PainAtLocationLogData[] = data.map((pain: any) => {
        return {
            pain: pain.pain,
            description: pain.description,
            location: parse_body_location(pain.location),
        }
    });
    const location_set = new Set()
    for (const pain of pains) {
        if (location_set.has(pain.location.to_string())) {
            throw `Duplicate location ${pain.location.to_string()} in pain log on ${date.toDateString()}`
        }
        location_set.add(pain.location.to_string())
    }
    return { pains, date, type: "pain" };
}

function parse_painv2(data: any, date: Date): PainLogData {
    const pain_at_location: PainAtLocationLogData[] = data.map((point: any) => {
        const description = point.description
        const snapshots = point.snapshots.map((snap: any) => {
            const [location, pain] = extract_paren_data(snap)
            return {
                description,
                pain: parseInt(pain),
                location: parse_body_location(location),
            }
        })
        return snapshots
    }).flat()
    return { pains: pain_at_location, date, type: "pain" }
}

function parse_kayakv1(data: any, date: Date): KayakData {
    return {
        duration: minutes(parseFloat(data.duration)),
        date,
        type: "kayak",
    }
}

export function extract_paren_data(data: string): [string, string] {
    const match = data.match(/(.*)\((.*)\)/)
    if (match) {
        return [match[1].trim(), match[2].trim()]
    } else {
        return [data.trim(), ""]
    }
}

export default parse
